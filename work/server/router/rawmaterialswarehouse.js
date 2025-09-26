const rawMaterialsWarehouseRouter = require('express').Router();
const { RawMaterialsWarehouse } = require('../db/models/index.js');
const { WarehouseSand } = require('../db/models/index.js');
const TokenService = require('../services/Token.js');
const { ACCESS_TOKEN_EXPIRATION } = require('../constants.js');
const { COOKIE_SETTINGS } = require('../constants.js');
const myEmitter = require('../src/ee.js');
const {
  UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET,
  ADD_NEW_WAREHOUSE_SAND_SOCKET,
  UPDATE_WAREHOUSE_SAND_SOCKET,
  DELETE_WAREHOUSE_SAND_SOCKET,
} = require('../src/constants/event.js');
const { ErrorUtils } = require('../utils/Errors.js');

rawMaterialsWarehouseRouter.get('/', async (req, res) => {
  try {
    const rawMaterialsWarehouse = await RawMaterialsWarehouse.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ rawMaterialsWarehouse });
  } catch (err) {
    console.error(err.message);
  }
});

rawMaterialsWarehouseRouter.post('/update', async (req, res) => {
  const { material_type, remaining_quantity, last_updated } = req.body;

  try {
    const rawMaterialsWarehouse = await RawMaterialsWarehouse.update(
      {
        remaining_quantity,
        last_updated,
      },
      {
        where: {
          material_type,
        },
        returning: true,
        plain: true,
      }
    );

    myEmitter.emit(UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET, rawMaterialsWarehouse);
    return res.json(rawMaterialsWarehouse).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

// Sand

rawMaterialsWarehouseRouter.get('/sand', async (req, res) => {
  try {
    const warehouseSand = await WarehouseSand.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ warehouseSand });
  } catch (err) {
    console.error(err.message);
  }
});

rawMaterialsWarehouseRouter.post('/sand', async (req, res) => {
  const { supplier, quantity } = req.body;

  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const year = today.getFullYear();

  const date = `${day}.${month}.${year}`;

  try {
    const warehouseSand = await WarehouseSand.create({
      supplier,
      quantity,
      date,
    });

    myEmitter.emit(ADD_NEW_WAREHOUSE_SAND_SOCKET, warehouseSand);
    return res.json(warehouseSand).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post('/sand/update', async (req, res) => {
  const { supplier, quantity, date } = req.body;

  try {
    const warehouseSand = await WarehouseSand.update(
      {
        quantity,
        date,
      },
      {
        where: {
          supplier,
        },
        returning: true,
        plain: true,
      }
    );

    myEmitter.emit(UPDATE_WAREHOUSE_SAND_SOCKET, warehouseSand);
    return res.json(warehouseSand).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post('/sand/delete', async (req, res) => {
  const { sand_warehouse_id } = req.body;

  try {
    await WarehouseSand.destroy({ where: { id: sand_warehouse_id } });

    myEmitter.emit(DELETE_WAREHOUSE_SAND_SOCKET, sand_warehouse_id);
    return res.json(sand_warehouse_id).status(200);
  } catch (err) {
    return ErrorUtils.catchError(res, err);
  }
});

// Lime
// Cement
// Gypsum
// Gypsum stone
// Aluminum 1
// Aluminum 2
// Grinding Balls
// AAC

module.exports = rawMaterialsWarehouseRouter;
