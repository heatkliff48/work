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
      certificate: DataTypes.STRING,
      cake_height: DataTypes.FLOAT,
      lime: DataTypes.FLOAT,
      cement: DataTypes.FLOAT,
      sand_dry: DataTypes.FLOAT,
      sand_slurry_dry: DataTypes.FLOAT,
      gypsum_dry: DataTypes.FLOAT,
      return_dry: DataTypes.FLOAT,
      aluminum_paste: DataTypes.FLOAT,
      water_solids: DataTypes.FLOAT,
      solids: DataTypes.FLOAT,
      volume: DataTypes.FLOAT,
      density: DataTypes.FLOAT,
      produced_return_dry: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: 'Recipe',
    }
  );
  return Recipe;
};
