const OrdersRepository = require('../repositories/Orders.js');

class OrdersService {
  static async getOrdersList() {
    const orders = await OrdersRepository.getOrdersListData();

    return orders;
  }

  static async addNewOrder({
    article,
    del_adr_id,
    contact_id,
    owner,
    status,
    person_in_charge,
  }) {
    const newOrder = await OrdersRepository.addNewOrderData({
      article,
      del_adr_id,
      contact_id,
      owner,
      status,
      person_in_charge,
    });

    return newOrder;
  }

  static async addShippingDateOrder({ date }) {
    await OrdersRepository.addShippingDateOrder(date);

    return;
  }

  static async addDescriptionOrder(desc) {
    const order_desc = await OrdersRepository.addDescriptionOrder(desc);

    return order_desc;
  }

  static async addSecondaryContact(sec_cnt) {
    const order_newContact = await OrdersRepository.addSecondaryContact(sec_cnt);

    return order_newContact;
  }

  static async getProductsOfOrder() {
    const product_list = await OrdersRepository.getProductsOfOrder();

    return product_list;
  }

  static async getDryMixedProductsOfOrder() {
    const dry_mixed_product_list =
      await OrdersRepository.getDryMixedProductsOfOrder();

    return dry_mixed_product_list;
  }

  static async getAnchorProductsOfOrder() {
    const anchor_product_list = await OrdersRepository.getAnchorProductsOfOrder();

    return anchor_product_list;
  }

  static async getToolProductsOfOrder() {
    const tool_product_list = await OrdersRepository.getToolProductsOfOrder();

    return tool_product_list;
  }

  static async getRelMatProductsOfOrder() {
    const rel_mat_product_list = await OrdersRepository.getRelMatProductsOfOrder();

    return rel_mat_product_list;
  }

  static async getCurrentProductsOfOrder({ order_id }) {
    const product_list = await OrdersRepository.getCurrentProductsOfOrder({
      order_id,
    });

    return product_list;
  }

  static async getUpdateProductsOfOrder(newProductsOfOrder) {
    const product_of_order = await OrdersRepository.getUpdateProductsOfOrder(
      newProductsOfOrder
    );

    return product_of_order;
  }

  static async getUpdateDryMixedProductsOfOrder(newDryMixedProductsOfOrder) {
    const dry_mixed_product_of_order =
      await OrdersRepository.getUpdateDryMixedProductsOfOrder(
        newDryMixedProductsOfOrder
      );

    return dry_mixed_product_of_order;
  }

  static async getUpdateAnchorProductsOfOrder(newAnchorProductsOfOrder) {
    const anchor_product_of_order =
      await OrdersRepository.getUpdateAnchorProductsOfOrder(
        newAnchorProductsOfOrder
      );

    return anchor_product_of_order;
  }

  static async getUpdateToolProductsOfOrder(newToolProductsOfOrder) {
    const tool_product_of_order =
      await OrdersRepository.getUpdateToolProductsOfOrder(newToolProductsOfOrder);

    return tool_product_of_order;
  }

  static async getUpdateRelMatProductsOfOrder(newRelMatProductsOfOrder) {
    const rel_mat_product_of_order =
      await OrdersRepository.getUpdateRelMatProductsOfOrder(newRelMatProductsOfOrder);

    return rel_mat_product_of_order;
  }

  static async getDeleteProductOfOrder({ product_id }) {
    await OrdersRepository.getDeleteProductOfOrder({
      product_id,
    });

    return;
  }

  static async getDeleteDryMixedProductOfOrder({ product_id }) {
    await OrdersRepository.getDeleteDryMixedProductOfOrder({
      product_id,
    });

    return;
  }

  static async getDeleteAnchorProductOfOrder({ product_id }) {
    await OrdersRepository.getDeleteAnchorProductOfOrder({
      product_id,
    });

    return;
  }

  static async getDeleteToolProductOfOrder({ product_id }) {
    await OrdersRepository.getDeleteToolProductOfOrder({
      product_id,
    });

    return;
  }

  static async getUpdateProductInfoOfOrder({ productOfOrder }) {
    const upd_prod_info = await OrdersRepository.getUpdateProductInfoOfOrder(
      productOfOrder
    );

    return upd_prod_info;
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

  static async getUpdateInChargeOrder({ person_in_charge, order_id }) {
    await OrdersRepository.getUpdateInChargeOrder({ person_in_charge, order_id });

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
