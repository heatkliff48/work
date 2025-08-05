'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Anchor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Anchor.init(
    {
      name: DataTypes.STRING,
      article: DataTypes.STRING,
      manufacturer_name: DataTypes.STRING,
      units_of_measurement: DataTypes.STRING,
      pieces_per_unit: DataTypes.INTEGER,
      boxes_on_a_pallet: DataTypes.INTEGER,
      box_weight: DataTypes.FLOAT,
      pallet_weight: DataTypes.FLOAT,
      description: DataTypes.TEXT,
      place_of_production: DataTypes.STRING,
      price_per_unit: DataTypes.FLOAT,
      product_code: DataTypes.STRING,
      product_code_box: DataTypes.STRING,
      product_code_pall: DataTypes.STRING,
      active_status: DataTypes.BOOLEAN,
      version: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Anchor',
    }
  );
  return Anchor;
};
