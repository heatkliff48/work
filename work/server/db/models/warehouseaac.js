'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WarehouseAAC extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  WarehouseAAC.init({
    supplier: DataTypes.STRING,
    quantity: DataTypes.FLOAT,
    date: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'WarehouseAAC',
  });
  return WarehouseAAC;
};