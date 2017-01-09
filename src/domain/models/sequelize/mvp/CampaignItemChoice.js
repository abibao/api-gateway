'use strict'

const Sequelize = require('sequelize')
const Cryptr = require('cryptr')

module.exports = function (sequelize) {
  const CampaignItemChoice = sequelize.define('CampaignItemChoice', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      unique: true,
      allowNull: false
    },
    prefix: {
      type: Sequelize.STRING,
      allowNull: false
    },
    suffix: {
      type: Sequelize.STRING,
      allowNull: false
    },
    text: {
      type: Sequelize.STRING,
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
    campaign: {
      type: Sequelize.STRING,
      allowNull: false
    },
    item: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function (models) {
        models.CampaignItemChoice.belongsTo(models.CampaignItem, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false
          }
        })
        models.CampaignItemChoice.belongsTo(models.Campaign, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false
          }
        })
      }
    },
    getterMethods: {
      urn: function () {
        const cryptr = new Cryptr(global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'))
        return 'abibao:database:campaign_item_choice:' + cryptr.encrypt(this.id)
      },
      urnCampaign: function () {
        const cryptr = new Cryptr(global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'))
        return 'abibao:database:campaign:' + cryptr.encrypt(this.CampaignId)
      },
      urnCampaignItem: function () {
        const cryptr = new Cryptr(global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'))
        return 'abibao:database:campaign_item:' + cryptr.encrypt(this.CampaignItemId)
      }
    },
    timestamps: true,
    paranoid: true,
    underscored: false,
    freezeTableName: true,
    tableName: 'campaigns_items_choices'
  })
  return CampaignItemChoice
}
