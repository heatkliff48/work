"use strict";
const { Model } = require("sequelize");
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
    },
    {
      sequelize,
      modelName: "LotesList",
    }
  );
  return LotesList;
};
