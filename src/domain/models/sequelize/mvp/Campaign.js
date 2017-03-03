'use strict'

const Sequelize = require('sequelize')
const Cryptr = require('cryptr')

module.exports = function (sequelize) {
  const Campaign = sequelize.define('Campaign', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      unique: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    position: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    screenWelcomeContent: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    screenThankYouContent: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  }, {
    classMethods: {
      associate: function (models) {
        models.Campaign.hasMany(models.CampaignItem)
        models.Campaign.belongsTo(models.Entity, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false
          }
        })
      }
    },
    getterMethods: {
      urn: function () {
        const cryptr = new Cryptr(global.ABIBAO.config('ABIBAO_API_GATEWAY_CRYPTO_CREDENTIALS'))
        return 'abibao:database:campaign:' + cryptr.encrypt(this.id)
      },
      urnCompany: function () {
        const cryptr = new Cryptr(global.ABIBAO.config('ABIBAO_API_GATEWAY_CRYPTO_CREDENTIALS'))
        return 'abibao:database:company:' + cryptr.encrypt(this.EntityId)
      }
    },
    timestamps: true,
    paranoid: true,
    underscored: false,
    freezeTableName: true,
    tableName: 'campaigns'
  })
  return Campaign
}
