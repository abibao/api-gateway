'use strict'

const errors = require('feathers-errors')
const Joi = require('joi')

const schema = Joi.object().keys({
  // fields
  email: Joi.string().email().required(),
  scope: Joi.string().default('individual'),
  // linked
  charity: Joi.string().default('none'),
  hasRegisteredEntity: Joi.string().default('none'),
  // automatic
  createdAt: Joi.date().required(),
  modifiedAt: Joi.date().required()
})

module.exports.hasRegisteredEntity = function () {
  return function (hook) {
    const app = hook.app
    return new Promise(function (resolve, reject) {
      resolve(hook)
    })
  }
}

module.exports.emailAlreadyExists = function () {
  return function (hook) {
    const app = hook.app
    hook.data.email = hook.data.email.toLowerCase()
    return new Promise(function (resolve, reject) {
      app.service('individuals').find({query: {email: hook.data.email}})
        .then(function (result) {
          if (result.total !== 0) {
            reject(new errors.BadRequest('ERROR_SERVICE__EMAIL_ALREADY_EXIXTS', {
              errors: {
                email: hook.data.email
              }
            }))
          } else {
            resolve(hook)
          }
        })
        .catch(function (error) {
          reject(error)
        })
    })
  }
}

module.exports.createdAt = function () {
  return function (hook) {
    return new Promise(function (resolve, reject) {
      hook.data.createdAt = new Date()
      resolve(hook)
    })
  }
}

module.exports.modifiedAt = function () {
  return function (hook) {
    return new Promise(function (resolve, reject) {
      hook.data.modifiedAt = new Date()
      resolve(hook)
    })
  }
}

module.exports.validate = function () {
  return function (hook) {
    return new Promise(function (resolve, reject) {
      Joi.validate(hook.data, schema, function (error) {
        if (error) {
          reject(error)
        } else {
          resolve(hook)
        }
      })
    })
  }
}

module.exports.individualRegisterCommand = function () {
  return function (hook) {
    const app = hook.app
    return new Promise(function (resolve, reject) {
      global.ABIBAO.services.domain.individualRegisterCommand(hook.result)
        .then(function () {
          resolve(hook)
        })
        .catch(function (error) {
          reject(error)
        })
    })
  }
}
