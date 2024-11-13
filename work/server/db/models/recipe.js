'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Recipe.init(
    {
      article: DataTypes.STRING,
      density: DataTypes.FLOAT,
      certificate: DataTypes.STRING,
      form_volume_m3: DataTypes.FLOAT,
      dry_total: DataTypes.FLOAT,
      sand: DataTypes.FLOAT,
      lime_lhoist: DataTypes.FLOAT,
      lime_barcelona: DataTypes.FLOAT,
      cement: DataTypes.FLOAT,
      gypsum: DataTypes.FLOAT,
      alu_1: DataTypes.FLOAT,
      alu_2: DataTypes.FLOAT,
      return_slurry_solids: DataTypes.FLOAT,
      return_slurry_water: DataTypes.FLOAT,
      water: DataTypes.FLOAT,
      water_cold: DataTypes.FLOAT,
      water_hot: DataTypes.FLOAT,
      condensate: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: 'Recipe',
    }
  );
  return Recipe;
};
