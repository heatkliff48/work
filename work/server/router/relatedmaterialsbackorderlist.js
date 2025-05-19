const relatedMaterialsBackorderListRouter = require('express').Router();
const { RelatedMaterialsBackorderList } = require('../db/models/index.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_NEW_RELATED_MATERIALS_BACKORDER_SOCKET,
  UPDATE_RELATED_MATERIALS_BACKORDER_SOCKET,
} = require('../src/constants/event.js');
const { ErrorUtils } = require('../utils/Errors.js');

relatedMaterialsBackorderListRouter.get('/', async (req, res) => {
  try {
    const relatedMaterialsBackorderList =
      await RelatedMaterialsBackorderList.findAll({
        order: [['id', 'ASC']],
      });

    return res.status(200).json({ relatedMaterialsBackorderList });
  } catch (err) {
    console.error(err.message);
  }
});

relatedMaterialsBackorderListRouter.post('/', async (req, res) => {
  const {
    product_article,
    order_article,
    quantity,
    shipping_date,
    quantity_in_warehouse,
  } = req.body;

  try {
    const relatedMaterialsBackorderList = await RelatedMaterialsBackorderList.create(
      {
        product_article,
        order_article,
        quantity,
        shipping_date,
        quantity_in_warehouse,
      }
    );

    myEmitter.emit(
      ADD_NEW_RELATED_MATERIALS_BACKORDER_SOCKET,
      relatedMaterialsBackorderList
    );
    return res.json(relatedMaterialsBackorderList).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

relatedMaterialsBackorderListRouter.post('/update', async (req, res) => {
  const {
    id,
    product_article,
    order_article,
    quantity,
    shipping_date,
    quantity_in_warehouse,
  } = req.body;

  try {
    const relatedMaterialsBackorderList = await RelatedMaterialsBackorderList.update(
      {
        product_article,
        order_article,
        quantity,
        shipping_date,
        quantity_in_warehouse,
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
      UPDATE_RELATED_MATERIALS_BACKORDER_SOCKET,
      relatedMaterialsBackorderList
    );
    return res.json(relatedMaterialsBackorderList).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

module.exports = relatedMaterialsBackorderListRouter;
