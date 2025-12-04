'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClientsPriceInfos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ClientsPriceInfos.init({
    title: DataTypes.STRING,
    price: DataTypes.INTEGER,
    discont: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ClientsPriceInfos',
  });
  return ClientsPriceInfos;
};
