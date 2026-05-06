'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GreenLineMonitoring extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  GreenLineMonitoring.init({
    timestamp: DataTypes.STRING,
    sensor_id: DataTypes.INTEGER,
    height_mm: DataTypes.FLOAT,
    status: DataTypes.STRING,
    error: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'GreenLineMonitoring',
  });
  return GreenLineMonitoring;
};