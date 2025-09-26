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
      sand_slurry: DataTypes.FLOAT,
      lime: DataTypes.FLOAT,
      cement: DataTypes.FLOAT,
      gypsum: DataTypes.FLOAT,
      gypsum_stone: DataTypes.FLOAT,
      alu: DataTypes.FLOAT,
      return_slurry_solids: DataTypes.FLOAT,
      water_solid: DataTypes.FLOAT,
      water_mixer: DataTypes.FLOAT,
      condensate: DataTypes.FLOAT,
      grinding_balls: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Recipe',
    }
  );
  return Recipe;
};
