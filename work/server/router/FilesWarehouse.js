const filesWarehouseRouter = require('express').Router();
const { FilesWarehouse } = require('../db/models/index.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_NEW_FILES_WAREHOUSE_SOCKET,
  DELETE_FILES_WAREHOUSE_SOCKET,
} = require('../src/constants/event.js');

filesWarehouseRouter.get('/', async (req, res) => {
  try {
    const filesWarehouse = await FilesWarehouse.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ filesWarehouse });
  } catch (err) {
    console.error(err.message);
    return res.json({ error: 'Internal Server Error' }).status(500);
  }
});

filesWarehouseRouter.post('/', async (req, res) => {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>filesOrderRouter post');

  const { warehouse_id, file_name } = req.body;

  try {
    const filesWarehouse = await FilesWarehouse.create({
      warehouse_id,
      file_name,
    });

    myEmitter.emit(ADD_NEW_FILES_WAREHOUSE_SOCKET, filesWarehouse);
    return res.status(200);
  } catch (err) {
    console.error(err.message);
    return res.json({ error: 'Internal Server Error' }).status(500);
  }
});

filesWarehouseRouter.post('/delete', async (req, res) => {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>filesOrderRouter delete');

  const { warehouse_id } = req.body;

  try {
    await FilesWarehouse.destroy({ where: { id: warehouse_id } });

    myEmitter.emit(DELETE_FILES_WAREHOUSE_SOCKET, warehouse_id);
  } catch (err) {
    console.error(err.message);
    return res.json({ error: 'Internal Server Error' }).status(500);
  }
});

module.exports = filesWarehouseRouter;
