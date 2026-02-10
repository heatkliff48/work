'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FilesLotesLists extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FilesLotesLists.init({
    lotesList_id: DataTypes.INTEGER,
    file_name: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'FilesLotesLists',
  });
  return FilesLotesLists;
};
