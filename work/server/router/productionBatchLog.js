const productionBatchLogRouter = require('express').Router();
const { ProductionBatchLog } = require('../db/models');

productionBatchLogRouter.get('/', async (req, res) => {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>productionBatchLogRouter get');

  try {
    const productionBatchLog = await ProductionBatchLog.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ productionBatchLog });
  } catch (err) {
    console.error(err.message);
  }
});

productionBatchLogRouter.post('/', async (req, res) => {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>productionBatchLogRouter post');

  const { products_article, orders_article, production_date } =
    req.body.productionBatchLog;

  try {
    const productionBatchLog = await ProductionBatchLog.create({
      products_article,
      orders_article,
      production_date,
    });


    return res.status(200).json({ productionBatchLog });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

productionBatchLogRouter.post('/update/:l_id', async (req, res) => {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>productionBatchLogRouter update/:l_id');

  const { l_id, products_article, orders_article, production_date } =
    req.body.productionBatchLog;

  try {
    const productionBatchLog = await ProductionBatchLog.update(
      {
        products_article,
        orders_article,
        production_date,
      },
      {
        where: {
          id: l_id,
        },
        returning: true,
        plain: true,
      }
    );

    return res.status(200).json({ productionBatchLog });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

module.exports = productionBatchLogRouter;
