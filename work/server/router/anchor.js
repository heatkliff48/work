const anchorRouter = require('express').Router();
const { Anchor } = require('../db/models/index.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_NEW_ANCHOR_SOCKET,
  UPDATE_ANCHOR_SOCKET,
} = require('../src/constants/event.js');
const { ErrorUtils } = require('../utils/Errors.js');

anchorRouter.get('/', async (req, res) => {
  try {
    const anchor = await Anchor.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ anchor });
  } catch (err) {
    console.error(err.message);
  }
});

anchorRouter.post('/', async (req, res) => {
  const {
    name,
    article,
    manufacturer_name,
    units_of_measurement,
    pieces_per_unit,
    boxes_on_a_pallet,
    box_weight,
    pallet_weight,
    description,
    place_of_production,
    price_per_unit,
    product_code,
    product_code_box,
    product_code_pall,
    active_status,
    version,
  } = req.body;

  try {
    const anchor = await Anchor.create({
      name,
      article,
      manufacturer_name,
      units_of_measurement,
      pieces_per_unit,
      boxes_on_a_pallet,
      box_weight,
      pallet_weight,
      description,
      place_of_production,
      price_per_unit,
      product_code,
      product_code_box,
      product_code_pall,
      active_status,
      version,
    });

    myEmitter.emit(ADD_NEW_ANCHOR_SOCKET, anchor);
    return res.json(anchor).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

anchorRouter.post('/update', async (req, res) => {
  const {
    id,
    name,
    article,
    manufacturer_name,
    units_of_measurement,
    pieces_per_unit,
    boxes_on_a_pallet,
    box_weight,
    pallet_weight,
    description,
    place_of_production,
    price_per_unit,
    product_code,
    product_code_box,
    product_code_pall,
    active_status,
    version,
  } = req.body;

  try {
    const anchor = await Anchor.update(
      {
        name,
        article,
        manufacturer_name,
        units_of_measurement,
        pieces_per_unit,
        boxes_on_a_pallet,
        box_weight,
        pallet_weight,
        description,
        place_of_production,
        price_per_unit,
        product_code,
        product_code_box,
        product_code_pall,
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

    myEmitter.emit(UPDATE_ANCHOR_SOCKET, anchor);
    return res.json(anchor).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

module.exports = anchorRouter;
