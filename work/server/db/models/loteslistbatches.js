'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LotesListsBatches extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LotesListsBatches.init(
    {
      cake_id_start: DataTypes.INTEGER,
      cake_id_finish: DataTypes.INTEGER,
      batch_id: DataTypes.INTEGER,
      sub_batch_id: DataTypes.INTEGER,
      production_date: DataTypes.STRING,
      product: DataTypes.STRING,
      recipe: DataTypes.STRING,
      quantity_cakes: DataTypes.INTEGER,
      custom_recipe: DataTypes.BOOLEAN,
      slurried: DataTypes.BOOLEAN,
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
      casting_temperature: DataTypes.STRING,
      w_s: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'LotesListsBatches',
    },
  );
  return LotesListsBatches;
};
