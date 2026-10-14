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

// Имя нового события одинаково в репозитории, wsEmitter и клиентском обработчике.
const UPDATE_ORDER_PDF_DATE_SOCKET = 'UPDATE_ORDER_PDF_DATE_SOCKET';

const notifyPdfDateAfterCommit = async (order, transaction) => {
  // Читаем именно сохранённое значение: точность DATE зависит от диалекта БД.
  const savedOrder = await Orders.findByPk(order.id, {
    attributes: ['id', 'pdf_updated_at'],
    transaction,
  });
  const payload = {
    order_id: savedOrder.id,
    pdf_updated_at: savedOrder.pdf_updated_at,
  };
  transaction.afterCommit(() => {
    // Ошибка доставки сообщения не должна превращать выполненное сохранение в ошибку.
    try {
      myEmitter.emit(UPDATE_ORDER_PDF_DATE_SOCKET, payload);
    } catch (error) {
      console.error('Failed to publish order PDF date:', error);
    }
  });
};

// Все изменения заказа и его даты сохраняются в одной транзакции.
// Блокировка заказа сериализует одновременные изменения его товаров.
const definedValues = (values) => Object.fromEntries(
  Object.entries(values).filter(([, value]) => value !== undefined),
);

const numericTypes = new Set([
  'INTEGER', 'BIGINT', 'SMALLINT', 'TINYINT', 'MEDIUMINT',
  'FLOAT', 'DOUBLE', 'REAL', 'DECIMAL',
]);

const hasChangedValues = (Model, record, values) => Object.entries(values).some(
  ([field, value]) => {
    const previous = record[field];
    if (previous === value) return false;
    if (previous == null || value == null) return true;

    const type = Model.rawAttributes[field]?.type?.key;
    if (numericTypes.has(type) && previous !== '' && value !== '') {
      const oldNumber = Number(previous);
      const newNumber = Number(value);
      if (Number.isFinite(oldNumber) && Number.isFinite(newNumber)) {
        return oldNumber !== newNumber;
      }
    }
    if (type === 'DATE') {
      return new Date(previous).getTime() !== new Date(value).getTime();
    }
    return String(previous) !== String(value);
  },
);

const getOrderId = (value) => {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error('A valid order_id is required');
  }
  return id;
};

const lockOrder = async (orderId, transaction) => {
  const order = await Orders.findByPk(getOrderId(orderId), {
    transaction,
    lock: transaction.LOCK.UPDATE,
  });
  if (!order) throw new Error('Order not found');
  return order;
};

const updateOrderFields = async (orderId, values) => Orders.sequelize.transaction(
  async (transaction) => {
    const order = await lockOrder(orderId, transaction);
    const changes = definedValues(values);
    if (!hasChangedValues(Orders, order, changes)) return order;

    await order.update({
      ...changes,
      pdf_updated_at: new Date(),
    }, { transaction });
    await notifyPdfDateAfterCommit(order, transaction);
    return order;
  },
);

const createOrderProduct = async (Model, values) => Orders.sequelize.transaction(
  async (transaction) => {
    const order = await lockOrder(values.order_id, transaction);
    const product = await Model.create(values, { transaction });
    await order.update({ pdf_updated_at: new Date() }, { transaction });
    await notifyPdfDateAfterCommit(order, transaction);
    return product;
  },
);

const deleteOrderProduct = async (Model, productId) => Orders.sequelize.transaction(
  async (transaction) => {
    // order_id берём из БД до удаления, а не из тела запроса.
    const existing = await Model.findByPk(productId, { transaction });
    if (!existing) return;
    const order = await lockOrder(existing.order_id, transaction);
    const product = await Model.findByPk(productId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!product) return;
    if (getOrderId(product.order_id) !== getOrderId(existing.order_id)) {
      throw new Error('Product changed concurrently; retry the operation');
    }

    await product.destroy({ transaction });
    await order.update({ pdf_updated_at: new Date() }, { transaction });
    await notifyPdfDateAfterCommit(order, transaction);
  },
);

const updateOrderProduct = async (
  Model,
  productId,
  values,
  { quantity_liberated, maximumField },
) => Orders.sequelize.transaction(async (transaction) => {
  const existing = await Model.findByPk(productId, { transaction });
  if (!existing) throw new Error('Order product not found');

  const changes = definedValues(values);
  // При переносе позиции отмечаем оба заказа; блокируем их по порядку id.
  const orderIds = [...new Set([
    getOrderId(existing.order_id),
    getOrderId(changes.order_id === undefined ? existing.order_id : changes.order_id),
  ])].sort((a, b) => a - b);
  const orders = [];
  for (const orderId of orderIds) {
    orders.push(await lockOrder(orderId, transaction));
  }

  const product = await Model.findByPk(productId, {
    transaction,
    lock: transaction.LOCK.UPDATE,
  });
  if (!product) throw new Error('Order product not found');
  if (getOrderId(product.order_id) !== getOrderId(existing.order_id)) {
    throw new Error('Product changed concurrently; retry the operation');
  }

  // Сохраняем существующую механику накопления quantity_liberated.
  if (quantity_liberated !== undefined && quantity_liberated !== null) {
    const total = Number(product.quantity_liberated || 0) + Number(quantity_liberated);
    if (!Number.isFinite(total)) throw new Error('Invalid quantity liberated');
    if (total > Number(product[maximumField])) {
      throw new Error(
        `Quantity liberated (${total}) exceeds ${maximumField} (${product[maximumField]})`,
      );
    }
    changes.quantity_liberated = total;
  }

  if (!hasChangedValues(Model, product, changes)) return product;
  await product.update(changes, { transaction });
  const modifiedAt = new Date();
  for (const order of orders) {
    await order.update({ pdf_updated_at: modifiedAt }, { transaction });
    await notifyPdfDateAfterCommit(order, transaction);
  }
  return product;
});

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
      const order = await Orders.create({ ...new_order, pdf_updated_at: new Date() });

      return order;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      throw error;
    }
  }
  static async addDeliveryPrice({ delivery, order_id }) {
    try {
      await updateOrderFields(order_id, { delivery });
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      throw error;
    }
  }

  static async addDeliveryM2Price({ delivery_m2, order_id }) {
    try {
      await updateOrderFields(order_id, { delivery_m2 });
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      throw error;
    }
  }

  static async addShippingDateOrder({ order_id, shipping_date }) {
    try {
      await updateOrderFields(order_id, { shipping_date });

      return;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      throw error;
    }
  }

  static async addDescriptionOrder({ order_id, description }) {
    try {
      await updateOrderFields(order_id, { description });

      const order_desc = await Orders.findOne({ where: { id: order_id } });

      return order_desc;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      throw error;
    }
  }

  static async addSecondaryContact({ secondary_contact, order_id }) {
    try {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.secondary_contact',
        secondary_contact,
      );
      await updateOrderFields(order_id, { secondary_contact });

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
      throw error;
    }
  }

  static async deleteSecondaryContact(order_id) {
    try {
      await updateOrderFields(order_id, { secondary_contact: null });

      const order_newContact = await Orders.findOne({
        where: { id: order_id },
      });

      return order_newContact;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      throw error;
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
          'price_m3',
          'discount',
          'final_price',
          'warehouse_id',
          'quantity_liberated',
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
          'quantity_liberated',
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
          'quantity_liberated',
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
          'quantity_liberated',
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
          'quantity_liberated',
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
          'price_m3',
          'discount',
          'final_price',
          'warehouse_id',
          'quantity_liberated',
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

      const product_of_order = await createOrderProduct(OrdersProducts, {
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
      throw error;
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

      const product_of_order = await createOrderProduct(OrderDryMixedProducts, {
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
      throw error;
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

      const product_of_order = await createOrderProduct(OrderAnchorProducts, {
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
      throw error;
    }
  }

  static async getUpdateToolProductsOfOrder(newToolProductsOfOrder) {
    try {
      const { order_id, productOfOrder } = newToolProductsOfOrder;

      const { tool_id, quantity_ud, total, discount, final_price, pvp } =
        productOfOrder;

      const product_of_order = await createOrderProduct(OrderToolProducts, {
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
      throw error;
    }
  }

  static async getUpdateRelMatProductsOfOrder(newRelMatProductsOfOrder) {
    try {
      const { order_id, productOfOrder } = newRelMatProductsOfOrder;

      const { rel_mat_id, quantity_ud, total, discount, final_price, pvp } =
        productOfOrder;

      const product_of_order = await createOrderProduct(OrderRelMatProducts, {
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
      throw error;
    }
  }

  static async getDeleteProductOfOrder({ product_id }) {
    try {
      await deleteOrderProduct(OrdersProducts, product_id);

      return;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      throw error;
    }
  }

  static async getDeleteDryMixedProductOfOrder({ product_id }) {
    try {
      await deleteOrderProduct(OrderDryMixedProducts, product_id);

      return;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      throw error;
    }
  }

  static async getDeleteAnchorProductOfOrder({ product_id }) {
    try {
      await deleteOrderProduct(OrderAnchorProducts, product_id);

      return;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      throw error;
    }
  }

  static async getDeleteToolProductOfOrder({ product_id }) {
    try {
      await deleteOrderProduct(OrderToolProducts, product_id);

      return;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      throw error;
    }
  }

  static async getDeleteRelMatProductOfOrder({ product_id }) {
    try {
      await deleteOrderProduct(OrderRelMatProducts, product_id);

      return;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      throw error;
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
        quantity_liberated,
      } = productOfOrder;

      await updateOrderProduct(OrdersProducts, id, {
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
      }, {
        quantity_liberated,
        maximumField: 'quantity_palet',
      });

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
          'quantity_liberated',
        ],
      });

      return upd_prod_info;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      throw error;
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
        quantity_liberated,
      } = productOfOrder;

      await updateOrderProduct(OrderDryMixedProducts, id, {
        order_id,
        dry_mixed_id,
        quantity_ud,
        quantity_palet_dry,
        quantity_real_ud,
        total,
        discount,
        pvp,
        final_price,
      }, {
        quantity_liberated,
        maximumField: 'quantity_palet_dry',
      });

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
          'quantity_liberated',
        ],
      });

      return upd_prod_info;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      throw error;
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
        quantity_liberated,
      } = productOfOrder;

      await updateOrderProduct(OrderAnchorProducts, id, {
        order_id,
        anchor_id,
        quantity_ud,
        quantity_palet_anchor,
        quantity_real_ud,
        total,
        discount,
        pvp,
        final_price,
      }, {
        quantity_liberated,
        maximumField: 'quantity_ud',
      });

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
          'quantity_liberated',
        ],
      });

      return upd_prod_info;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      throw error;
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
        quantity_liberated,
      } = productOfOrder;

      await updateOrderProduct(OrderToolProducts, id, {
        order_id,
        tool_id,
        quantity_ud,
        total,
        discount,
        pvp,
        final_price,
      }, {
        quantity_liberated,
        maximumField: 'quantity_ud',
      });

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
          'quantity_liberated',
        ],
      });

      return upd_prod_info;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      throw error;
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
        quantity_liberated,
      } = productOfOrder;

      await updateOrderProduct(OrderRelMatProducts, id, {
        order_id,
        rel_mat_id,
        quantity_ud,
        total,
        discount,
        pvp,
        final_price,
      }, {
        quantity_liberated,
        maximumField: 'quantity_ud',
      });

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
          'quantity_liberated',
        ],
      });

      return upd_prod_info;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      throw error;
    }
  }

  static async getUpdateContactInfoOrder({ contact_id, order_id }) {
    try {
      await updateOrderFields(order_id, { contact_id });
      return;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      throw error;
    }
  }

  static async getUpdateDeliveryAddressOrder({ address_id, order_id }) {
    try {
      await updateOrderFields(order_id, { del_adr_id: address_id });
      return;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      throw error;
    }
  }

  static async getUpdateStatusOrder({ order_id, status }) {
    try {
      await updateOrderFields(order_id, { status });
      return;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      throw error;
    }
  }

  static async getUpdateInChargeOrder({ order_id, person_in_charge }) {
    try {
      await updateOrderFields(order_id, { person_in_charge });
      return;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      throw error;
    }
  }

  static async getUpdatePaymentOrder({ order_id, payment_method }) {
    try {
      await updateOrderFields(order_id, { payment_method });
      return;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      throw error;
    }
  }

  static async getDeleteOrder({ order_id }) {
    try {
      await OrdersProducts.destroy({ where: { order_id } });
      await Orders.destroy({ where: { id: order_id } });

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
    delivery_m2,
    region,
    payment_method,
  }) {
    try {
      const { childOrder, createdProducts } = await Orders.sequelize.transaction(async (transaction) => {
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
          delivery_m2,
          region,
          payment_method,
          pdf_updated_at: new Date(),
        }, { transaction });

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
            { transaction },
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
            { transaction },
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
            { transaction },
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
            { transaction },
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
            { transaction },
          );
        }

        await childOrder.update({ pdf_updated_at: new Date() }, { transaction });
        return { childOrder, createdProducts };
      });

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
