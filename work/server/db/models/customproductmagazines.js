'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ListOfOrderedProductions extends Model {
    static associate(models) {}
  }
  ListOfOrderedProductions.init(
    {
      product_article: DataTypes.STRING,
      order_article: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      shipping_date: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'ListOfOrderedProductions',
    }
  );
  return ListOfOrderedProductions;
};
