'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PageAndRoles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PageAndRoles.init(
    {
      page_id: DataTypes.INTEGER,
      role_id: DataTypes.INTEGER,
      read: DataTypes.BOOLEAN,
      write: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'PageAndRoles',
    }
  );
  return PageAndRoles;
};
