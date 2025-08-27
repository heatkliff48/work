const express = require('express');
const orderRandomProductsRouter = express.Router();
const { OrdersProducts, Products, AnotherTable } = require('../db/models/index.js');
const OrdersService = require('../services/Orders.js');
const WarehouseService = require('../services/Warehouse.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_RANDOM_PRODUCTS_OF_ORDER_SOCKET,
  ADD_DATASHIP_ORDER_SOCKET,
  UPDATE_STATUS_OF_ORDER_SOCKET,
} = require('../src/constants/event.js');

orderRandomProductsRouter.post('/add_random', async (req, res) => {
  const { order_id, order_article } = req.body;

  function getRandomFutureDate() {
    const today = new Date();

    const randomDays = Math.floor(Math.random() * 30) + 1;

    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + randomDays);

    const dd = String(futureDate.getDate()).padStart(2, '0');
    const mm = String(futureDate.getMonth() + 1).padStart(2, '0');
    const yyyy = futureDate.getFullYear();

    return `${dd}.${mm}.${yyyy}`;
  }

  try {
    const products = await Products.findAll({
      limit: 10,
      order: [['id', 'ASC']],
    });

    if (!products || products.length === 0) {
      return res.status(404).json({ error: 'Нет доступных продуктов' });
    }

    const randomCount = Math.floor(Math.random() * 4) + 2; // от 2 до 5 менять здесь
    const randomProducts = [];
    const shipping_date = getRandomFutureDate();

    for (let i = 0; i < randomCount; i++) {
      const randomIndex = Math.floor(Math.random() * products.length);
      const randomProduct = products[randomIndex];

      const randomQuantity = Math.floor(Math.random() * 1000) + 1;
      const randomQuantityPallets = Math.floor(Math.random() * 150) + 1;
      const randomQuantityReal = Math.floor(Math.random() * 1000) + 1;

      const created = await OrdersProducts.create({
        order_id,
        product_id: randomProduct.id,
        quantity_m2: randomQuantity,
        quantity_palet: randomQuantityPallets,
        quantity_real: randomQuantityReal,
        price_m2: 0,
        discount: 0,
        final_price: 0,
      });

      randomProducts.push(created);

      const orderedProduction = {
        shipping_date,
        product_article: randomProduct.article,
        order_article: order_article,
        quantity: randomQuantityPallets,
        quantity_in_warehouse: 0,
      };

      await WarehouseService.addNewListOfOrderedProduction({ orderedProduction });
    }

    // запись в другую таблицу
    // await AnotherTable.create({
    //   order_id,
    //   note: `Добавлено ${randomProducts.length} случайных продуктов`,
    //   created_at: new Date(),
    // });

    myEmitter.emit(ADD_RANDOM_PRODUCTS_OF_ORDER_SOCKET, randomProducts);

    const date = {
      order_id,
      shipping_date,
    };
    await OrdersService.addShippingDateOrder({ date });
    myEmitter.emit(ADD_DATASHIP_ORDER_SOCKET, date);

    await OrdersService.getUpdateStatusOrder({
      status: 6,
      order_id,
    });

    myEmitter.emit(UPDATE_STATUS_OF_ORDER_SOCKET, { status: 6, order_id });

    return res.status(200).json({ randomProducts });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = orderRandomProductsRouter;
