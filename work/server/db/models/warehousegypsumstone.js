'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WarehouseGypsumStone extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  WarehouseGypsumStone.init(
    {
      supplier: DataTypes.STRING,
      quantity: DataTypes.FLOAT,
      quality: DataTypes.FLOAT,
      date: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'WarehouseGypsumStone',
    }
  );
  return WarehouseGypsumStone;
};
