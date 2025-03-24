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
    quantity_tool: DataTypes.FLOAT,
    total_tool: DataTypes.FLOAT,
    discount: DataTypes.INTEGER,
    pvp_tool: DataTypes.FLOAT,
    final_price_tool: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'OrderToolProducts',
  });
  return OrderToolProducts;
};
