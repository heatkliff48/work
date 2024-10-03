const OrdersRepository = require('../repositories/Orders.js');

class OrdersService {
  static async getOrdersList() {
    const orders = await OrdersRepository.getOrdersListData();

    return orders;
  }

  static async addNewOrder({ article, del_adr_id, contact_id, owner, status }) {
    const newOrder = await OrdersRepository.addNewOrderData({
      article,
      del_adr_id,
      contact_id,
      owner,
      status,
    });

    return newOrder;
  }

  static async addShippingDateOrder({ date }) {
    await OrdersRepository.addShippingDateOrder(date);

    return;
  }

  static async getProductsOfOrder() {
    const product_list = await OrdersRepository.getProductsOfOrder();

    return product_list;
  }

  static async getCurrentProductsOfOrder({ order_id }) {
    const product_list = await OrdersRepository.getCurrentProductsOfOrder({
      order_id,
    });

    return product_list;
  }

  static async getUpdateProductsOfOrder({ newProductsOfOrder }) {
    await OrdersRepository.getUpdateProductsOfOrder(newProductsOfOrder);

    return;
  }

  static async getUpdateProductInfoOfOrder({ productOfOrder }) {
    await OrdersRepository.getUpdateProductInfoOfOrder(productOfOrder);

    return;
  }

  static async getUpdateContactInfoOfOrder({ contact_id, order_id }) {
    await OrdersRepository.getUpdateContactInfoOrder({ contact_id, order_id });

    return;
  }

  static async getUpdateDeliveryAddressOrder({ address_id, order_id }) {
    await OrdersRepository.getUpdateDeliveryAddressOrder({ address_id, order_id });

    return;
  }

  static async getUpdateStatusOrder({ status, order_id }) {
    await OrdersRepository.getUpdateStatusOrder({ status, order_id });

    return;
  }

  static async getDeleteProductOfOrder({ product_id }) {
    await OrdersRepository.getDeleteProductOfOrder({
      product_id,
    });

    return;
  }

  static async getDeleteOrder({ order_id }) {
    await OrdersRepository.getDeleteOrder({
      order_id,
    });

    return;
  }
}

module.exports = OrdersService;
