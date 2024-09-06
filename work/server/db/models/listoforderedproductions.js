'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ListOfOrderedProductions extends Model {
    static associate(models) {}
  }
  ListOfOrderedProductions.init(
    {
      shipping_date: DataTypes.STRING,
      product_article: DataTypes.STRING,
      order_article: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'ListOfOrderedProductions',
    }
  );
  return ListOfOrderedProductions;
};
