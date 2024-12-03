const filesOrderRouter = require('express').Router();
const { FilesOrder } = require('../db/models/index.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_NEW_FILES_ORDER_SOCKET,
  DELETE_FILES_ORDER_SOCKET,
} = require('../src/constants/event.js');

filesOrderRouter.get('/', async (req, res) => {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>filesOrderRouter get');

  try {
    const filesOrder = await FilesOrder.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ filesOrder });
  } catch (err) {
    console.error(err.message);
    return res.json({ error: 'Internal Server Error' }).status(500);
  }
});

filesOrderRouter.post('/', async (req, res) => {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>filesOrderRouter post');

  const { order_id, file_name } = req.body;

  try {
    const filesOrder = await FilesOrder.create({
      order_id,
      file_name,
    });

    myEmitter.emit(ADD_NEW_FILES_ORDER_SOCKET, filesOrder);
    return res.status(200);
  } catch (err) {
    console.error(err.message);
    return res.json({ error: 'Internal Server Error' }).status(500);
  }
});

filesOrderRouter.post('/delete', async (req, res) => {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>filesOrderRouter delete');

  const { order_id } = req.body;

  const record = await FilesOrder.findOne({ where: { id: order_id } });
  if (!record) {
    return res.status(404).json({ error: 'Record not found' });
  }

  try {
    await FilesOrder.destroy({ where: { id: order_id } });

    myEmitter.emit(DELETE_FILES_ORDER_SOCKET, order_id);
    return res.status(200);
  } catch (err) {
    console.error(err.message);
    return res.json({ error: 'Internal Server Error' }).status(500);
  }
});

module.exports = filesOrderRouter;
