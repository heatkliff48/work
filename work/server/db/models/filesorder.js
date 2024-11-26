'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FilesOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Orders }) {
      this.belongsTo(Orders, {
        foreignKey: 'order_id',
      });
    }
  }
  FilesOrder.init(
    {
      order_id: DataTypes.INTEGER,
      file_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'FilesOrder',
    }
  );
  return FilesOrder;
};
