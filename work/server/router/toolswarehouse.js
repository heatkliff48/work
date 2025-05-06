const toolsWarehouseRouter = require('express').Router();
const { ToolsWarehouse } = require('../db/models/index.js');
const TokenService = require('../services/Token.js');
const { ACCESS_TOKEN_EXPIRATION } = require('../constants.js');
const { COOKIE_SETTINGS } = require('../constants.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_NEW_TOOLS_WAREHOUSE_SOCKET,
  UPDATE_TOOLS_WAREHOUSE_SOCKET,
} = require('../src/constants/event.js');
const { ErrorUtils } = require('../utils/Errors.js');

toolsWarehouseRouter.get('/', async (req, res) => {
  try {
    const toolsWarehouse = await ToolsWarehouse.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ toolsWarehouse });
  } catch (err) {
    console.error(err.message);
  }
});

toolsWarehouseRouter.post('/', async (req, res) => {
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
    const toolsWarehouse = await ToolsWarehouse.create({
      article,
      product_article,
      free_quantity_remaining,
      total_quantity,
      ordered_quantity,
      warehouse_loc,
      type,
    });

    myEmitter.emit(ADD_NEW_TOOLS_WAREHOUSE_SOCKET, toolsWarehouse);
    return res.json(toolsWarehouse).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

toolsWarehouseRouter.post('/update', async (req, res) => {
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
    const toolsWarehouse = await ToolsWarehouse.update(
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

    myEmitter.emit(UPDATE_TOOLS_WAREHOUSE_SOCKET, toolsWarehouse);
    return res.json(toolsWarehouse).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

module.exports = toolsWarehouseRouter;
