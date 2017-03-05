'use strict'

const download = require('download')

// load environnement configuration
const nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

// read csv file content
const async = require('async')
const path = require('path')
const fse = require('fs-extra')
const file = path.resolve(__dirname, '..', 'candidatures/candidatures.csv')
const csv = require('fast-csv')

// wordpress api
const WP = require('wpapi')
var wp = new WP({
  endpoint: global.ABIBAO.config('ABIBAO_API_GATEWAY_WPSMF_URI'),
  username: global.ABIBAO.config('ABIBAO_API_GATEWAY_WPSMF_AUTH_BASIC_USER'),
  password: global.ABIBAO.config('ABIBAO_API_GATEWAY_WPSMF_AUTH_BASIC_PASS'),
  auth: true
})

let num = 0
let candidatures = []
// parse csv
csv
  .fromPath(file)
  .on('data', (data) => {
    if (num === 0) {
      num++
    } else {
      let candidature = {
        title: data[1].trim(),
        excerpt: data[8].trim() || '...',
        content: data[9].trim() || '...',
        image: data[10].trim() || 'http://startupmarketfit.com/wp-content/uploads/2016/11/startup_logo-nologo.png'
      }
      let parts = candidature.image.split('/')
      let extension = parts[parts.length - 1].split('.')[1] || '.png'
      candidature.media = candidature.title + '.' + extension
      // *******************************
      // ***** write candidatures on disk
      // *******************************
      fse.outputJsonSync(path.resolve(__dirname, '../.cache/candidatures', candidature.title + '.json'), candidature)
      candidatures.push(candidature)
    }
  })
  .on('end', () => {
    async.eachLimit(candidatures, 1, (candidature, next) => {
      // *******************************
      // ***** download all images on disk
      // *******************************
      console.log('download image for %s', candidature.title)
      download(candidature.image)
        .then(data => {
          let target = path.resolve(__dirname, '../.cache/candidatures', candidature.media)
          fse.writeFileSync(target, data)
          next()
        })
        .catch(() => {
          download('http://startupmarketfit.com/wp-content/uploads/2016/11/startup_logo-nologo.png')
            .then(data => {
              let target = path.resolve(__dirname, '../.cache/candidatures', candidature.media)
              fse.writeFileSync(target, data)
              next()
            })
        })
    }, () => {
      // *******************************
      // ***** wordpress images
      // *******************************
      async.eachLimit(candidatures, 1, (candidature, next) => {
        console.log('create media for %s', candidature.title)
        let source = path.resolve(__dirname, '../.cache/candidatures', candidature.title + '.png')
        wp.media()
          .filter({title: candidature.title})
          .then((result) => {
            if (result.length === 0) {
              return wp.media()
                .file(source)
                .create({
                  title: candidature.title,
                  alt_text: candidature.title,
                  caption: candidature.title,
                  description: candidature.title
                })
            } else {
              return result[0]
            }
          })
          .then((media) => {
            // *******************************
            // ***** wordpress posts
            // *******************************
            console.log('create post for candidature %s with media %s', candidature.title, media.id)
            const payload = {
              title: candidature.title,
              excerpt: candidature.excerpt,
              content: candidature.content,
              status: 'publish',
              'ping_status': 'closed',
              'comment_status': 'closed',
              'featured_media': media.id,
              categories: [4]
            }
            wp.posts().filter({title: payload.title}).get()
              .then((posts) => {
                if (posts.length === 0) {
                  return wp.posts().create(payload)
                } else {
                  return wp.posts().id(posts[0].id).update(payload)
                }
              })
              .then((result) => {
                console.log('done')
                next()
              })
              .catch((error) => {
                console.log(error)
                next()
              })
          })
          .catch((error) => {
            console.log(error)
            next()
          })
      }, () => {
      })
    })
  })
