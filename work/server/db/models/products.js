'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Products.init(
    {
      version: DataTypes.INTEGER,
      density: DataTypes.INTEGER,
      form: DataTypes.STRING,
      certificate: DataTypes.STRING,
      width: DataTypes.FLOAT,
      lengths: DataTypes.FLOAT,
      height: DataTypes.FLOAT,
      tradingMark: DataTypes.STRING,
      m3: DataTypes.FLOAT,
      m2: DataTypes.FLOAT,
      m: DataTypes.FLOAT,
      widthInArray: DataTypes.FLOAT,
      m3InArray: DataTypes.FLOAT,
      densityDryMax: DataTypes.FLOAT,
      densityDryDef: DataTypes.FLOAT,
      humidity: DataTypes.FLOAT,
      densityHuminityMax: DataTypes.FLOAT,
      densityHuminityDef: DataTypes.FLOAT,
      weightMax: DataTypes.FLOAT,
      weightDef: DataTypes.FLOAT,
      normOfBrack: DataTypes.INTEGER,
      coefficientOfFree: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Products',
    }
  );
  return Products;
};
