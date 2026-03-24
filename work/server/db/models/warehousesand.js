'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WarehouseSand extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  WarehouseSand.init(
    {
      supplier: DataTypes.STRING,
      quantity: DataTypes.FLOAT,
      type: DataTypes.STRING,
      quality: DataTypes.FLOAT,
      date: DataTypes.STRING,
      file_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'WarehouseSand',
    },
  );
  return WarehouseSand;
};
