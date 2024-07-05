'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Pages }) {
      this.belongsToMany(Pages, {
        through: 'PageAndRoles',
        foreignKey: 'role_id',
        as: 'PageAndRolesArray',
      });
    }
  }
  Roles.init(
    {
      role_name: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Roles',
    }
  );
  return Roles;
};
