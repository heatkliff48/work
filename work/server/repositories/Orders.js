const {
  Orders,
  OrdersProducts,
  OrderDryMixedProducts,
  OrderAnchorProducts,
  OrderToolProducts,
  OrderRelMatProducts,
} = require('../db/models');
const myEmitter = require('../src/ee.js');
const {
  UPDATE_DRY_MIXED_PRODUCT_OF_ORDER_SOCKET,
  UPDATE_ANCHOR_PRODUCT_OF_ORDER_SOCKET,
  UPDATE_TOOL_PRODUCT_OF_ORDER_SOCKET,
  UPDATE_REL_MAT_PRODUCT_OF_ORDER_SOCKET,
} = require('../src/constants/event');

class OrdersRepository {
  static async getOrdersListData() {
    try {
      const orders = await Orders.findAll();
      return orders;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      return error;
    }
  }

  static async addNewOrderData(new_order) {
    try {
      const order = await Orders.create(new_order);

      return order;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      return error;
    }
  }
  static async addDeliveryPrice({ delivery, order_id }) {
    try {
      await Orders.update({ delivery }, { where: { id: order_id } });
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      return error;
    }
  }

  static async addShippingDateOrder({ order_id, shipping_date }) {
    try {
      const order = await Orders.update(
        {
          shipping_date,
        },
        { where: { id: order_id } },
      );

      return;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      return error;
    }
  }

  static async addDescriptionOrder({ order_id, description }) {
    try {
      await Orders.update(
        {
          description,
        },
        { where: { id: order_id } },
      );

      const order_desc = await Orders.findOne({ where: { id: order_id } });

      return order_desc;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      return error;
    }
  }

  static async addSecondaryContact({ secondary_contact, order_id }) {
    try {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.secondary_contact',
        secondary_contact,
      );
      await Orders.update(
        {
          secondary_contact,
        },
        { where: { id: order_id } },
      );

      const order_newContact = await Orders.findOne({
        where: { id: order_id },
      });
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.order_newContact',
        order_newContact,
      );
      return order_newContact;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      return error;
    }
  }

  static async deleteSecondaryContact(order_id) {
    try {
      await Orders.update(
        {
          secondary_contact: null,
        },
        { where: { id: order_id } },
      );

      const order_newContact = await Orders.findOne({
        where: { id: order_id },
      });

      return order_newContact;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
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
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
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
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
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
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
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
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
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
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
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
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
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
        price_m3,
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
        price_m3,
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
          'price_m3',
          'discount',
          'final_price',
          'warehouse_id',
        ],
      });

      const tid = allOrdrProd[allOrdrProd.length - 1].id;
      return { id: tid, ...product_of_order.toJSON() };
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
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
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
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
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
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
        allOrdrProd,
      );

      const tid = allOrdrProd[allOrdrProd.length - 1].id;
      console.log('tid', tid);

      return { id: tid, ...product_of_order.toJSON() };
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
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
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      return error;
    }
  }

  static async getDeleteProductOfOrder({ product_id }) {
    try {
      await OrdersProducts.destroy({ where: { id: product_id } });

      return;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      return error;
    }
  }

  static async getDeleteDryMixedProductOfOrder({ product_id }) {
    try {
      await OrderDryMixedProducts.destroy({ where: { id: product_id } });

      return;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      return error;
    }
  }

  static async getDeleteAnchorProductOfOrder({ product_id }) {
    try {
      await OrderAnchorProducts.destroy({ where: { id: product_id } });

      return;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      return error;
    }
  }

  static async getDeleteToolProductOfOrder({ product_id }) {
    try {
      await OrderToolProducts.destroy({ where: { id: product_id } });

      return;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      return error;
    }
  }

  static async getDeleteRelMatProductOfOrder({ product_id }) {
    try {
      await OrderRelMatProducts.destroy({ where: { id: product_id } });

      return;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
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
        price_m3,
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
          price_m3,
          discount,
          final_price,
          warehouse_id,
        },
        { where: { id } },
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
          'price_m3',
          'discount',
          'final_price',
          'warehouse_id',
        ],
      });

      return upd_prod_info;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      return error;
    }
  }

  static async getUpdateDryMixedProductsInfoOfOrder(productOfOrder) {
    try {
      const {
        order_id,
        dry_mixed_id,
        quantity_ud,
        quantity_palet_dry,
        quantity_real_ud,
        total,
        discount,
        pvp,
        final_price,
        id,
      } = productOfOrder;

      await OrderDryMixedProducts.update(
        {
          order_id,
          dry_mixed_id,
          quantity_ud,
          quantity_palet_dry,
          quantity_real_ud,
          total,
          discount,
          pvp,
          final_price,
          id,
        },
        { where: { id } },
      );

      const upd_prod_info = await OrderDryMixedProducts.findOne({
        where: { id },
        attributes: [
          'order_id',
          'dry_mixed_id',
          'quantity_ud',
          'quantity_palet_dry',
          'quantity_real_ud',
          'total',
          'discount',
          'pvp',
          'final_price',
          'id',
        ],
      });

      return upd_prod_info;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      return error;
    }
  }

  static async getUpdateAnchorProductsInfoOfOrder(productOfOrder) {
    try {
      const {
        order_id,
        anchor_id,
        quantity_ud,
        quantity_palet_anchor,
        quantity_real_ud,
        total,
        discount,
        pvp,
        final_price,
        id,
      } = productOfOrder;

      await OrderAnchorProducts.update(
        {
          order_id,
          anchor_id,
          quantity_ud,
          quantity_palet_anchor,
          quantity_real_ud,
          total,
          discount,
          pvp,
          final_price,
          id,
        },
        { where: { id } },
      );

      const upd_prod_info = await OrderAnchorProducts.findOne({
        where: { id },
        attributes: [
          'order_id',
          'anchor_id',
          'quantity_ud',
          'quantity_palet_anchor',
          'quantity_real_ud',
          'total',
          'discount',
          'pvp',
          'final_price',
          'id',
        ],
      });

      return upd_prod_info;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      return error;
    }
  }

  static async getUpdateToolProductsInfoOfOrder(productOfOrder) {
    try {
      const {
        order_id,
        tool_id,
        quantity_ud,
        total,
        discount,
        pvp,
        final_price,
        id,
      } = productOfOrder;

      await OrderToolProducts.update(
        {
          order_id,
          tool_id,
          quantity_ud,
          total,
          discount,
          pvp,
          final_price,
          id,
        },
        { where: { id } },
      );

      const upd_prod_info = await OrderToolProducts.findOne({
        where: { id },
        attributes: [
          'order_id',
          'tool_id',
          'quantity_ud',
          'total',
          'discount',
          'pvp',
          'final_price',
          'id',
        ],
      });

      return upd_prod_info;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      return error;
    }
  }

  static async getUpdateRelMatProductsInfoOfOrder(productOfOrder) {
    try {
      const {
        order_id,
        rel_mat_id,
        quantity_ud,
        total,
        discount,
        pvp,
        final_price,
        id,
      } = productOfOrder;

      await OrderRelMatProducts.update(
        {
          order_id,
          rel_mat_id,
          quantity_ud,
          total,
          discount,
          pvp,
          final_price,
          id,
        },
        { where: { id } },
      );

      const upd_prod_info = await OrderRelMatProducts.findOne({
        where: { id },
        attributes: [
          'order_id',
          'rel_mat_id',
          'quantity_ud',
          'total',
          'discount',
          'pvp',
          'final_price',
          'id',
        ],
      });

      return upd_prod_info;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      return error;
    }
  }

  static async getUpdateContactInfoOrder({ contact_id, order_id }) {
    try {
      await Orders.update({ contact_id }, { where: { id: order_id } });
      return;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      return error;
    }
  }

  static async getUpdateDeliveryAddressOrder({ address_id, order_id }) {
    try {
      await Orders.update(
        { del_adr_id: address_id },
        { where: { id: order_id } },
      );
      return;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      return error;
    }
  }

  static async getUpdateStatusOrder({ order_id, status }) {
    try {
      await Orders.update({ status }, { where: { id: order_id } });
      return;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      return error;
    }
  }

  static async getUpdateInChargeOrder({ order_id, person_in_charge }) {
    try {
      await Orders.update({ person_in_charge }, { where: { id: order_id } });
      return;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      return error;
    }
  }

  static async addChildOrder({
    article,
    owner,
    del_adr_id,
    contact_id,
    secondary_contact,
    person_in_charge,
    shipping_date,
    main_order,
    products,
    dryMixes,
    anchors,
    tools,
    relMats,
  }) {
    try {
      const childOrder = await Orders.create({
        article,
        owner,
        del_adr_id,
        contact_id,
        secondary_contact: secondary_contact || null,
        person_in_charge: person_in_charge || 0,
        shipping_date,
        status: 4,
        main_order,
      });

      const order_id = childOrder.id;
      const createdProducts = {
        products: [],
        dryMixes: [],
        anchors: [],
        tools: [],
        relMats: [],
      };

      if (products && products.length > 0) {
        createdProducts.products = await OrdersProducts.bulkCreate(
          products.map((p) => ({
            order_id,
            product_id: p.product_id,
            quantity_palet: p.quantity_palet,
            quantity_m2: p.quantity_m2 || 0,
            quantity_real: p.quantity_real || 0,
            price_m2: p.price_m2 || 0,
            price_m3: p.price_m3 || 0,
            discount: p.discount || 0,
            final_price: p.final_price || 0,
          })),
        );
      }

      if (dryMixes && dryMixes.length > 0) {
        createdProducts.dryMixes = await OrderDryMixedProducts.bulkCreate(
          dryMixes.map((p) => ({
            order_id,
            dry_mixed_id: p.dry_mixed_id,
            quantity_palet_dry: p.quantity_palet_dry,
            quantity_ud: p.quantity_ud || 0,
            quantity_real_ud: p.quantity_real_ud || 0,
            total: p.total || 0,
            discount: p.discount || 0,
            pvp: p.pvp || 0,
            final_price: p.final_price || 0,
          })),
        );
      }

      if (anchors && anchors.length > 0) {
        createdProducts.anchors = await OrderAnchorProducts.bulkCreate(
          anchors.map((p) => ({
            order_id,
            anchor_id: p.anchor_id,
            quantity_palet_anchor: p.quantity_palet_anchor,
            quantity_ud: p.quantity_ud || 0,
            quantity_real_ud: p.quantity_real_ud || 0,
            total: p.total || 0,
            discount: p.discount || 0,
            pvp: p.pvp || 0,
            final_price: p.final_price || 0,
          })),
        );
      }

      if (tools && tools.length > 0) {
        createdProducts.tools = await OrderToolProducts.bulkCreate(
          tools.map((p) => ({
            order_id,
            tool_id: p.tool_id,
            quantity_ud: p.quantity_ud,
            total: p.total || 0,
            discount: p.discount || 0,
            pvp: p.pvp || 0,
            final_price: p.final_price || 0,
          })),
        );
      }

      if (relMats && relMats.length > 0) {
        createdProducts.relMats = await OrderRelMatProducts.bulkCreate(
          relMats.map((p) => ({
            order_id,
            rel_mat_id: p.rel_mat_id,
            quantity_ud: p.quantity_ud,
            total: p.total || 0,
            discount: p.discount || 0,
            pvp: p.pvp || 0,
            final_price: p.final_price || 0,
          })),
        );
      }

      // Вместо отправки всего массива, отправляем каждый элемент по отдельности
      if (createdProducts.dryMixes && createdProducts.dryMixes.length > 0) {
        createdProducts.dryMixes.forEach((dryMix) => {
          // Преобразуем Sequelize объект в обычный объект
          const plainDryMix = dryMix.toJSON ? dryMix.toJSON() : dryMix;
          myEmitter.emit(UPDATE_DRY_MIXED_PRODUCT_OF_ORDER_SOCKET, plainDryMix);
        });
      }

      if (createdProducts.anchors && createdProducts.anchors.length > 0) {
        createdProducts.anchors.forEach((anchor) => {
          const plainAnchor = anchor.toJSON ? anchor.toJSON() : anchor;
          myEmitter.emit(UPDATE_ANCHOR_PRODUCT_OF_ORDER_SOCKET, plainAnchor);
        });
      }

      if (createdProducts.tools && createdProducts.tools.length > 0) {
        createdProducts.tools.forEach((tool) => {
          const plainTool = tool.toJSON ? tool.toJSON() : tool;
          myEmitter.emit(UPDATE_TOOL_PRODUCT_OF_ORDER_SOCKET, plainTool);
        });
      }

      if (createdProducts.relMats && createdProducts.relMats.length > 0) {
        createdProducts.relMats.forEach((relMat) => {
          const plainRelMat = relMat.toJSON ? relMat.toJSON() : relMat;
          myEmitter.emit(UPDATE_REL_MAT_PRODUCT_OF_ORDER_SOCKET, plainRelMat);
        });
      }

      // Возвращаем полный объект
      return {
        ...childOrder.toJSON(),
        products: createdProducts.products,
        dryMixes: createdProducts.dryMixes,
        anchors: createdProducts.anchors,
        tools: createdProducts.tools,
        relMats: createdProducts.relMats,
      };
    } catch (error) {
      console.log('Error in addChildOrder:', error);
      throw error;
    }
  }
}

module.exports = OrdersRepository;
