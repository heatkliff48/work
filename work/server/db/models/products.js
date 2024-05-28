'use strict';
const {
  Model
} = require('sequelize');
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
  Products.init({
    version: DataTypes.INTEGER,
    density: DataTypes.INTEGER,
    form: DataTypes.STRING,
    certificate: DataTypes.STRING,
    width: DataTypes.INTEGER,
    lengths: DataTypes.INTEGER,
    height: DataTypes.INTEGER,
    tradingMark: DataTypes.STRING,
    m3: DataTypes.INTEGER,
    m2: DataTypes.INTEGER,
    m: DataTypes.INTEGER,
    widthInArray: DataTypes.INTEGER,
    m3InArray: DataTypes.INTEGER,
    densityInDryMax: DataTypes.INTEGER,
    dinsityInDryDef: DataTypes.INTEGER,
    humidity: DataTypes.INTEGER,
    densityHumidityMax: DataTypes.INTEGER,
    densityHuminityDef: DataTypes.INTEGER,
    weightMax: DataTypes.INTEGER,
    weightDef: DataTypes.INTEGER,
    normOfBrack: DataTypes.INTEGER,
    coefficientOfFree: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};
