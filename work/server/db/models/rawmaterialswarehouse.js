'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RawMaterialsWarehouse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RawMaterialsWarehouse.init(
    {
      material_type: DataTypes.STRING,
      remaining_quantity: DataTypes.FLOAT,
      consumed_quantity: DataTypes.FLOAT,
      last_updated: DataTypes.STRING,
      used: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'RawMaterialsWarehouse',
    },
  );
  return RawMaterialsWarehouse;
};
