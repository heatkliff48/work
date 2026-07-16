'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Aldabarans extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Aldabarans.init(
    {
      num: DataTypes.INTEGER,
      data: DataTypes.STRING,
      agencia: DataTypes.STRING,
      matricula: DataTypes.STRING,
      referencia: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Aldabarans',
    },
  );
  return Aldabarans;
};
