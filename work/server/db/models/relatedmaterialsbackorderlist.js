'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RelatedMaterialsBackorderList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RelatedMaterialsBackorderList.init({
    shipping_date: DataTypes.STRING,
    product_article: DataTypes.STRING,
    order_article: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    quantity_in_warehouse: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'RelatedMaterialsBackorderList',
  });
  return RelatedMaterialsBackorderList;
};