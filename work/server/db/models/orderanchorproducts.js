'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderAnchorProducts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OrderAnchorProducts.init({
    order_id: DataTypes.INTEGER,
    anchor_id: DataTypes.INTEGER,
    quantity_anchor: DataTypes.FLOAT,
    quantity_palet_anchor: DataTypes.FLOAT,
    quantity_real_anchor: DataTypes.FLOAT,
    total_anchor: DataTypes.FLOAT,
    discount: DataTypes.INTEGER,
    pvp_anchor: DataTypes.FLOAT,
    final_price_anchor: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'OrderAnchorProducts',
  });
  return OrderAnchorProducts;
};
