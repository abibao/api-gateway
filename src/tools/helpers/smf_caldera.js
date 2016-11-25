'use strict'

const Promise = require('bluebird')
const download = require('download')

// load environnement configuration
const nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

// read csv file content
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
    // download all images
    let images = []
    _.map(candidatures, (candidature) => {
      images.push({
        title: candidature[1].trim(),
        uri: candidature[10].trim()
      })
    })
    Promise.all(images.map((image) => {
      download(image.uri).then(data => {
        fs.writeFileSync('dist' + image.title, data)
      })
    })
    .then(() => {
      console.log('done')
    })
    // action
    /* const candidature = candidatures[0]
    const payload = {
      title: candidature[1].trim(),
      excerpt: candidature[8].trim(),
      content: candidature[9].trim(),
      status: 'publish',
      'ping_status': 'closed',
      'comment_status': 'closed',
      categories: [4]
    }
    const mediaURI = candidature[10]
    Promise.all([mediaURI].map(x => download(x, 'dist'))).then(() => {
      wp.media('dist')
      // Specify a path to the file you want to upload
      .file()
      .create({
        title: 'My awesome image',
        alt_text: 'an image of something awesome',
        caption: 'This is the caption text',
        description: 'More explanatory information'
      })
      .then((response) => {
        // Your media is now uploaded: let's associate it with a post
        var newImageId = response.id
        return wp.media().id(newImageId).update({
          post: associatedPostId
        })
      })
      .then((response) => {
        console.log('Media ID #' + response.id)
        console.log('is now associated with Post ID #' + response.post)
      })
    }) */
    // step 1: posts()
    /* wp.posts().filter({title: payload.title}).get()
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
      }) */
    // step 2: media()
  })
