'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DryMixesJournal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DryMixesJournal.init(
    {
      name: DataTypes.STRING,
      article: DataTypes.STRING,
      units_of_measurement: DataTypes.STRING,
      number_of_bags: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      place_of_production: DataTypes.STRING,
      price: DataTypes.FLOAT,
      product_code: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'DryMixesJournal',
    }
  );
  return DryMixesJournal;
};
