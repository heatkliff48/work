'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReservedAnchors extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ OrdersProducts }) {
    }
  }
  ReservedAnchors.init(
    {
      warehouse_id: DataTypes.INTEGER,
      orders_products_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      order_dispatch_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'ReservedAnchors',
    }
  );
  return ReservedAnchors;
};
