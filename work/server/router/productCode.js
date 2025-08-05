const productCodeRouter = require('express').Router();
const { ProductCode } = require('../db/models/index.js');
const myEmitter = require('../src/ee.js');
const { UPDATE_PRODUCT_CODE_SOCKET } = require('../src/constants/event.js');
const { ErrorUtils } = require('../utils/Errors.js');

productCodeRouter.get('/', async (req, res) => {
  try {
    const productCode = await ProductCode.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ productCode });
  } catch (err) {
    console.error(err.message);
  }
});

productCodeRouter.post('/update', async (req, res) => {
  const { id, product_code } = req.body;

  try {
    const productCode = await ProductCode.update(
      {
        product_code,
      },
      {
        where: {
          id,
        },
        returning: true,
        plain: true,
      }
    );

    myEmitter.emit(UPDATE_PRODUCT_CODE_SOCKET, productCode);
    return res.json(productCode).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

module.exports = productCodeRouter;
