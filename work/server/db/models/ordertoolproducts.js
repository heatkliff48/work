'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderToolProducts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OrderToolProducts.init({
    order_id: DataTypes.INTEGER,
    tool_id: DataTypes.INTEGER,
    quantity_ud: DataTypes.FLOAT,
    total: DataTypes.FLOAT,
    discount: DataTypes.INTEGER,
    pvp: DataTypes.FLOAT,
    final_price: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'OrderToolProducts',
  });
  return OrderToolProducts;
};
