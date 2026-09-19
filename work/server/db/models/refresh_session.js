'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Refresh_session extends Model {
    static associate(models) {
      Refresh_session.belongsTo(models.Users, {
        foreignKey: 'user_id',
        as: 'user',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }
  }

  Refresh_session.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },

      refresh_token: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
      },

      finger_print: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Refresh_session',
      tableName: 'Refresh_sessions',
      timestamps: true,
      indexes: [
        {
          fields: ['user_id'],
        },
      ],
    },
  );

  return Refresh_session;
};
