const orderToWarehouseRouter = require('express').Router();
const { OrderToWarehouse } = require('../db/models/index.js');
const TokenService = require('../services/Token.js');
const { ACCESS_TOKEN_EXPIRATION } = require('../constants.js');
const { COOKIE_SETTINGS } = require('../constants.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_NEW_ORDER_TO_WAREHOUSE_SOCKET,
  UPDATE_ORDER_TO_WAREHOUSE_SOCKET,
  DELETE_ORDER_TO_WAREHOUSE_SOCKET,
} = require('../src/constants/event.js');
const { ErrorUtils } = require('../utils/Errors.js');

orderToWarehouseRouter.get('/', async (req, res) => {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>orderToWarehouseRouter get');

  try {
    const orderToWarehouse = await OrderToWarehouse.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ orderToWarehouse });
  } catch (err) {
    console.error(err.message);
  }
});

orderToWarehouseRouter.post('/', async (req, res) => {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>orderToWarehouseRouter post');

  try {
    const orderToWarehouse = await OrderToWarehouse.create({
      ...req.body,
    });

    myEmitter.emit(ADD_NEW_ORDER_TO_WAREHOUSE_SOCKET, orderToWarehouse);
    return res.json(orderToWarehouse).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

orderToWarehouseRouter.post('/update', async (req, res) => {
  console.log(
    '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>orderToWarehouseRouter /update/:id',
  );

  const { id, ...data } = req.body;

  try {
    const existingRecord = await OrderToWarehouse.findByPk(id);

    const orderToWarehouse = await OrderToWarehouse.update(
      {
        ...data,
        quantity_produced:
          data.quantity_produced === null ||
          data.quantity_produced === undefined
            ? existingRecord.quantity_produced
            : data.quantity_produced > existingRecord.quantity_pallets
            ? existingRecord.quantity_pallets
            : data.quantity_produced,
        quantity_allocated:
          data.quantity_allocated === null ||
          data.quantity_allocated === undefined
            ? existingRecord.quantity_allocated
            : data.quantity_allocated + existingRecord.quantity_allocated >
              existingRecord.quantity_pallets
            ? existingRecord.quantity_pallets
            : data.quantity_allocated + existingRecord.quantity_allocated,
        // : data.quantity_allocated > existingRecord.quantity_pallets
        // ? existingRecord.quantity_pallets
        // : data.quantity_allocated,
      },
      {
        where: {
          id,
        },
        returning: true,
        plain: true,
      },
    );

    myEmitter.emit(UPDATE_ORDER_TO_WAREHOUSE_SOCKET, orderToWarehouse);

    return res.json(orderToWarehouse).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

orderToWarehouseRouter.post('/delete', async (req, res) => {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>orderToWarehouseRouter delete');

  const { order_id } = req.body;

  try {
    await OrderToWarehouse.destroy({ where: { id: order_id } });

    myEmitter.emit(DELETE_ORDER_TO_WAREHOUSE_SOCKET, order_id);
    return res.json(order_id).status(200);
  } catch (err) {
    return ErrorUtils.catchError(res, err);
  }
});

module.exports = orderToWarehouseRouter;
