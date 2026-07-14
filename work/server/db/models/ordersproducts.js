'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrdersProducts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Warehouses, Orders, ReservedProducts }) {
      this.belongsToMany(Warehouses, {
        through: 'ReservedProducts',
        foreignKey: 'orders_products_id',
      });
      this.belongsTo(Orders, { foreignKey: 'order_id', as: 'order' });
      this.hasMany(ReservedProducts, {
        foreignKey: 'orders_products_id',
        as: 'reservedProducts',
      });
    }
  }
  OrdersProducts.init(
    {
      order_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      quantity_m2: DataTypes.FLOAT,
      quantity_palet: DataTypes.FLOAT,
      quantity_real: DataTypes.FLOAT,
      price_m2: DataTypes.FLOAT,
      price_m3: DataTypes.FLOAT,
      discount: DataTypes.FLOAT,
      final_price: DataTypes.FLOAT,
      warehouse_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'OrdersProducts',
    },
  );
  return OrdersProducts;
};
