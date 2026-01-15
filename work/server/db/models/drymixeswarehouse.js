'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DryMixesWarehouse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DryMixesWarehouse.init({
    article: DataTypes.STRING,
    product_article: DataTypes.STRING,
    free_quantity_remaining: DataTypes.INTEGER,
    total_quantity: DataTypes.INTEGER,
    ordered_quantity: DataTypes.INTEGER,
    warehouse_loc: DataTypes.STRING,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'DryMixesWarehouse',
  });
  return DryMixesWarehouse;
};
