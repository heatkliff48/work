'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Products, ClientCards }) {
      this.belongsTo(ClientCards, { foreignKey: 'owner' });

      this.belongsToMany(Products, {
        through: 'OrdersProducts',
        foreignKey: 'order_id',
        as: 'OrdersProductsArr',
      });
    }
  }
  Orders.init(
    {
      article: DataTypes.STRING,
      owner: DataTypes.INTEGER,
      del_adr_id: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Orders',
    }
  );
  return Orders;
};
