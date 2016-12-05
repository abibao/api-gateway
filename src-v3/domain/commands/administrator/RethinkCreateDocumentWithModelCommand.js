'use strict'

// libraries
const Promise = require('bluebird')
const Joi = require('joi')
const validate = Promise.promisify(Joi.validate)

class RethinkCreateDocumentWithModelCommand {
  constructor (domain) {
    this.type = 'command'
    this.name = 'create-rethink-document-with-model-command'
    this.nconf = domain.nconf
    this.r = domain.databases.r
    this.domain = domain
  }
  handler (data) {
    const schema = Joi.object().keys({
      database: Joi.string(),
      table: Joi.string().required(),
      model: Joi.string().required()
    })
    const params = data.params
    const payload = data.payload || {}
    return new Promise((resolve, reject) => {
      const model = this.domain[params.model]
      const database = params.database || this.nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB')
      validate(payload, model.schema())
        .then(() => {
          return validate(params, schema)
        })
        .then(() => {
          const document = model.create(payload)
          return this.r.db(database).table(params.table).insert(document).run()
        })
        .then((result) => {
          resolve(result)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}

module.exports = RethinkCreateDocumentWithModelCommand
