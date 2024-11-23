'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FilesWarehouse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Warehouses }) {
      this.belongsTo(Warehouses, {
        foreignKey: 'warehouse_id',
      });
    }
  }
  FilesWarehouse.init(
    {
      warehouse_id: DataTypes.INTEGER,
      file_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'FilesWarehouse',
    }
  );
  return FilesWarehouse;
};
