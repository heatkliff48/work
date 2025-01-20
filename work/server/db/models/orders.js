'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      Clients,
      DeliveryAddresses,
      Products,
      OrdersProducts,
      FilesOrder,
    }) {
      this.belongsTo(Clients, { foreignKey: 'id' });
      // this.belongsTo(DeliveryAddresses, { foreignKey: 'id' });
      this.belongsToMany(Products, {
        through: 'OrdersProducts',
        foreignKey: 'order_id',
      });
      this.hasMany(OrdersProducts, { foreignKey: 'order_id', as: 'ordersProducts' });
      this.hasMany(FilesOrder, {
        foreignKey: 'order_id',
      });
    }
  }
  Orders.init(
    {
      article: DataTypes.STRING,
      owner: DataTypes.INTEGER,
      del_adr_id: DataTypes.INTEGER,
      contact_id: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
      shipping_date: DataTypes.STRING,
      person_in_charge: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Orders',
    }
  );
  return Orders;
};
