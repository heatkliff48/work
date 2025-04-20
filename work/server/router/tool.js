const toolRouter = require('express').Router();
const { Tool } = require('../db/models/index.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_NEW_TOOL_SOCKET,
  UPDATE_TOOL_SOCKET,
} = require('../src/constants/event.js');
const { ErrorUtils } = require('../utils/Errors.js');

toolRouter.get('/', async (req, res) => {
  try {
    const tool = await Tool.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ tool });
  } catch (err) {
    console.error(err.message);
  }
});

toolRouter.post('/', async (req, res) => {
  const {
    name,
    article,
    manufacturer_name,
    units_of_measurement,
    piece_weight,
    description,
    place_of_production,
    price_per_unit,
    product_code,
    active_status,
    version,
  } = req.body;

  try {
    const tool = await Tool.create({
      name,
      article,
      manufacturer_name,
      units_of_measurement,
      piece_weight,
      description,
      place_of_production,
      price_per_unit,
      product_code,
      active_status,
      version,
    });

    myEmitter.emit(ADD_NEW_TOOL_SOCKET, tool);
    return res.json(tool).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

toolRouter.post('/update', async (req, res) => {
  const {
    id,
    name,
    article,
    manufacturer_name,
    units_of_measurement,
    piece_weight,
    description,
    place_of_production,
    price_per_unit,
    product_code,
    active_status,
    version,
  } = req.body;

  try {
    const tool = await Tool.update(
      {
        name,
        article,
        manufacturer_name,
        units_of_measurement,
        piece_weight,
        description,
        place_of_production,
        price_per_unit,
        product_code,
        active_status,
        version,
      },
      {
        where: {
          id,
        },
        returning: true,
        plain: true,
      }
    );

    myEmitter.emit(UPDATE_TOOL_SOCKET, tool);
    return res.json(tool).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

module.exports = toolRouter;
