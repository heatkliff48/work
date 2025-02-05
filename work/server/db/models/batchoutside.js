'use strict';
const { Model } = require('sequelize');
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
  BatchOutside.init(
    {
      product_article: DataTypes.STRING,
      quantity_pallets: DataTypes.INTEGER,
      quantity_free: DataTypes.INTEGER,
      position_in_autoclave: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'BatchOutside',
    }
  );
  return BatchOutside;
};
