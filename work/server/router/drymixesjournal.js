const dryMixesJournalRouter = require('express').Router();
const { DryMixesJournal } = require('../db/models/index.js');
const TokenService = require('../services/Token.js');
const { ACCESS_TOKEN_EXPIRATION } = require('../constants.js');
const { COOKIE_SETTINGS } = require('../constants.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_NEW_DRY_MIXES_JOURNAL_SOCKET,
  UPDATE_DRY_MIXES_JOURNAL_SOCKET,
} = require('../src/constants/event.js');
const { ErrorUtils } = require('../utils/Errors.js');

dryMixesJournalRouter.get('/', async (req, res) => {
  try {
    const dryMixesJournal = await DryMixesJournal.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ dryMixesJournal });
  } catch (err) {
    console.error(err.message);
  }
});

dryMixesJournalRouter.post('/', async (req, res) => {
  const {
    name,
    article,
    units_of_measurement,
    number_of_bags,
    description,
    place_of_production,
    price,
    product_code,
  } = req.body.productsTypeJournalInput;

  console.log(
    'req.body.productsTypeJournalInput----------------------------------------------------',
    req.body.productsTypeJournalInput
  );

  try {
    const dryMixesJournal = await DryMixesJournal.create({
      name,
      article,
      units_of_measurement,
      number_of_bags,
      description,
      place_of_production,
      price,
      product_code,
    });

    myEmitter.emit(ADD_NEW_DRY_MIXES_JOURNAL_SOCKET, dryMixesJournal);
    return res.json(dryMixesJournal).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

dryMixesJournalRouter.post('/update', async (req, res) => {
  const {
    id,
    name,
    article,
    units_of_measurement,
    number_of_bags,
    description,
    place_of_production,
    price,
    product_code,
  } = req.body.productsTypeJournalInput;

  try {
    const dryMixesJournal = await DryMixesJournal.update(
      {
        name,
        article,
        units_of_measurement,
        number_of_bags,
        description,
        place_of_production,
        price,
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

    myEmitter.emit(UPDATE_DRY_MIXES_JOURNAL_SOCKET, dryMixesJournal);
    return res.json(dryMixesJournal).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

module.exports = dryMixesJournalRouter;
