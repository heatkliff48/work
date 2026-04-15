'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WarehouseAluminum1 extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  WarehouseAluminum1.init(
    {
      supplier: DataTypes.STRING,
      quantity: DataTypes.FLOAT,
      consumed_quantity: DataTypes.FLOAT,
      type: DataTypes.STRING,
      quality: DataTypes.FLOAT,
      date: DataTypes.STRING,
      file_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'WarehouseAluminum1',
    },
  );
  return WarehouseAluminum1;
};
