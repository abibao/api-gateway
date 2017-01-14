'use strict'

const Sequelize = require('sequelize')
const Cryptr = require('cryptr')

module.exports = function (sequelize) {
  const Survey = sequelize.define('Survey', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      unique: true,
      defaultValue: Sequelize.UUIDV4
    },
    charity: {
      type: Sequelize.STRING,
      allowNull: false
    },
    company: {
      type: Sequelize.STRING,
      allowNull: false
    },
    individual: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    getterMethods: {
      urn: function () {
        const cryptr = new Cryptr(global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'))
        return 'abibao:database:survey:' + cryptr.encrypt(this.id)
      },
      urnCampaign: function () {
        const cryptr = new Cryptr(global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'))
        return 'abibao:database:campaign:' + cryptr.encrypt(this.campaign)
      },
      urnCharity: function () {
        const cryptr = new Cryptr(global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'))
        return 'abibao:database:charity:' + cryptr.encrypt(this.charity)
      },
      urnCompany: function () {
        const cryptr = new Cryptr(global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'))
        return 'abibao:database:company:' + cryptr.encrypt(this.company)
      },
      urnIndividual: function () {
        const cryptr = new Cryptr(global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'))
        return 'abibao:database:individual:' + cryptr.encrypt(this.individual)
      }
    },
    timestamps: true,
    paranoid: true,
    underscored: false,
    freezeTableName: true,
    tableName: 'surveys'
  })
  return Survey
}
