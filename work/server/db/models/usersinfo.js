'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UsersInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Users }) {
      // define association here
      this.belongsTo(Users, { foreignKey: 'id' });
    }
  }
  UsersInfo.init(
    {
      fullName: {
        type: DataTypes.STRING,
      },
      group: {
        type: DataTypes.STRING,
      },
      shift: {
        type: DataTypes.STRING,
      },
      subdivision: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'UsersInfo',
    }
  );
  return UsersInfo;
};
