const filesProductRouter = require('express').Router();
const { FilesProduct } = require('../db/models/index.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_NEW_FILES_PRODUCT_SOCKET,
  DELETE_FILES_PRODUCT_SOCKET,
} = require('../src/constants/event.js');

filesProductRouter.get('/', async (req, res) => {
  try {
    const filesProduct = await FilesProduct.findAll({
      product: [['id', 'ASC']],
    });

    return res.status(200).json({ filesProduct });
  } catch (err) {
    console.error(err.message);
    return res.json({ error: 'Internal Server Error' }).status(500);
  }
});

filesProductRouter.post('/', async (req, res) => {
  const { product_id, file_name } = req.body;

  try {
    const filesProduct = await FilesProduct.create({
      product_id,
      file_name,
    });

    myEmitter.emit(ADD_NEW_FILES_PRODUCT_SOCKET, filesProduct);
    return res.status(200);
  } catch (err) {
    console.error(err.message);
    return res.json({ error: 'Internal Server Error' }).status(500);
  }
});

filesProductRouter.post('/delete', async (req, res) => {
  const { product_id } = req.body;

  const record = await FilesProduct.findOne({ where: { id: product_id } });
  if (!record) {
    return res.status(404).json({ error: 'Record not found' });
  }

  try {
    await FilesProduct.destroy({ where: { id: product_id } });

    myEmitter.emit(DELETE_FILES_PRODUCT_SOCKET, product_id);
    return res.status(200);
  } catch (err) {
    console.error(err.message);
    return res.json({ error: 'Internal Server Error' }).status(500);
  }
});

module.exports = filesProductRouter;
