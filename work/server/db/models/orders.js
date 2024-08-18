'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Clients, DeliveryAddresses, OrdersProducts }) {
      this.belongsTo(Clients, { foreignKey: 'id' });
      // this.belongsTo(DeliveryAddresses, { foreignKey: 'id' });
      this.hasMany(OrdersProducts, { foreignKey: 'id' });
    }
  }
  Orders.init(
    {
      article: DataTypes.STRING,
      owner: DataTypes.INTEGER,
      del_adr_id: DataTypes.INTEGER,
      contact_id: DataTypes.INTEGER,
      status: DataTypes.STRING,
      shipping_date: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Orders',
    }
  );
  return Orders;
};
