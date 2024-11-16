'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RecipeOrders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RecipeOrders.init({
    id_recipe: DataTypes.INTEGER,
    id_batch: DataTypes.INTEGER,
    production_volume: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'RecipeOrders',
  });
  return RecipeOrders;
};
