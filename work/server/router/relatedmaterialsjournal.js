const relatedMaterialsJournalRouter = require('express').Router();
const { RelatedMaterialsJournal } = require('../db/models/index.js');
const TokenService = require('../services/Token.js');
const { ACCESS_TOKEN_EXPIRATION } = require('../constants.js');
const { COOKIE_SETTINGS } = require('../constants.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_NEW_RELATED_MATERIALS_JOURNAL_SOCKET,
  UPDATE_RELATED_MATERIALS_JOURNAL_SOCKET,
} = require('../src/constants/event.js');
const { ErrorUtils } = require('../utils/Errors.js');

relatedMaterialsJournalRouter.get('/', async (req, res) => {
  try {
    const relatedMaterialsJournal = await RelatedMaterialsJournal.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ relatedMaterialsJournal });
  } catch (err) {
    console.error(err.message);
  }
});

relatedMaterialsJournalRouter.post('/', async (req, res) => {
  const {
    name,
    article,
    units_of_measurement,
    description,
    place_of_production,
    price,
    product_code,
    active_status,
  } = req.body.productsTypeJournalInput;

  try {
    const relatedMaterialsJournal = await RelatedMaterialsJournal.create({
      name,
      article,
      units_of_measurement,
      description,
      place_of_production,
      price,
      product_code,
      active_status,
    });

    myEmitter.emit(
      ADD_NEW_RELATED_MATERIALS_JOURNAL_SOCKET,
      relatedMaterialsJournal
    );
    return res.json(relatedMaterialsJournal).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

relatedMaterialsJournalRouter.post('/update', async (req, res) => {
  const {
    id,
    name,
    article,
    units_of_measurement,
    description,
    place_of_production,
    price,
    product_code,
    active_status,
  } = req.body.productsTypeJournalInput;

  try {
    const relatedMaterialsJournal = await RelatedMaterialsJournal.update(
      {
        name,
        article,
        units_of_measurement,
        description,
        place_of_production,
        price,
        product_code,
        active_status,
      },
      {
        where: {
          id,
        },
        returning: true,
        plain: true,
      }
    );

    myEmitter.emit(UPDATE_RELATED_MATERIALS_JOURNAL_SOCKET, relatedMaterialsJournal);
    return res.json(relatedMaterialsJournal).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

module.exports = relatedMaterialsJournalRouter;
