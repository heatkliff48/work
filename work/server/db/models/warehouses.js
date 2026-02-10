'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Warehouses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Products, OrdersProducts, FilesWarehouse }) {
      // this.hasMany(Products, { foreignKey: 'article' });
      this.belongsToMany(Products, {
        through: 'ReservedProducts',
        foreignKey: 'order_id',
      });
      this.belongsToMany(OrdersProducts, {
        through: 'ReservedProducts',
        foreignKey: 'warehouse_id',
      });
      this.hasMany(FilesWarehouse, {
        foreignKey: 'warehouse_id',
      });
    }
  }
  Warehouses.init(
    {
      article: DataTypes.STRING,
      product_article: DataTypes.STRING,
      free_quantity_remaining: DataTypes.INTEGER,
      total_quantity: DataTypes.INTEGER,
      ordered_quantity: DataTypes.INTEGER,
      warehouse_loc: DataTypes.STRING,
      type: DataTypes.STRING,
      sorting: DataTypes.INTEGER,
      batch_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Warehouses',
    },
  );
  return Warehouses;
};
