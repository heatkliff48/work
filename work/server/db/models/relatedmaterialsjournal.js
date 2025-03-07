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
      product_name: DataTypes.STRING,
      units_per_pack: DataTypes.INTEGER,
      price_per_pack: DataTypes.INTEGER,
      type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'RelatedMaterialsJournal',
    }
  );
  return RelatedMaterialsJournal;
};
