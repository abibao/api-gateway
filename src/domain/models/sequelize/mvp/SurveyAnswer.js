'use strict'

const Sequelize = require('sequelize')
const Cryptr = require('cryptr')

module.exports = function (sequelize) {
  const SurveyAnswer = sequelize.define('SurveyAnswer', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      unique: true,
      defaultValue: Sequelize.UUIDV4
    },
    question: {
      type: Sequelize.STRING,
      allowNull: false
    },
    answer: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    getterMethods: {
      urn: function () {
        const cryptr = new Cryptr(global.ABIBAO.config('ABIBAO_API_GATEWAY_CRYPTO_CREDENTIALS'))
        return 'abibao:database:survey:' + cryptr.encrypt(this.id)
      },
      urnSurvey: function () {
        const cryptr = new Cryptr(global.ABIBAO.config('ABIBAO_API_GATEWAY_CRYPTO_CREDENTIALS'))
        return 'abibao:database:survey:' + cryptr.encrypt(this.survey)
      }
    },
    timestamps: true,
    paranoid: true,
    underscored: false,
    freezeTableName: true,
    tableName: 'surveys_answers'
  })
  return SurveyAnswer
}
