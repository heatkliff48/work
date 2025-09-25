'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AutoclaveCalendares extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AutoclaveCalendares.init(
    {
      date: DataTypes.STRING,
      scheduled_autoclaves: DataTypes.INTEGER,
      total_arrays: DataTypes.INTEGER,
      residual_arrays: DataTypes.INTEGER,
      filled_autoclaves: DataTypes.INTEGER,
      produced_autoclave: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'AutoclaveCalendares',
    }
  );
  return AutoclaveCalendares;
};
