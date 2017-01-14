'use strict'

const Sequelize = require('sequelize')
const Cryptr = require('cryptr')

module.exports = function (sequelize) {
  const Entity = sequelize.define('Entity', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      unique: true,
      defaultValue: Sequelize.UUIDV4
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    contact: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    url: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: '',
      validate: {
        isUrl: true
      }
    },
    type: {
      type: Sequelize.ENUM('none', 'abibao', 'charity', 'company'),
      allowNull: false
    },
    icon: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'images/icons/default.png'
    },
    picture: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'images/pictures/default.png'
    },
    avatar: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'images/avatars/default.png'
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    hangs: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    usages: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function (models) {
        models.Entity.hasMany(models.Campaign)
      }
    },
    getterMethods: {
      urn: function () {
        const cryptr = new Cryptr(global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'))
        return 'abibao:database:entity:' + cryptr.encrypt(this.id)
      }
    },
    timestamps: true,
    paranoid: true,
    underscored: false,
    freezeTableName: true,
    tableName: 'entities'
  })
  return Entity
}
