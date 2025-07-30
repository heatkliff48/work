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
      lengths: DataTypes.FLOAT,
      width: DataTypes.FLOAT,
      height: DataTypes.FLOAT,
      manufacturer_name: DataTypes.STRING,
      units_of_measurement: DataTypes.STRING,
      units_per_pallet: DataTypes.FLOAT,
      piece_weight: DataTypes.FLOAT,
      pallet_weight: DataTypes.FLOAT,
      description: DataTypes.TEXT,
      place_of_production: DataTypes.STRING,
      price_per_unit: DataTypes.FLOAT,
      product_code: DataTypes.STRING,
      product_code_box: DataTypes.STRING,
      product_code_pall: DataTypes.STRING,
      qty_per_truck: DataTypes.INTEGER,
      qty_per_contendor: DataTypes.INTEGER,
      active_status: DataTypes.BOOLEAN,
      version: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Tool',
    }
  );
  return Tool;
};
