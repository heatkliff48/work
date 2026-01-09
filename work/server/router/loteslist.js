const lotesListRouter = require('express').Router();
const { LotesList } = require('../db/models/index.js');
const myEmitter = require('../src/ee.js');
const { ADD_NEW_LOTES_LIST_SOCKET } = require('../src/constants/event.js');
const { ErrorUtils } = require('../utils/Errors.js');

lotesListRouter.get('/', async (req, res) => {
  try {
    const lotesList = await LotesList.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ lotesList });
  } catch (err) {
    console.error(err.message);
  }
});

lotesListRouter.post('/', async (req, res) => {
  console.log('req.body', req.body);
  const { new_lotestList, lotesListCheck } = req.body;
  const { quantity_cakes, product, production_date } = new_lotestList;

  try {
    const quantityCakesInt = Math.floor(parseFloat(quantity_cakes));

    if (isNaN(quantityCakesInt) || quantityCakesInt <= 0) {
      return res
        .status(400)
        .json({ error: 'quantity_cakes must be a positive number' });
    }

    let cake_id, cake_id_finish;

    if (!lotesListCheck) {
      const lastLoteWithSameProduct = await LotesList.findOne({
        where: {
          product,
          production_date,
        },
        order: [['id', 'DESC']],
      });

      cake_id = lastLoteWithSameProduct.cake_id;
      cake_id_finish = lastLoteWithSameProduct.cake_id_finish + quantityCakesInt;
    } else {
      const lastLote = await LotesList.findOne({
        order: [['id', 'DESC']],
      });

      if (lastLote) {
        cake_id = lastLote.cake_id + lastLote.quantity_cakes;
      } else {
        cake_id = 1;
      }

      cake_id_finish = cake_id + quantityCakesInt - 1;
    }

    const lotesList = await LotesList.create({
      cake_id,
      cake_id_finish,
      quantity_cakes: quantityCakesInt,
      ...new_lotestList,
    });

    myEmitter.emit(ADD_NEW_LOTES_LIST_SOCKET, lotesList);
    return res.status(200).json(lotesList);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = lotesListRouter;
