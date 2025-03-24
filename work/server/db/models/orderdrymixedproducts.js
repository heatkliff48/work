'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderDryMixedProducts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OrderDryMixedProducts.init({
    order_id: DataTypes.INTEGER,
    dry_mixed_id: DataTypes.INTEGER,
    quantity_dry: DataTypes.FLOAT,
    quantity_palet_dry: DataTypes.FLOAT,
    quantity_real_dry: DataTypes.FLOAT,
    total_dry: DataTypes.FLOAT,
    discount: DataTypes.INTEGER,
    pvp_dry: DataTypes.FLOAT,
    final_price_dry: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'OrderDryMixedProducts',
  });
  return OrderDryMixedProducts;
};
