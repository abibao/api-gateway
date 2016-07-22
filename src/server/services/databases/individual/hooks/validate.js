'use strict'

const errors = require('feathers-errors')
const Joi = require('joi')
const schema = Joi.object().keys({
  email: Joi.string().email().required()
})

module.exports = function () {
  return function (hook) {
    Joi.validate(hook.data, schema, function (error) {
      if (error) {
        throw new errors.BadRequest('Joi validation')
      } else {
        return hook
      }
    })
  }
}
