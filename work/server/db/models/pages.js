'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Roles }) {
      this.belongsToMany(Roles, {
        through: 'PageAndRoles',
        foreignKey: 'page_id',
        as:'PageAndRolesArray'
      });
    }
  }
  Pages.init({
    page_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Pages',
  });
  return Pages;
};
