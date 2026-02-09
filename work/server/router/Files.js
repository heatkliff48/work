const filesRouter = require('express').Router();
const {
  FilesOrder,
  FilesProduct,
  FilesWarehouse,
  FilesListeLists,
} = require('../db/models/index.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_NEW_FILES_ORDER_SOCKET,
  DELETE_FILES_ORDER_SOCKET,
  ADD_NEW_FILES_PRODUCT_SOCKET,
  ADD_NEW_FILES_WAREHOUSE_SOCKET,
  ADD_NEW_FILES_LOTES_LIST_SOCKET,
} = require('../src/constants/event.js');

filesRouter.post('/', async (req, res) => {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>filesRouter post');

  const { fileType, file_name } = req.body;

  try {
    switch (fileType) {
      case 'order':
        const { order_id } = req.body;

        const filesOrder = await FilesOrder.create({
          order_id,
          file_name,
        });

        myEmitter.emit(ADD_NEW_FILES_ORDER_SOCKET, filesOrder);

        break;

      case 'product':
        const { product_id } = req.body;

        const filesProduct = await FilesProduct.create({
          product_id,
          file_name,
        });

        myEmitter.emit(ADD_NEW_FILES_PRODUCT_SOCKET, filesProduct);
        break;

      case 'warehouse':
        const { warehouse_id, warehouse_type } = req.body;

        const filesWarehouse = await FilesWarehouse.create({
          warehouse_id,
          warehouse_type,
          file_name,
        });

        myEmitter.emit(ADD_NEW_FILES_WAREHOUSE_SOCKET, filesWarehouse);
        break;

      case 'lotesList':
        const { lotesList_id } = req.body;

        const filesLotesList = await FilesListeLists.create({
          lotesList_id,
          file_name,
        });

        myEmitter.emit(ADD_NEW_FILES_LOTES_LIST_SOCKET, filesLotesList);
        break;

      default:
        break;
    }

    return res.status(200);
  } catch (err) {
    console.error(err.message);
    return res.json({ error: 'Internal Server Error' }).status(500);
  }
});

// filesRouter.post('/delete', async (req, res) => {
//   console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>filesRouter delete');

//   const { order_id } = req.body;

//   const record = await FilesOrder.findOne({ where: { id: order_id } });
//   if (!record) {
//     return res.status(404).json({ error: 'Record not found' });
//   }

//   try {
//     await FilesOrder.destroy({ where: { id: order_id } });

//     myEmitter.emit(DELETE_FILES_ORDER_SOCKET, order_id);
//     return res.status(200);
//   } catch (err) {
//     console.error(err.message);
//     return res.json({ error: 'Internal Server Error' }).status(500);
//   }
// });

module.exports = filesRouter;
