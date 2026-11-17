'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BatchAluminumConsumption extends Model {
    static associate(models) {
      // associations can be defined here
    }
  }

  BatchAluminumConsumption.init(
    {
      batch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      aluminum_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      date: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'BatchAluminumConsumption',
      tableName: 'BatchAluminumConsumptions',
    },
  );

  return BatchAluminumConsumption;
};
