'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LotesList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LotesList.init(
    {
      cake_id: DataTypes.INTEGER,
      cake_id_finish: DataTypes.INTEGER,
      production_date: DataTypes.STRING,
      product: DataTypes.STRING,
      recipe: DataTypes.STRING,
      quantity_cakes: DataTypes.INTEGER,
      warehouse_id: DataTypes.STRING,
      custom_recipe: DataTypes.BOOLEAN,
      sand_dry: DataTypes.STRING,
      sand_slurry_dry: DataTypes.STRING,
      lime: DataTypes.STRING,
      cement: DataTypes.STRING,
      gypsum_dry: DataTypes.STRING,
      return_dry: DataTypes.STRING,
      gypsum_stone: DataTypes.STRING,
      aluminum_paste: DataTypes.STRING,
      aluminum_paste_2: DataTypes.STRING,
      grinding_balls: DataTypes.STRING,
      aac: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'LotesList',
    }
  );
  return LotesList;
};
