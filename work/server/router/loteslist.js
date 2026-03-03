const lotesListRouter = require('express').Router();
const { Op, where } = require('sequelize');
const {
  LotesListsBatches,
  LotesListsCakes,
  sequelize,
} = require('../db/models/index.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_NEW_LOTES_LIST_SOCKET,
  UPDATE_LOTES_LIST_SOCKET,
  ADD_NEW_LOTES_LIST_CAKES_SOCKET,
  UPDATE_LOTES_LIST_CAKES_SOCKET,
  UPDATE_LOTES_LIST_CAKES_BOOLEAN_SOCKET,
  UPDATE_LOTES_LIST_NOTE_SOCKET,
  DELETE_LOTES_LIST_CAKES_SOCKET,
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
  const { new_lotestList, new_batch = false } = req.body;

  if (Array.isArray(new_lotestList)) {
    try {
      const created = [];
      for (const item of new_lotestList) {
        const quantityCakesInt = Math.floor(parseFloat(item.quantity_cakes));
        const lotesListBatches = await LotesListsBatches.create({
          cake_id_start: item.cake_id_start,
          cake_id_finish: item.cake_id_finish,
          batch_id: item.batch_id,
          sub_batch_id: item.sub_batch_id,
          ...item,
          quantity_cakes: quantityCakesInt,
          sand_dry: item.sand_dry || item.sand_powder_dry || '0',
        });
        created.push(lotesListBatches);
        myEmitter.emit(ADD_NEW_LOTES_LIST_SOCKET, lotesListBatches);
      }
      return res.status(200).json(created);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  const { quantity_cakes, product, production_date, batch_id } = new_lotestList;
  const sand_dry =
    (new_lotestList.sand_dry ?? new_lotestList.sand_powder_dry) || '0';

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

    // let batch_id;
    let sub_batch_id;

    // const lastLatestBatch = await LotesListsBatches.findAll({
    //   order: [['batch_id', 'DESC']],
    // });

    // if (new_batch) {
    //   batch_id = Number(lastLatestBatch[0]?.batch_id ?? 0) + 1;
    //   sub_batch_id = 1;
    // } else {
    // const existingSameCombo = await LotesListsBatches.findOne({
    //   where: {
    //     product,
    //     production_date,
    //   },
    //   order: [
    //     ['batch_id', 'DESC'],
    //     ['sub_batch_id', 'DESC'],
    //     ['id', 'DESC'],
    //   ],
    // });

    // if (existingSameCombo?.batch_id) {
    //   batch_id = Number(existingSameCombo.batch_id);
    // } else {
    //   const lastBatch = await LotesListsBatches.findOne({
    //     where: {
    //       batch_id: { [Op.ne]: null },
    //     },
    //     order: [
    //       ['batch_id', 'DESC'],
    //       ['id', 'DESC'],
    //     ],
    //   });
    //   batch_id = lastBatch?.batch_id ? Number(lastBatch.batch_id) + 1 : 1;
    // }

    const lastSubBatch = await LotesListsBatches.findOne({
      where: {
        batch_id,
      },
      order: [
        ['sub_batch_id', 'DESC'],
        ['id', 'DESC'],
      ],
    });

    sub_batch_id = lastSubBatch?.sub_batch_id
      ? Number(lastSubBatch.sub_batch_id) + 1
      : 1;
    // }

    const lotesListBatches = await LotesListsBatches.create({
      cake_id_start,
      cake_id_finish,
      batch_id,
      sub_batch_id,
      ...new_lotestList,
      quantity_cakes: quantityCakesInt,
      sand_dry,
    });

    // const lotesListCakesArray = [];
    // for (let i = cake_id_start; i <= cake_id_finish; i++) {
    //   const res = await LotesListsCakes.create({});
    //   lotesListCakesArray.push(res);
    // }

    // myEmitter.emit(ADD_NEW_LOTES_LIST_CAKES_SOCKET, lotesListCakesArray);
    myEmitter.emit(ADD_NEW_LOTES_LIST_SOCKET, lotesListBatches);
    return res.status(200).json(lotesListBatches);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: err.message });
  }
});

lotesListRouter.post('/batches/update/recipe', async (req, res) => {
  const updates = req.body;

  try {
    if (!Array.isArray(updates)) {
      return res.status(400).json({ error: 'Expected an array of updates' });
    }

    const results = [];
    for (const updateData of updates) {
      const { batch_id, sub_batch_id, cake_id_start, cake_id_finish } = updateData;

      const sand_dry = (updateData.sand_dry ?? updateData.sand_powder_dry) || '0';

      if (updateData?.updatedAt || updateData?.createdAt) {
        delete updateData.createdAt;
        delete updateData.updatedAt;
      }

      const { old_sub_batch_id = null, ...updateDataWithoutSubBatchId } = updateData;

      const updatedSubBatchId =
        old_sub_batch_id !== null ? old_sub_batch_id : sub_batch_id;

      const whereClause = { batch_id };

      if (old_sub_batch_id !== null) {
        whereClause.sub_batch_id = old_sub_batch_id;
        whereClause.cake_id_start = cake_id_start;
        whereClause.cake_id_finish = cake_id_finish;
      } else {
        whereClause.sub_batch_id = sub_batch_id;
      }

      const [count, rows] = await LotesListsBatches.update(
        { ...updateDataWithoutSubBatchId, sand_dry },
        {
          where: whereClause,
          returning: true,
        },
      );

      if (count === 0) {
        console.warn(
          `No record found for batch_id=${batch_id}, sub_batch_id=${sub_batch_id}, start=${cake_id_start}, finish=${cake_id_finish}`,
        );
        continue;
      }

      const updatedLotes = rows[0];
      results.push(updatedLotes);
      myEmitter.emit(UPDATE_LOTES_LIST_SOCKET, updatedLotes);
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'No records updated' });
    }

    return res.status(200).json(results);
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

lotesListRouter.post('/cakes', async (req, res) => {
  try {
    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: 'num must be an array of ids' });
    }

    if (
      note !== undefined &&
      (typeof note !== 'object' || Array.isArray(note) || note === null)
    ) {
      return res.status(400).json({ error: 'note must be an object' });
    }

    const result = [];

    for (const id of ids) {
      const numericId = Number(id);
      if (isNaN(numericId)) continue;

      let record = await LotesListsCakes.findByPk(numericId);
      if (record) {
        if (note && note[id] !== undefined) {
          record.note = note[id];
          await record.save();
        }
        result.push(record);
      } else {
        const created = await LotesListsCakes.create({ note: note[id] });
        result.push(created);
      }
    }

    myEmitter.emit(ADD_NEW_LOTES_LIST_CAKES_SOCKET, result);

    return res.status(200).json(result);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: err.message });
  }
});

lotesListRouter.post('/cakes/update/recipe', async (req, res) => {
  console.log('req.body loteslist.js line 292', req.body);
  const { ids, payloads } = req.body;

  const batchId = Number(ids?.batch_id);
  const subBatchId = Number(ids?.sub_batch_id);
  const start = Number(ids?.cake_id_start);
  const finish = Number(ids?.cake_id_finish);

  if (![batchId, subBatchId, start, finish].every(Number.isFinite)) {
    return res.status(400).json({ error: 'Bad ids' });
  }

  if (!payloads.length) {
    return res.status(400).json({ error: 'No payloads provided' });
  }

  const sanitize = (p) => {
    const out = { ...p };
    delete out.id;
    delete out.createdAt;
    delete out.updatedAt;
    return out;
  };

  // for (const p of payloads) {
  //   const cakeId = Number(p?.id);
  //   if (!Number.isFinite(cakeId) || cakeId < start || cakeId > finish) {
  //     return res
  //       .status(400)
  //       .json({ error: `Cake id ${p?.id} is out of range ${start}-${finish}` });
  //   }
  // }

  const t = await sequelize.transaction();
  try {
    const results = [];
    for (const p of payloads) {
      const cakeId = Number(p.id);
      const updates = sanitize(p);

      const [count, rows] = await LotesListsCakes.update(updates, {
        where: { id: cakeId },
        returning: true,
        transaction: t,
      });

      if (!count) {
        throw new Error(`Cake ${cakeId} not found`);
      }
      results.push(rows[0]);
    }

    await t.commit();

    myEmitter.emit(UPDATE_LOTES_LIST_CAKES_SOCKET, results);

    return res.status(200);
  } catch (e) {
    await t.rollback();
    return res.status(500).json({ error: e.message });
  }
});

lotesListRouter.post('/cakes/update/boolean/recipe', async (req, res) => {
  try {
    const payload = Array.isArray(req.body) ? req.body : [req.body];

    const normalized = payload
      .map((item) => ({
        cake_id: Number(item?.cake_id),
        recipe: item?.recipe,
      }))
      .filter(
        (x) =>
          Number.isFinite(x.cake_id) &&
          x.cake_id > 0 &&
          x.recipe &&
          typeof x.recipe === 'object' &&
          !Array.isArray(x.recipe),
      );

    if (normalized.length === 0) {
      return res.status(400).json({
        error:
          'Invalid payload. Expected {cake_id, recipe} or array of {cake_id, recipe}.',
      });
    }

    const updatedRows = [];

    for (const { cake_id, recipe } of normalized) {
      const [count, rows] = await LotesListsCakes.update(
        { ...recipe },
        {
          where: { id: cake_id },
          returning: true,
        },
      );

      if (count === 0) continue;

      const updatedCake = rows[0];
      updatedRows.push(updatedCake);

      myEmitter.emit(UPDATE_LOTES_LIST_CAKES_BOOLEAN_SOCKET, updatedCake);
    }

    if (updatedRows.length === 0) {
      return res.status(404).json({ error: 'No records updated' });
    }

    return res.status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: err.message });
  }
});

lotesListRouter.post('/cakes/delete', async (req, res) => {
  try {
    const { num } = req.body;

    const lastRecords = await LotesListsCakes.findAll({
      order: [['id', 'DESC']],
      limit: num,
    });

    for (const record of lastRecords) {
      await record.destroy();
    }

    const lotesListCakesArray = await LotesListsCakes.findAll();

    myEmitter.emit(DELETE_LOTES_LIST_CAKES_SOCKET, lotesListCakesArray);

    return res.status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = lotesListRouter;
