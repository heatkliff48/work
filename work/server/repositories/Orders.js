const {
  Orders,
  OrdersProducts,
  OrderDryMixedProducts,
  OrderAnchorProducts,
  OrderToolProducts,
  OrderRelMatProducts,
} = require('../db/models');

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

  static async addDescriptionOrder({ order_id, description }) {
    try {
      await Orders.update(
        {
          description,
        },
        { where: { id: order_id } }
      );

      const order_desc = await Orders.findOne({ where: { id: order_id } });

      return order_desc;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async addSecondaryContact({ secondary_contact, order_id }) {
    try {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.secondary_contact',
        secondary_contact
      );
      await Orders.update(
        {
          secondary_contact,
        },
        { where: { id: order_id } }
      );

      const order_newContact = await Orders.findOne({ where: { id: order_id } });
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.order_newContact',
        order_newContact
      );
      return order_newContact;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async deleteSecondaryContact(order_id) {
    try {
      await Orders.update(
        {
          secondary_contact: null,
        },
        { where: { id: order_id } }
      );

      const order_newContact = await Orders.findOne({ where: { id: order_id } });

      return order_newContact;
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

  static async getDryMixedProductsOfOrder() {
    try {
      const dry_mixed_product_list = await OrderDryMixedProducts.findAll({
        attributes: [
          'id',
          'order_id',
          'dry_mixed_id',
          'quantity_ud',
          'quantity_palet_dry',
          'quantity_real_ud',
          'total',
          'discount',
          'pvp',
          'final_price',
        ],
      });
      return dry_mixed_product_list;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async getAnchorProductsOfOrder() {
    try {
      const anchor_product_list = await OrderAnchorProducts.findAll({
        attributes: [
          'id',
          'order_id',
          'anchor_id',
          'quantity_ud',
          'quantity_palet_anchor',
          'quantity_real_ud',
          'total',
          'discount',
          'pvp',
          'final_price',
        ],
      });
      return anchor_product_list;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async getToolProductsOfOrder() {
    try {
      const tool_product_list = await OrderToolProducts.findAll({
        attributes: [
          'id',
          'order_id',
          'tool_id',
          'quantity_ud',
          'total',
          'discount',
          'pvp',
          'final_price',
        ],
      });
      return tool_product_list;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async getRelMatProductsOfOrder() {
    try {
      const rel_mat_product_list = await OrderRelMatProducts.findAll({
        attributes: [
          'id',
          'order_id',
          'rel_mat_id',
          'quantity_ud',
          'total',
          'discount',
          'pvp',
          'final_price',
        ],
      });
      return rel_mat_product_list;
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

      const allOrdrProd = await OrdersProducts.findAll({
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

      const tid = allOrdrProd[allOrdrProd.length - 1].id;
      return { id: tid, ...product_of_order.toJSON() };
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async getUpdateDryMixedProductsOfOrder(newDryMixedProductsOfOrder) {
    try {
      const { order_id, productOfOrder } = newDryMixedProductsOfOrder;

      const {
        dry_mixed_id,
        quantity_ud,
        quantity_palet_dry,
        quantity_real_ud,
        total,
        discount,
        final_price,
        pvp,
      } = productOfOrder;

      const product_of_order = await OrderDryMixedProducts.create({
        order_id,
        dry_mixed_id,
        quantity_ud,
        quantity_palet_dry,
        quantity_real_ud,
        total,
        discount,
        pvp,
        final_price,
      });

      const allOrdrProd = await OrderDryMixedProducts.findAll({
        attributes: [
          'id',
          'order_id',
          'dry_mixed_id',
          'quantity_ud',
          'quantity_palet_dry',
          'quantity_real_ud',
          'total',
          'discount',
          'pvp',
          'final_price',
        ],
      });

      const tid = allOrdrProd[allOrdrProd.length - 1].id;
      return { id: tid, ...product_of_order.toJSON() };
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async getUpdateAnchorProductsOfOrder(newAnchorProductsOfOrder) {
    try {
      const { order_id, productOfOrder } = newAnchorProductsOfOrder;

      const {
        anchor_id,
        quantity_ud,
        quantity_palet_anchor,
        quantity_real_ud,
        total,
        discount,
        final_price,
        pvp,
      } = productOfOrder;

      const product_of_order = await OrderAnchorProducts.create({
        order_id,
        anchor_id,
        quantity_ud,
        quantity_palet_anchor,
        quantity_real_ud,
        total,
        discount,
        pvp,
        final_price,
      });

      const allOrdrProd = await OrderAnchorProducts.findAll({
        attributes: [
          'id',
          'order_id',
          'anchor_id',
          'quantity_ud',
          'quantity_palet_anchor',
          'quantity_real_ud',
          'total',
          'discount',
          'pvp',
          'final_price',
        ],
      });

      const tid = allOrdrProd[allOrdrProd.length - 1].id;
      return { id: tid, ...product_of_order.toJSON() };
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async getUpdateToolProductsOfOrder(newToolProductsOfOrder) {
    try {
      const { order_id, productOfOrder } = newToolProductsOfOrder;

      const { tool_id, quantity_ud, total, discount, final_price, pvp } =
        productOfOrder;

      const product_of_order = await OrderToolProducts.create({
        order_id,
        tool_id,
        quantity_ud,
        total,
        discount,
        pvp,
        final_price,
      });

      const allOrdrProd = await OrderToolProducts.findAll({
        attributes: [
          'id',
          'order_id',
          'tool_id',
          'quantity_ud',
          'total',
          'discount',
          'pvp',
          'final_price',
        ],
      });

      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>allOrdrProd',
        allOrdrProd
      );

      const tid = allOrdrProd[allOrdrProd.length - 1].id;
      console.log('tid', tid);

      return { id: tid, ...product_of_order.toJSON() };
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async getUpdateRelMatProductsOfOrder(newRelMatProductsOfOrder) {
    try {
      const { order_id, productOfOrder } = newRelMatProductsOfOrder;

      const { rel_mat_id, quantity_ud, total, discount, final_price, pvp } =
        productOfOrder;

      const product_of_order = await OrderRelMatProducts.create({
        order_id,
        rel_mat_id,
        quantity_ud,
        total,
        discount,
        pvp,
        final_price,
      });

      const allOrdrProd = await OrderRelMatProducts.findAll({
        attributes: [
          'id',
          'order_id',
          'rel_mat_id',
          'quantity_ud',
          'total',
          'discount',
          'pvp',
          'final_price',
        ],
      });

      const tid = allOrdrProd[allOrdrProd.length - 1].id;

      return { id: tid, ...product_of_order.toJSON() };
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

  static async getDeleteDryMixedProductOfOrder({ product_id }) {
    try {
      await OrderDryMixedProducts.destroy({ where: { id: product_id } });

      return;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async getDeleteAnchorProductOfOrder({ product_id }) {
    try {
      await OrderAnchorProducts.destroy({ where: { id: product_id } });

      return;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async getDeleteToolProductOfOrder({ product_id }) {
    try {
      await OrderToolProducts.destroy({ where: { id: product_id } });

      return;
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
        id,
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
        { where: { id } }
      );

      const upd_prod_info = await OrdersProducts.findOne({
        where: { id },
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

      return upd_prod_info;
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
