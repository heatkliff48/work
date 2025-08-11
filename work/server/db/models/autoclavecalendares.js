'use strict';
const {
  Model
} = require('sequelize');
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
  AutoclaveCalendares.init({
    date: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    quantity_of_complited: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'AutoclaveCalendares',
  });
  return AutoclaveCalendares;
};
