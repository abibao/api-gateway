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
    survey: {
      type: Sequelize.STRING,
      allowNull: false
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
    indexes: [
      {
        unique: true,
        fields: ['survey', 'question']
      }
    ],
    getterMethods: {
      urn: function () {
        const cryptr = new Cryptr(global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'))
        return 'abibao:database:survey:' + cryptr.encrypt(this.id)
      },
      urnSurvey: function () {
        const cryptr = new Cryptr(global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'))
        return 'abibao:database:survey:' + cryptr.encrypt(this.survey)
      }
    },
    timestamps: true,
    paranoid: true,
    underscored: false,
    freezeTableName: true,
    tableName: 'surveys_answers'
  })
  SurveyAnswer.sync()
  return SurveyAnswer
}
