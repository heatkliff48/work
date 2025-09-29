'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WarehouseAluminum2 extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  WarehouseAluminum2.init({
    supplier: DataTypes.STRING,
    quantity: DataTypes.FLOAT,
    date: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'WarehouseAluminum2',
  });
  return WarehouseAluminum2;
};