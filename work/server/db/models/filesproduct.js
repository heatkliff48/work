'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FilesProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Products }) {
      this.belongsTo(Products, {
        foreignKey: 'product_id',
      });
    }
  }
  FilesProduct.init(
    {
      product_id: DataTypes.INTEGER,
      file_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'FilesProduct',
    }
  );
  return FilesProduct;
};
