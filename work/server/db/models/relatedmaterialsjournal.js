'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RelatedMaterialsJournal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RelatedMaterialsJournal.init(
    {
      name: DataTypes.STRING,
      article: DataTypes.STRING,
      manufacturer_name: DataTypes.STRING,
      units_of_measurement: DataTypes.STRING,
      description: DataTypes.TEXT,
      place_of_production: DataTypes.STRING,
      price_per_unit: DataTypes.FLOAT,
      product_code: DataTypes.STRING,
      active_status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'RelatedMaterialsJournal',
    }
  );
  return RelatedMaterialsJournal;
};
