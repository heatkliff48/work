const filesOrderRouter = require('express').Router();
const { FilesOrder } = require('../db/models/index.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_NEW_FILES_ORDER_SOCKET,
  DELETE_FILES_ORDER_SOCKET,
} = require('../src/constants/event.js');

filesOrderRouter.get('/', async (req, res) => {
  try {
    const filesOrder = await FilesOrder.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ filesOrder });
  } catch (err) {
    console.error(err.message);
  }
});

filesOrderRouter.post('/', async (req, res) => {
  const { order_id, file_name } = req.body;

  try {
    const filesOrder = await FilesOrder.create({
      order_id,
      file_name,
    });

    myEmitter.emit(ADD_NEW_FILES_ORDER_SOCKET, filesOrder);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

filesOrderRouter.post('/delete', async (req, res) => {
  const { order_id } = req.body;

  try {
    await FilesOrder.destroy({ where: { id: order_id } });

    myEmitter.emit(DELETE_FILES_ORDER_SOCKET, order_id);
    return res.status(200);
  } catch (err) {
    return ErrorUtils.catchError(res, err);
  }
});

module.exports = filesOrderRouter;
