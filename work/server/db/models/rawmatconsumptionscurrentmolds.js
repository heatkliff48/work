'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RawMatConsumptionsCurrentMolds extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RawMatConsumptionsCurrentMolds.init(
    {
      recipe_article: DataTypes.STRING,
      batch_article: DataTypes.STRING,
      production_volume: DataTypes.INTEGER,
      batch_id: DataTypes.INTEGER,
      cacke_id_start: DataTypes.INTEGER,
      date: DataTypes.STRING,
      used: DataTypes.BOOLEAN,
      id_ordered_product_to_warehouse: DataTypes.INTEGER,
      consumed_volume: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'RawMatConsumptionsCurrentMolds',
    },
  );
  return RawMatConsumptionsCurrentMolds;
};
