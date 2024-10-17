'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BatchOutside extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BatchOutside.init({
    id_warehouse_batch: DataTypes.STRING,
    id_list_of_ordered_production: DataTypes.INTEGER,
    quantity_pallets: DataTypes.INTEGER,
    quantity_ordered: DataTypes.INTEGER,
    quantity_free: DataTypes.INTEGER,
    on_check: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'BatchOutside',
  });
  return BatchOutside;
};