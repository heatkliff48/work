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
  const { product_name, units_per_pack, price_per_pack, type } = req.body;

  try {
    const dryMixesJournal = await DryMixesJournal.create({
      product_name,
      units_per_pack,
      price_per_pack,
      type,
    });

    myEmitter.emit(ADD_NEW_DRY_MIXES_JOURNAL_SOCKET, dryMixesJournal);
    return res.json(dryMixesJournal).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

dryMixesJournalRouter.post('/update', async (req, res) => {
  const { id, product_name, units_per_pack, price_per_pack, type } = req.body;

  try {
    const dryMixesJournal = await DryMixesJournal.update(
      {
        product_name,
        units_per_pack,
        price_per_pack,
        type,
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

// delete

// dryMixesJournalRouter.post('/delete', async (req, res) => {
//   const { batch_id } = req.body;

//   try {
//     await DryMixesJournal.destroy({ where: { id: batch_id } });

//     myEmitter.emit(DELETE_BATCH_OUTSIDE_SOCKET, batch_id);
//     return res.json(batch_id).status(200);
//   } catch (err) {
//     return ErrorUtils.catchError(res, err);
//   }
// });

module.exports = dryMixesJournalRouter;
