const relatedMaterialsWarehouseRouter = require('express').Router();
const { RelatedMaterialsWarehouse } = require('../db/models/index.js');
const TokenService = require('../services/Token.js');
const { ACCESS_TOKEN_EXPIRATION } = require('../constants.js');
const { COOKIE_SETTINGS } = require('../constants.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_NEW_RELATED_MATERIALS_WAREHOUSE_SOCKET,
  UPDATE_RELATED_MATERIALS_WAREHOUSE_SOCKET,
} = require('../src/constants/event.js');
const { ErrorUtils } = require('../utils/Errors.js');

relatedMaterialsWarehouseRouter.get('/', async (req, res) => {
  try {
    const relatedMaterialsWarehouse = await RelatedMaterialsWarehouse.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ relatedMaterialsWarehouse });
  } catch (err) {
    console.error(err.message);
  }
});

relatedMaterialsWarehouseRouter.post('/', async (req, res) => {
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
    const relatedMaterialsWarehouse = await RelatedMaterialsWarehouse.create({
      article,
      product_article,
      free_quantity_remaining,
      total_quantity,
      ordered_quantity,
      warehouse_loc,
      type,
    });

    myEmitter.emit(
      ADD_NEW_RELATED_MATERIALS_WAREHOUSE_SOCKET,
      relatedMaterialsWarehouse
    );
    return res.json(relatedMaterialsWarehouse).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

relatedMaterialsWarehouseRouter.post('/update', async (req, res) => {
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
    const relatedMaterialsWarehouse = await RelatedMaterialsWarehouse.update(
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

    myEmitter.emit(
      UPDATE_RELATED_MATERIALS_WAREHOUSE_SOCKET,
      relatedMaterialsWarehouse
    );
    return res.json(relatedMaterialsWarehouse).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

module.exports = relatedMaterialsWarehouseRouter;
