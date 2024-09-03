'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ListOfOrderedProductionOEMs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ListOfOrderedProductionOEMs.init({
    shipping_date: DataTypes.STRING,
    product_article: DataTypes.STRING,
    order_article: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ListOfOrderedProductionOEMs',
  });
  return ListOfOrderedProductionOEMs;
};
