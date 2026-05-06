'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WarehouseSandSlurry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  WarehouseSandSlurry.init(
    {
      sand: DataTypes.FLOAT,
      gypsum_stone: DataTypes.FLOAT,
      water: DataTypes.FLOAT,
      grinding_balls: DataTypes.FLOAT,
      aac_scrap: DataTypes.FLOAT,
      portion_size: DataTypes.FLOAT,
      date: DataTypes.STRING,
      file_name: DataTypes.STRING,
      isNeedCheck: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'WarehouseSandSlurry',
    },
  );
  return WarehouseSandSlurry;
};
