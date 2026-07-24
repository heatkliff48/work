'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderRelMatProducts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OrderRelMatProducts.init(
    {
      order_id: DataTypes.INTEGER,
      rel_mat_id: DataTypes.INTEGER,
      quantity_ud: DataTypes.FLOAT,
      quantity_liberated: DataTypes.FLOAT,
      total: DataTypes.FLOAT,
      discount: DataTypes.INTEGER,
      pvp: DataTypes.FLOAT,
      final_price: DataTypes.FLOAT,
      warehouse_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'OrderRelMatProducts',
    },
  );
  return OrderRelMatProducts;
};
