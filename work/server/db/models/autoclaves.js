'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Autoclaves extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Autoclaves.init({
    id_list_of_ordered_product: DataTypes.INTEGER,
    status_batch: DataTypes.INTEGER,
    quality_check: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Autoclaves',
  });
  return Autoclaves;
};
