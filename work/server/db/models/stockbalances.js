'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StockBalances extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StockBalances.init({
    product_article: DataTypes.STRING,
    stock_requirements: DataTypes.INTEGER,
    in_stock: DataTypes.INTEGER,
    diff: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'StockBalances',
  });
  return StockBalances;
};