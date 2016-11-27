'use strict'

const Promise = require('bluebird')
const download = require('download')

// load environnement configuration
const nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

// read csv file content
const async = require('async')
const path = require('path')
const fs = require('fs')
const file = path.resolve(__dirname, 'candidatures.csv')
const csv = require('fast-csv')

// wordpress api
const WP = require('wpapi')
var wp = new WP({
  endpoint: nconf.get('ABIBAO_API_GATEWAY_WPSMF_URL'),
  username: nconf.get('ABIBAO_API_GATEWAY_WPSMF_AUTH_BASIC_USERNAME'),
  password: nconf.get('ABIBAO_API_GATEWAY_WPSMF_AUTH_BASIC_PASSWORD'),
  auth: true
})

const _ = require('lodash')

// parse csv
let candidatures = []
csv
  .fromPath(file)
  .on('data', (data) => {
    candidatures.push(data)
  })
  .on('end', () => {
    console.log('candidatures: ', candidatures.length)
    candidatures.shift()
    // *******************************
    // ***** download all images *****
    // *******************************
    let images = []
    _.map(candidatures, (candidature) => {
      const parts = candidature[10].split('/')
      images.push({
        title: parts[parts.length - 1],
        uri: candidature[10].trim()
      })
    })
    async.eachLimit(images, 1, (image, next) => {
      return next()
      if (image.uri === '') {
        return next()
      }
      console.log(image.uri, 'start')
      download(image.uri)
        .then(data => {
          let target = path.resolve(__dirname, '../.cache/images', image.title)
          fs.writeFileSync(target, data)
          console.log(target, 'downloaded')
          next()
        })
        .catch((error) => {
          console.log(error)
          next()
        })
    }, () => {
      // *******************************
      // ***** media posts         *****
      // *******************************
      const candidature = candidatures[1]
      const parts = candidature[10].split('/')
      console.log('media posts', parts)
      let source = path.resolve(__dirname, '../.cache/images', parts[parts.length - 1])
      wp.media()
        .filter({title: candidature[1].trim()})
        .then((result) => {
          if (result.length === 0) {
            return wp.media()
              .file(source)
              .create({
                title: candidature[1].trim(),
                alt_text: candidature[1].trim(),
                caption: candidature[1].trim(),
                description: candidature[1].trim()
              })
          } else {
            return result[0]
          }
        })
        .then((result) => {
          // *******************************
          // ***** create/update posts *****
          // *******************************
          console.log('create/update posts')
          const payload = {
            title: candidature[1].trim(),
            excerpt: candidature[8].trim(),
            content: candidature[9].trim(),
            status: 'publish',
            'ping_status': 'closed',
            'comment_status': 'closed',
            'featured_media': result.id,
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
            })
            .catch((error) => {
              console.log(error)
            })
        })
    })
  })
