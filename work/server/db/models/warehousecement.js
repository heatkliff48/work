'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WarehouseCement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  WarehouseCement.init(
    {
      supplier: DataTypes.STRING,
      quantity: DataTypes.FLOAT,
      type: DataTypes.STRING,
      quality: DataTypes.FLOAT,
      date: DataTypes.STRING,
      file_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'WarehouseCement',
    },
  );
  return WarehouseCement;
};
