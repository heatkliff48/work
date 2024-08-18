const { where } = require('sequelize');
const { Orders, OrdersProducts } = require('../db/models');

class OrdersRepository {
  static async getOrdersListData() {
    const orders = await Orders.findAll();
    return orders;
  }

  static async addNewOrderData({ article, del_adr_id, contact_id, owner, status }) {
    const order = await Orders.create({
      article,
      owner,
      del_adr_id,
      contact_id,
      status,
    });

    return order;
  }

  static async addShippingDateOrder({ order_id, shipping_date }) {
    const order = await Orders.update(
      {
        shipping_date,
      },
      { where: { id: order_id } }
    );

    return;
  }

  static async getProductsOfOrder({ order_id }) {
    const product_list = await OrdersProducts.findAll({ where: { order_id } });

    return product_list;
  }

  static async getUpdateProductsOfOrder(newProductsOfOrder) {
    const { order_id, productOfOrder } = newProductsOfOrder;

    const {
      product_id,
      quantity_m2,
      quantity_palet,
      quantity_real,
      price_m2,
      discount,
      final_price,
    } = productOfOrder;

    await OrdersProducts.create({
      order_id,
      product_id,
      quantity_m2,
      quantity_palet,
      quantity_real,
      price_m2,
      discount,
      final_price,
    });

    return;
  }

  static async getUpdateProductInfoOfOrder(productOfOrder) {
    const {
      product_id,
      order_id,
      quantity_m2,
      quantity_palet,
      quantity_real,
      price_m2,
      discount,
      final_price,
    } = productOfOrder;

    await OrdersProducts.update(
      {
        order_id,
        product_id,
        quantity_m2,
        quantity_palet,
        quantity_real,
        price_m2,
        discount,
        final_price,
      },
      { where: { id: productOfOrder.id } }
    );
    return;
  }

  static async getUpdateContactInfoOrder({ contact_id, order_id }) {
    await Orders.update({ contact_id }, { where: { id: order_id } });
    return;
  }

  static async getUpdateDeliveryAddressOrder({ address_id, order_id }) {
    await Orders.update({ del_adr_id: address_id }, { where: { id: order_id } });
    return;
  }

  static async getUpdateStatusOrder({ order_id, status }) {
    await Orders.update({ status }, { where: { id: order_id } });
    return;
  }

  static async getDeleteProductOfOrder({ product_id }) {
    await OrdersProducts.destroy({ where: { id: product_id } });

    return;
  }

  static async getDeleteOrder({ order_id }) {
    await OrdersProducts.destroy({ where: { order_id } });
    await Orders.destroy({ where: { id: order_id } });

    return;
  }
}

module.exports = OrdersRepository;
