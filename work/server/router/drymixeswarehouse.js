const dryMixesWarehouseRouter = require('express').Router();
const { DryMixesWarehouse } = require('../db/models/index.js');
const TokenService = require('../services/Token.js');
const { ACCESS_TOKEN_EXPIRATION } = require('../constants.js');
const { COOKIE_SETTINGS } = require('../constants.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_NEW_DRY_MIXES_WAREHOUSE_SOCKET,
  UPDATE_DRY_MIXES_WAREHOUSE_SOCKET,
} = require('../src/constants/event.js');
const { ErrorUtils } = require('../utils/Errors.js');

dryMixesWarehouseRouter.get('/', async (req, res) => {
  try {
    const dryMixesWarehouse = await DryMixesWarehouse.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ dryMixesWarehouse });
  } catch (err) {
    console.error(err.message);
  }
});

dryMixesWarehouseRouter.post('/', async (req, res) => {
  const {
    article,
    product_article,
    free_quantity_remaining,
    total_quantity,
    ordered_quantity,
    warehouse_loc,
    type,
  } = req.body;

  try {
    const dryMixesWarehouse = await DryMixesWarehouse.create({
      article,
      product_article,
      free_quantity_remaining,
      total_quantity,
      ordered_quantity,
      warehouse_loc,
      type,
    });

    myEmitter.emit(ADD_NEW_DRY_MIXES_WAREHOUSE_SOCKET, dryMixesWarehouse);
    return res.json(dryMixesWarehouse).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

dryMixesWarehouseRouter.post('/update', async (req, res) => {
  const {
    id,
    article,
    product_article,
    free_quantity_remaining,
    total_quantity,
    ordered_quantity,
    warehouse_loc,
    type,
  } = req.body;

  try {
    const dryMixesWarehouse = await DryMixesWarehouse.update(
      {
        article,
        product_article,
        free_quantity_remaining,
        total_quantity,
        ordered_quantity,
        warehouse_loc,
        type,
      },
      {
        where: {
          id,
        },
        returning: true,
        plain: true,
      }
    );

    myEmitter.emit(UPDATE_DRY_MIXES_WAREHOUSE_SOCKET, dryMixesWarehouse);
    return res.json(dryMixesWarehouse).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

module.exports = dryMixesWarehouseRouter;
