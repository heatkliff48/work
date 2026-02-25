'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderToWarehouse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OrderToWarehouse.init(
    {
      product_article: DataTypes.STRING,
      description: DataTypes.STRING,
      quantity_pallets: DataTypes.INTEGER,
      quantity_real_m2: DataTypes.FLOAT,
      quantity_produced: DataTypes.INTEGER,
      quantity_allocated: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'OrderToWarehouse',
    },
  );
  return OrderToWarehouse;
};
