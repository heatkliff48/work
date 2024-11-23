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
  }
});

filesWarehouseRouter.post('/', async (req, res) => {
  const { warehouse_id, file_name } = req.body;

  try {
    const filesWarehouse = await FilesWarehouse.create({
      warehouse_id,
      file_name,
    });

    myEmitter.emit(ADD_NEW_FILES_WAREHOUSE_SOCKET, filesWarehouse);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

filesWarehouseRouter.post('/delete', async (req, res) => {
  const { warehouse_id } = req.body;

  try {
    await FilesWarehouse.destroy({ where: { id: warehouse_id } });

    myEmitter.emit(DELETE_FILES_WAREHOUSE_SOCKET, warehouse_id);
    return res.status(200);
  } catch (err) {
    return ErrorUtils.catchError(res, err);
  }
});

module.exports = filesWarehouseRouter;
