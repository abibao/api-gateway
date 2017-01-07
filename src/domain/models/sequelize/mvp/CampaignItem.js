'use strict'

const Sequelize = require('sequelize')
const Cryptr = require('cryptr')

module.exports = function (sequelize) {
  const CampaignItem = sequelize.define('CampaignItem', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      unique: true,
      allowNull: false
    },
    campaign: {
      type: Sequelize.STRING,
      allowNull: false
    },
    type: {
      type: Sequelize.ENUM('ABIBAO_COMPONENT_YES_NO', 'ABIBAO_COMPONENT_STATEMENT', 'ABIBAO_COMPONENT_SHORT_TEXT', 'ABIBAO_COMPONENT_NUMBER', 'ABIBAO_COMPONENT_MULTIPLE_CHOICE', 'ABIBAO_COMPONENT_LONG_TEXT', 'ABIBAO_COMPONENT_DROPDOWN'),
      allowNull: false
    },
    position: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    question: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    tags: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: ''
    },
    label: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    placeholder: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: ''
    },
    addCustomOption: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    addCustomOptionLabel: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: ''
    },
    multipleSelections: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    randomize: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    required: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    maxLength: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: -1,
      validate: {
        min: -1
      }
    },
    minimum: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    maximum: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    getterMethods: {
      urn: function () {
        const cryptr = new Cryptr(global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'))
        return 'abibao:database:campaign_item:' + cryptr.encrypt(this.id)
      },
      urnCampaign: function () {
        const cryptr = new Cryptr(global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'))
        return 'abibao:database:campaign:' + cryptr.encrypt(this.campaign)
      }
    },
    timestamps: true,
    paranoid: true,
    underscored: false,
    freezeTableName: true,
    tableName: 'campaigns_items'
  })
  CampaignItem.sync()
  return CampaignItem
}
