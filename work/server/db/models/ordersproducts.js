'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrdersProducts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Orders, Products }) {
      this.belongsTo(Orders, { foreignKey: 'id' });
      this.belongsTo(Products, { foreignKey: 'product_id' });
    }
  }
  OrdersProducts.init(
    {
      order_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      quantity_m2: DataTypes.INTEGER,
      quantity_palet: DataTypes.INTEGER,
      quantity_real: DataTypes.INTEGER,
      price_m2: DataTypes.FLOAT,
      discount: DataTypes.INTEGER,
      final_price: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: 'OrdersProducts',
    }
  );
  return OrdersProducts;
};
