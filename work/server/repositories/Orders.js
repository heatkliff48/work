const { where } = require('sequelize');
const { Orders, OrdersProducts } = require('../db/models');

class OrdersRepository {
  static async getOrdersListData() {
    try {
      const orders = await Orders.findAll();
      return orders;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async addNewOrderData(new_order) {
    try {
      const order = await Orders.create(new_order);

      return order;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async addShippingDateOrder({ order_id, shipping_date }) {
    try {
      const order = await Orders.update(
        {
          shipping_date,
        },
        { where: { id: order_id } }
      );

      return;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async getProductsOfOrder() {
    try {
      const product_list = await OrdersProducts.findAll({
        attributes: [
          'id',
          'order_id',
          'product_id',
          'quantity_m2',
          'quantity_palet',
          'quantity_real',
          'price_m2',
          'discount',
          'final_price',
          'warehouse_id',
        ],
      });
      return product_list;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async getCurrentProductsOfOrder({ order_id }) {
    try {
      const product_list = await OrdersProducts.findAll({
        where: { order_id },
        attributes: [
          'id',
          'order_id',
          'product_id',
          'quantity_m2',
          'quantity_palet',
          'quantity_real',
          'price_m2',
          'discount',
          'final_price',
          'warehouse_id',
        ],
      });

      return product_list;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async getUpdateProductsOfOrder(newProductsOfOrder) {
    try {
      const { order_id, productOfOrder } = newProductsOfOrder;

      const {
        product_id,
        quantity_m2,
        quantity_palet,
        quantity_real,
        price_m2,
        discount,
        final_price,
        warehouse_id,
      } = productOfOrder;

      const product_of_order = await OrdersProducts.create({
        order_id,
        product_id,
        quantity_m2,
        quantity_palet,
        quantity_real,
        price_m2,
        discount,
        final_price,
        warehouse_id,
      });

      return product_of_order;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async getUpdateProductInfoOfOrder(productOfOrder) {
    try {
      const {
        product_id,
        order_id,
        quantity_m2,
        quantity_palet,
        quantity_real,
        price_m2,
        discount,
        final_price,
        warehouse_id,
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
          warehouse_id,
        },
        { where: { id: productOfOrder.id } }
      );
      return;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async getUpdateContactInfoOrder({ contact_id, order_id }) {
    try {
      await Orders.update({ contact_id }, { where: { id: order_id } });
      return;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async getUpdateDeliveryAddressOrder({ address_id, order_id }) {
    try {
      await Orders.update({ del_adr_id: address_id }, { where: { id: order_id } });
      return;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async getUpdateStatusOrder({ order_id, status }) {
    try {
      await Orders.update({ status }, { where: { id: order_id } });
      return;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async getUpdateInChargeOrder({ order_id, person_in_charge }) {
    try {
      await Orders.update({ person_in_charge }, { where: { id: order_id } });
      return;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async getDeleteProductOfOrder({ product_id }) {
    try {
      await OrdersProducts.destroy({ where: { id: product_id } });

      return;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async getDeleteOrder({ order_id }) {
    try {
      await OrdersProducts.destroy({ where: { order_id } });
      await Orders.destroy({ where: { id: order_id } });

      return;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }
}

module.exports = OrdersRepository;
