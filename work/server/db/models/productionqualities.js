'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductionQualities extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProductionQualities.init(
    {
      batch_id: DataTypes.INTEGER,
      date: DataTypes.STRING,
      product_article: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'ProductionQualities',
    },
  );
  return ProductionQualities;
};
