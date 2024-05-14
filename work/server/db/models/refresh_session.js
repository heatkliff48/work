'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Refresh_session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Refresh_session.init({
    user_id: DataTypes.INTEGER,
    refresh_token: DataTypes.STRING,
    finger_print: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Refresh_session',
  });
  return Refresh_session;
};
