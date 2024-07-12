const { where } = require('sequelize');
const { Orders } = require('../db/models');

class OrdersRepository {
  static async getOrdersListData() {
    const orders = await Orders.findAll();
    return orders;
  }
  static async addNewOrderData(newOrder) {
    const order = await Orders.create(newOrder);
    return order;
  }
}

module.exports = OrdersRepository;
