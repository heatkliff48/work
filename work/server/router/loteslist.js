// const lotesListBatchesRouter = require('express').Router();
// const { LotesList } = require('../db/models/index.js');
// const myEmitter = require('../src/ee.js');
// const {
//   ADD_NEW_LOTES_LIST_SOCKET,
//   UPDATE_LOTES_LIST_SOCKET,
// } = require('../src/constants/event.js');
// const { ErrorUtils } = require('../utils/Errors.js');

// lotesListBatchesRouter.get('/', async (req, res) => {
//   try {
//     const lotesListBatches = await LotesListsBatches.findAll({
//       order: [['id', 'ASC']],
//     });

//     return res.status(200).json({ lotesListBatches });
//   } catch (err) {
//     console.error(err.message);
//   }
// });

// lotesListBatchesRouter.post('/', async (req, res) => {
//   const { new_lotestList, lotesListBatchesCheck } = req.body;
//   const { quantity_cakes, product, production_date } = new_lotestList;

//   try {
//     const quantityCakesInt = Math.floor(parseFloat(quantity_cakes));

//     if (isNaN(quantityCakesInt) || quantityCakesInt <= 0) {
//       return res
//         .status(400)
//         .json({ error: 'quantity_cakes must be a positive number' });
//     }

//     let cake_id_start, cake_id_finish;

//     if (!lotesListBatchesCheck) {
//       const lastLoteWithSameProduct = await LotesListsBatches.findOne({
//         where: {
//           product,
//           production_date,
//         },
//         order: [['id', 'DESC']],
//       });

//       if (lastLoteWithSameProduct) {
//         cake_id_start = lastLoteWithSameProduct.cake_id_start;
//         cake_id_finish = lastLoteWithSameProduct.cake_id_finish + quantityCakesInt;
//       } else {
//         const lastLote = await LotesListsBatches.findOne({
//           order: [['id', 'DESC']],
//         });

//         if (lastLote) {
//           cake_id_start = lastLote.cake_id_start + lastLote.quantity_cakes;
//         } else {
//           cake_id_start = 1;
//         }

//         cake_id_finish = cake_id_start + quantityCakesInt - 1;
//       }
//     } else {
//       const lastLote = await LotesListsBatches.findOne({
//         order: [['id', 'DESC']],
//       });

//       if (lastLote) {
//         cake_id_start = lastLote.cake_id_start + lastLote.quantity_cakes;
//       } else {
//         cake_id_start = 1;
//       }

//       cake_id_finish = cake_id_start + quantityCakesInt - 1;
//     }

//     const lotesListBatches = await LotesListsBatches.create({
//       cake_id_start,
//       cake_id_finish,
//       quantity_cakes: quantityCakesInt,
//       ...new_lotestList,
//     });

//     myEmitter.emit(ADD_NEW_LOTES_LIST_SOCKET, lotesListBatches);
//     return res.status(200).json(lotesListBatches);
//   } catch (err) {
//     console.error(err.message);
//     return res.status(500).json({ error: err.message });
//   }
// });

// lotesListBatchesRouter.post('/update', async (req, res) => {
//   const { id } = req.body;

//   try {
//     const [count, rows] = await LotesListsBatches.update(
//       { ...req.body },
//       {
//         where: { id },
//         returning: true,
//       }
//     );

//     if (count === 0) {
//       return res.status(404).json({ error: 'Record not found' });
//     }

//     const updatedLotes = rows[0];

//     myEmitter.emit(UPDATE_LOTES_LIST_SOCKET, updatedLotes);
//     return res.status(200);
//   } catch (err) {
//     console.error(err.message);
//     return res.status(500).json({ error: err.message });
//   }
// });

// module.exports = lotesListBatchesRouter;

const lotesListRouter = require('express').Router();
const { Op } = require('sequelize');
const { LotesListsBatches, LotesListsCakes } = require('../db/models/index.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_NEW_LOTES_LIST_SOCKET,
  UPDATE_LOTES_LIST_SOCKET,
  ADD_NEW_LOTES_LIST_CAKES_SOCKET,
} = require('../src/constants/event.js');
const { ErrorUtils } = require('../utils/Errors.js');

lotesListRouter.get('/batches', async (req, res) => {
  try {
    const lotesListBatches = await LotesListsBatches.findAll({
      order: [
        ['batch_id', 'ASC'],
        ['sub_batch_id', 'ASC'],
        ['id', 'ASC'],
      ],
    });

    return res.status(200).json({ lotesListBatches });
  } catch (err) {
    console.error(err.message);
  }
});

lotesListRouter.post('/batches', async (req, res) => {
  console.log('>>>req.body<<<<<<<<<<<<<<<<<<<<<<<<<<', req.body);
  const { new_lotestList } = req.body;
  const { quantity_cakes, product, production_date, recipe } = new_lotestList;

  try {
    const quantityCakesInt = Math.floor(parseFloat(quantity_cakes));

    if (isNaN(quantityCakesInt) || quantityCakesInt <= 0) {
      return res
        .status(400)
        .json({ error: 'quantity_cakes must be a positive number' });
    }

    const lastByCakeFinish = await LotesListsBatches.findOne({
      order: [
        ['cake_id_finish', 'DESC'],
        ['id', 'DESC'],
      ],
    });

    const cake_id_start = lastByCakeFinish?.cake_id_finish
      ? Number(lastByCakeFinish.cake_id_finish) + 1
      : 1;

    const cake_id_finish = cake_id_start + quantityCakesInt - 1;

    const existingSameCombo = await LotesListsBatches.findOne({
      where: {
        product,
        production_date,
        // recipe,
      },
      order: [
        ['batch_id', 'DESC'],
        ['sub_batch_id', 'DESC'],
        ['id', 'DESC'],
      ],
    });

    let batch_id;
    if (existingSameCombo?.batch_id) {
      batch_id = Number(existingSameCombo.batch_id);
    } else {
      const lastBatch = await LotesListsBatches.findOne({
        where: {
          batch_id: { [Op.ne]: null },
        },
        order: [
          ['batch_id', 'DESC'],
          ['id', 'DESC'],
        ],
      });
      batch_id = lastBatch?.batch_id ? Number(lastBatch.batch_id) + 1 : 1;
    }

    const lastSubBatch = await LotesListsBatches.findOne({
      where: {
        batch_id,
      },
      order: [
        ['sub_batch_id', 'DESC'],
        ['id', 'DESC'],
      ],
    });

    const sub_batch_id = lastSubBatch?.sub_batch_id
      ? Number(lastSubBatch.sub_batch_id) + 1
      : 1;

    const lotesListBatches = await LotesListsBatches.create({
      cake_id_start,
      cake_id_finish,
      batch_id,
      sub_batch_id,
      quantity_cakes: quantityCakesInt,
      ...new_lotestList,
    });
    const lotesListCakesArray = [];
    for (let i = cake_id_start; i <= cake_id_finish; i++) {
      const res = await LotesListsCakes.create({});
      lotesListCakesArray.push(res);
    }

    myEmitter.emit(ADD_NEW_LOTES_LIST_CAKES_SOCKET, lotesListCakesArray);
    myEmitter.emit(ADD_NEW_LOTES_LIST_SOCKET, lotesListBatches);
    return res.status(200).json(lotesListBatches);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: err.message });
  }
});

lotesListRouter.post('/batches/update/recipe', async (req, res) => {
  const { batch_id, sub_batch_id } = req.body;

  try {
    const [count, rows] = await LotesListsBatches.update(
      { ...req.body },
      {
        where: { batch_id, sub_batch_id },
        returning: true,
      }
    );

    if (count === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const updatedLotes = rows[0];

    myEmitter.emit(UPDATE_LOTES_LIST_SOCKET, updatedLotes);
    return res.status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: err.message });
  }
});

lotesListRouter.get('/cakes', async (req, res) => {
  try {
    const lotesListCakes = await LotesListsCakes.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json(lotesListCakes);
  } catch (err) {
    console.error(err.message);
  }
});

lotesListRouter.post('/cakes/update/recipe', async (req, res) => {
  const { cake_id, recipe } = req.body;

  try {
    const [count, rows] = await LotesListsCakes.update(
      { ...recipe },
      {
        where: { id: cake_id },
        returning: true,
      }
    );

    if (count === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const updatedLotes = rows[0];

    myEmitter.emit(UPDATE_LOTES_LIST_SOCKET, updatedLotes);
    return res.status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = lotesListRouter;
