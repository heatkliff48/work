'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tool extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Tool.init(
    {
      name: DataTypes.STRING,
      article: DataTypes.STRING,
      units_of_measurement: DataTypes.STRING,
      piece_weight: DataTypes.FLOAT,
      description: DataTypes.TEXT,
      place_of_production: DataTypes.STRING,
      price: DataTypes.FLOAT,
      product_code: DataTypes.STRING,
      active_status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Tool',
    }
  );
  return Tool;
};
