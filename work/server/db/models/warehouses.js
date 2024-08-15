'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Warehouses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Products }) {
      // this.hasMany(Products, { foreignKey: 'article' });
    }
  }
  Warehouses.init(
    {
      warehouse_article: DataTypes.STRING,
      product_article: DataTypes.STRING,
      remaining_stock: DataTypes.INTEGER,
      warehouse_loc: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Warehouses',
    }
  );
  return Warehouses;
};
