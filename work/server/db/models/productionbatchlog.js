'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductionBatchLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProductionBatchLog.init({
    products_article: DataTypes.STRING,
    orders_article: DataTypes.STRING,
    production_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ProductionBatchLog',
  });
  return ProductionBatchLog;
};