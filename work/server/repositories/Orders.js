const { where } = require('sequelize');
const { Orders, OrdersProducts } = require('../db/models');

class OrdersRepository {
  static async getOrdersListData() {
    const orders = await Orders.findAll();
    return orders;
  }
  static async addNewOrderData({ article, del_adr_id, owner, status, productList }) {
    const order = await Orders.create({
      article,
      owner,
      del_adr_id,
      status,
    });

    for (let i = 0; i < productList.length; i++) {
      const {
        product_id,
        quantity_m2,
        quantity_palet,
        quantity_real,
        price_m2,
        discount,
        final_price,
      } = productList[i];

      await OrdersProducts.create({
        order_id: order.id,
        product_id,
        quantity_m2,
        quantity_palet,
        quantity_real,
        price_m2,
        discount,
        final_price,
      });
    }

    return order;
  }

  static async getProductsOfOrder({ order_id }) {
    const product_list = await OrdersProducts.findAll({ where: { order_id } });

    return product_list;
  }
}

module.exports = OrdersRepository;
