const rawMaterialsWarehouseRouter = require('express').Router();
const { RawMaterialsWarehouse, sequelize } = require('../db/models/index.js');
const {
  WarehouseSand,
  WarehouseLime,
  WarehouseCement,
  WarehouseGypsum,
  WarehouseGypsumStone,
  WarehouseAluminum1,
  WarehouseAluminum2,
  WarehouseGrindingBalls,
  WarehouseAAC,
} = require('../db/models/index.js');

const myEmitter = require('../src/ee.js');
const {
  UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET,
  ADD_NEW_WAREHOUSE_SAND_SOCKET,
  UPDATE_WAREHOUSE_SAND_SOCKET,
  DELETE_WAREHOUSE_SAND_SOCKET,
  ADD_NEW_WAREHOUSE_LIME_SOCKET,
  UPDATE_WAREHOUSE_LIME_SOCKET,
  DELETE_WAREHOUSE_LIME_SOCKET,
  ADD_NEW_WAREHOUSE_CEMENT_SOCKET,
  UPDATE_WAREHOUSE_CEMENT_SOCKET,
  DELETE_WAREHOUSE_CEMENT_SOCKET,
  ADD_NEW_WAREHOUSE_GYPSUM_SOCKET,
  UPDATE_WAREHOUSE_GYPSUM_SOCKET,
  DELETE_WAREHOUSE_GYPSUM_SOCKET,
  ADD_NEW_WAREHOUSE_GYPSUM_STONE_SOCKET,
  UPDATE_WAREHOUSE_GYPSUM_STONE_SOCKET,
  DELETE_WAREHOUSE_GYPSUM_STONE_SOCKET,
  ADD_NEW_WAREHOUSE_ALUMINUM1_SOCKET,
  UPDATE_WAREHOUSE_ALUMINUM1_SOCKET,
  DELETE_WAREHOUSE_ALUMINUM1_SOCKET,
  ADD_NEW_WAREHOUSE_ALUMINUM2_SOCKET,
  UPDATE_WAREHOUSE_ALUMINUM2_SOCKET,
  DELETE_WAREHOUSE_ALUMINUM2_SOCKET,
  ADD_NEW_WAREHOUSE_GRINDING_BALLS_SOCKET,
  UPDATE_WAREHOUSE_GRINDING_BALLS_SOCKET,
  DELETE_WAREHOUSE_GRINDING_BALLS_SOCKET,
  ADD_NEW_WAREHOUSE_AAC_SOCKET,
  UPDATE_WAREHOUSE_AAC_SOCKET,
  DELETE_WAREHOUSE_AAC_SOCKET,
} = require('../src/constants/event.js');
const { ErrorUtils } = require('../utils/Errors.js');
const { Op } = require('sequelize');

const normalizeType = (t) => {
  const s = String(t || '').trim();
  return s;
};

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

// rawMaterialsWarehouseRouter.post("/update", async (req, res) => {
//   const { material_type, remaining_quantity, last_updated } = req.body;

//   try {
//     const rawMaterialsWarehouse = await RawMaterialsWarehouse.update(
//       {
//         remaining_quantity,
//         last_updated,
//       },
//       {
//         where: {
//           material_type,
//         },
//         returning: true,
//         plain: true,
//       }
//     );

//     const updatedRecord = await RawMaterialsWarehouse.findOne({
//       where: { material_type },
//     });

//     myEmitter.emit(UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET, updatedRecord);
//     return res.json(updatedRecord).status(200);
//   } catch (err) {
//     console.error(err.message);
//     return res.status(500).json(err);
//   }
// });

// helpers
// const dayjs = require('dayjs');
// const customParseFormat = require('dayjs/plugin/customParseFormat');
// dayjs.extend(customParseFormat);

/*  входной массив должен выглядеть так:
{
  "materials": [
    { "type": "sand",                "quantity": 12.5 },
    { "type": "gypsum_stone",        "quantity": 8 },
    { "type": "grinding_balls",      "quantity": 3 },
    { "type": "aac",                 "quantity": 7 }
  ]
}
*/

rawMaterialsWarehouseRouter.post('/update', async (req, res) => {
  const { materials } = req.body; // массив объектов {type, quantity}

  if (!Array.isArray(materials) || !materials.length)
    return res.status(400).json({
      error: 'Поле materials обязательно и должно быть непустым массивом',
    });

  const t = await sequelize.transaction();
  try {
    const deletedIds = [];

    const materialTotals = materials.reduce((acc, m) => {
      const type = m.type;
      const quantity = Number(m.quantity || 0);
      acc[type] = (acc[type] || 0) - quantity;
      return acc;
    }, {});

    const updatedMaterialTypes = Object.keys(materialTotals);
    const updatedWarehouseRecords = [];

    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();

    const date = `${day}.${month}.${year}`;

    for (const materialType of updatedMaterialTypes) {
      const totalQuantity = materialTotals[materialType];

      const [updatedRows] = await RawMaterialsWarehouse.update(
        {
          remaining_quantity: sequelize.literal(
            `remaining_quantity + ${totalQuantity}`
          ),
          // last_updated: `${new Date()}`,
        },
        {
          where: { material_type: materialType },
          transaction: t,
        }
      );

      if (!updatedRows) {
        const newRecord = await RawMaterialsWarehouse.create(
          {
            material_type: materialType,
            remaining_quantity: totalQuantity,
            last_updated: date,
          },
          { transaction: t }
        );
        updatedWarehouseRecords.push(newRecord);
      }
    }

    const totalAllMaterials = materials.reduce(
      (sum, m) => sum + Number(m.quantity || 0),
      0
    );

    const [updatedSandSlurryRows] = await RawMaterialsWarehouse.update(
      {
        remaining_quantity: sequelize.literal(
          `remaining_quantity + ${totalAllMaterials}`
        ),
        last_updated: date,
      },
      { where: { material_type: 'Sand slurry (dry)' }, transaction: t }
    );

    if (!updatedSandSlurryRows) {
      await RawMaterialsWarehouse.create(
        {
          material_type: 'Sand slurry (dry)',
          remaining_quantity: totalAllMaterials,
          last_updated: date,
        },
        { transaction: t }
      );
    }

    for (const { type, quantity } of materials) {
      if (!quantity) continue;

      const modelMap = {
        Sand: WarehouseSand,
        'Gypsum stone': WarehouseGypsumStone,
        'Grinding Balls': WarehouseGrindingBalls,
        AAC: WarehouseAAC,
      };
      const Model = modelMap[type];
      if (!Model) throw new Error(`Неизвестный тип материала: ${type}`);

      let leftToWriteOff = Number(quantity);

      console.log('leftToWriteOff start:', leftToWriteOff, 'type:', type);

      const records = await Model.findAll({
        order: [
          // d.m.YYYY -> сортируем как строки, но в обратном порядке
          [sequelize.literal("to_date(date, 'DD.MM.YYYY')"), 'DESC'],
        ],
        transaction: t,
      });

      for (const rec of records) {
        if (leftToWriteOff <= 0) break;

        const inStock = Number(rec.quantity);

        console.log({ id: rec.id, inStock, leftToWriteOff });

        if (inStock <= leftToWriteOff) {
          deletedIds.push(rec.id);
          await rec.destroy({ transaction: t });
          leftToWriteOff -= inStock;
        } else {
          const [affectedRows] = await Model.update(
            { quantity: inStock - leftToWriteOff },
            { where: { id: rec.id }, transaction: t }
          );
          console.log(`📝 ${Model.name} id=${rec.id} affectedRows=${affectedRows}`);
          leftToWriteOff = 0;
        }
      }

      if (leftToWriteOff > 0)
        throw new Error(
          `Недостаточно остатков для списания ${type} (не хватило ${leftToWriteOff})`
        );
    }

    await t.commit();
    console.log('✅ ТРАНЗАКЦИЯ УСПЕШНО ЗАКОММИТИЛАСЬ');

    const allUpdatedRecords = await RawMaterialsWarehouse.findAll({
      where: {
        material_type: {
          [Op.in]: [...updatedMaterialTypes, 'Sand slurry (dry)'],
        },
      },
    });

    const currentSand = await WarehouseSand.findAll();
    const currentGypsumStone = await WarehouseGypsumStone.findAll();
    const currentGrindingBalls = await WarehouseGrindingBalls.findAll();
    const currentAAC = await WarehouseAAC.findAll();

    myEmitter.emit(UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET, allUpdatedRecords);

    myEmitter.emit(UPDATE_WAREHOUSE_SAND_SOCKET, currentSand);

    myEmitter.emit(UPDATE_WAREHOUSE_GYPSUM_STONE_SOCKET, currentGypsumStone);

    myEmitter.emit(UPDATE_WAREHOUSE_GRINDING_BALLS_SOCKET, currentGrindingBalls);

    myEmitter.emit(UPDATE_WAREHOUSE_AAC_SOCKET, currentAAC);

    return res.status(200).json({
      updatedRecords: allUpdatedRecords,
      deletedIds,
    });
  } catch (err) {
    console.log('❌ ОШИБКА, ROLLBACK:', err.message);
    await t.rollback();
    console.error(err.message);
    return res.status(500).json({ error: err.message });
  }
});

/** Новый маршрут: обновляет сводную + профильные склады для ВСЕХ материалов */
// rawMaterialsWarehouseRouter.post('/raw_mat_con/update', async (req, res) => {
//   const { materials } = req.body;

//   console.log(' --- /raw_mat_con/update payload --- ', materials);
//   if (!Array.isArray(materials) || materials.length === 0) {
//     return res.status(400).json({
//       error: 'Поле materials обязательно и должно быть непустым массивом',
//     });
//   }

//   // Нормализуем типы заранее
//   const normMaterials = materials.map((m) => ({
//     type: normalizeType(m.type),
//     quantity: Number(m.quantity || 0),
//   }));

//   const t = await sequelize.transaction();
//   try {
//     const now = new Date();

//     // 1) Агрегируем дельты для RawMaterialsWarehouse (минусуем остатки)
//     const materialTotals = normMaterials.reduce((acc, m) => {
//       acc[m.type] = (acc[m.type] || 0) - m.quantity;
//       return acc;
//     }, {});
//     const updatedTypes = Object.keys(materialTotals);

//     // 2) Применяем дельты к RawMaterialsWarehouse
//     for (const materialType of updatedTypes) {
//       const delta = materialTotals[materialType];

//       const [affected] = await RawMaterialsWarehouse.update(
//         {
//           remaining_quantity: sequelize.literal(`remaining_quantity + ${delta}`),
//           last_updated: `${now}`,
//         },
//         { where: { material_type: materialType }, transaction: t }
//       );

//       if (!affected) {
//         await RawMaterialsWarehouse.create(
//           {
//             material_type: materialType,
//             remaining_quantity: delta, // допускаем минус (долг), если бизнес-логика это позволяет
//             last_updated: `${now}`,
//           },
//           { transaction: t }
//         );
//       }
//     }

//     // 3) Бизнес-правило: прибавляем к «Sand slurry (dry)» сумму всех списаний
//     const totalAll = normMaterials.reduce((s, m) => s + m.quantity, 0);
//     {
//       const [affected] = await RawMaterialsWarehouse.update(
//         {
//           remaining_quantity: sequelize.literal(`remaining_quantity + ${totalAll}`),
//           last_updated: `${now}`,
//         },
//         { where: { material_type: 'Sand slurry (dry)' }, transaction: t }
//       );
//       if (!affected) {
//         await RawMaterialsWarehouse.create(
//           {
//             material_type: 'Sand slurry (dry)',
//             remaining_quantity: totalAll,
//             last_updated: `${now}`,
//           },
//           { transaction: t }
//         );
//       }
//     }

//     // 4) Списываем партии с профильных складов по «свежести»
//     const deletedIds = [];
//     for (const { type, quantity } of normMaterials) {
//       const Model = MODEL_BY_TYPE[type];
//       if (!Model) {
//         throw new Error(`Неизвестный или не поддержанный тип материала: ${type}`);
//       }
//       const { deletedIds: ids } = await writeOffBatches({
//         Model,
//         quantity,
//         transaction: t,
//       });
//       deletedIds.push(...ids);
//     }

//     // 5) Коммит транзакции
//     await t.commit();

//     // 6) Чтение актуальных данных по сводной таблице (после коммита)
//     const allUpdatedRecords = await RawMaterialsWarehouse.findAll({
//       where: { material_type: { [Op.in]: [...updatedTypes, 'Sand slurry (dry)'] } },
//     });

//     // 6.1) Собираем уникальные типы из запроса
//     const typesInPayload = Array.from(new Set(normMaterials.map((m) => m.type)));

//     // 6.2) Для каждого типа из пейлоада — выборка его записей и emit
//     await Promise.all(
//       typesInPayload.map(async (type) => {
//         const profile = PROFILE_BY_TYPE[type];
//         if (!profile) return; // (на всякий случай) — неизвестный тип пропускаем

//         const rows = await profile.Model.findAll(); // только нужная таблица
//         myEmitter.emit(profile.event, rows); // и только нужное событие
//       })
//     );

//     // 7) Эмитим сводную таблицу (всегда, т.к. она точно обновлялась)
//     myEmitter.emit(UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET, allUpdatedRecords);

//     // 8) Ответ
//     return res.status(200).json({
//       updatedRecords: allUpdatedRecords,
//       deletedIds,
//     });
//   } catch (err) {
//     await t.rollback();
//     console.error('❌ ROLLBACK /raw_mat_con/update:', err.message);
//     return res.status(500).json({ error: err.message });
//   }
// });

// Sand

rawMaterialsWarehouseRouter.post('/raw_mat_con/update', async (req, res) => {
  const { materials } = req.body;

  if (!Array.isArray(materials) || materials.length === 0) {
    return res.status(400).json({
      error: 'Поле materials обязательно и должно быть непустым массивом',
    });
  }

  // 0) Нормализуем типы заранее
  const normMaterials = materials.map((m) => ({
    type: normalizeType(m.type),
    quantity: Number(m.quantity || 0),
  }));

  // 0.1) Спец-случай: пришёл только Sand slurry (dry)
  const onlySandSlurryDry =
    normMaterials.length > 0 &&
    normMaterials.every((m) => m.type === 'Sand slurry (dry)');

  const t = await sequelize.transaction();
  try {
    const now = new Date();

    if (onlySandSlurryDry) {
      // === ТОЛЬКО Sand slurry (dry) ===
      // Просто уменьшаем остаток в RawMaterialsWarehouse и выходим.
      const total = normMaterials.reduce((s, m) => s + m.quantity, 0);
      const delta = -total; // уменьшаем остаток

      const [affected] = await RawMaterialsWarehouse.update(
        {
          remaining_quantity: sequelize.literal(`remaining_quantity + ${delta}`),
        },
        { where: { material_type: 'Sand slurry (dry)' }, transaction: t }
      );

      await t.commit();

      // Читаем только обновлённый тип и эмитим только сводную таблицу
      const allUpdatedRecords = await RawMaterialsWarehouse.findAll({
        where: { material_type: { [Op.in]: ['Sand slurry (dry)'] } },
      });

      myEmitter.emit(UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET, allUpdatedRecords);

      return res.status(200).json({
        updatedRecords: allUpdatedRecords,
        deletedIds: [], // партий не трогали
      });
    }

    // === ОБЫЧНЫЙ СЛУЧАЙ (есть другие материалы) ===

    // 1) Агрегируем дельты для RawMaterialsWarehouse (минусуем остатки)
    const materialTotals = normMaterials.reduce((acc, m) => {
      acc[m.type] = (acc[m.type] || 0) - m.quantity;
      return acc;
    }, {});
    const updatedTypes = Object.keys(materialTotals);

    // 2) Применяем дельты к RawMaterialsWarehouse
    for (const materialType of updatedTypes) {
      const delta = materialTotals[materialType];

      const [affected] = await RawMaterialsWarehouse.update(
        {
          remaining_quantity: sequelize.literal(`remaining_quantity + ${delta}`),
          last_updated: `${now}`,
        },
        { where: { material_type: materialType }, transaction: t }
      );
    }

    // 3) Бизнес-правило: прибавляем к «Sand slurry (dry)» сумму всех СПИСАНИЙ
    // (ВАЖНО: это НЕ выполняется в slurry-only ветке выше)
    const totalAll = normMaterials.reduce((s, m) => s + m.quantity, 0);
    {
      const [affected] = await RawMaterialsWarehouse.update(
        {
          remaining_quantity: sequelize.literal(`remaining_quantity + ${totalAll}`),
          last_updated: `${now}`,
        },
        { where: { material_type: 'Sand slurry (dry)' }, transaction: t }
      );
    }

    // 5) Коммит транзакции
    await t.commit();

    // 6) Чтение актуальных данных по сводной таблице (после коммита)
    const allUpdatedRecords = await RawMaterialsWarehouse.findAll({
      where: { material_type: { [Op.in]: [...updatedTypes, 'Sand slurry (dry)'] } },
    });

    // 7) Эмитим сводную таблицу (всегда)
    myEmitter.emit(UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET, allUpdatedRecords);

    // 8) Ответ
    return res.status(200).json({
      updatedRecords: allUpdatedRecords,
      deletedIds,
    });
  } catch (err) {
    await t.rollback();
    console.error('❌ ROLLBACK /raw_mat_con/update:', err.message);
    return res.status(500).json({ error: err.message });
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

    const totalSandQuantity = await WarehouseSand.sum('quantity');

    const latestRecord = await WarehouseSand.findOne({
      order: [['date', 'DESC']],
      attributes: ['date'],
    });

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord ? latestRecord.date : new Date();

    await RawMaterialsWarehouse.update(
      {
        remaining_quantity: totalSandQuantity,
        last_updated: lastUpdated,
      },
      {
        where: {
          material_type: 'Sand',
        },
      }
    );

    myEmitter.emit(ADD_NEW_WAREHOUSE_SAND_SOCKET, warehouseSand);
    const updatedWarehouse = await RawMaterialsWarehouse.findOne({
      where: { material_type: 'Sand' },
    });
    myEmitter.emit(UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET, updatedWarehouse);
    return res.json(warehouseSand).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post('/sand/update', async (req, res) => {
  const { supplier, ...updateFields } = req.body;

  try {
    if (!supplier) {
      return res.status(400).json({ message: 'Supplier is required' });
    }

    const updateData = Object.fromEntries(
      Object.entries(updateFields).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const warehouseSand = await WarehouseSand.update(updateData, {
      where: { supplier },
      returning: true,
      plain: true,
    });

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
rawMaterialsWarehouseRouter.get('/lime', async (req, res) => {
  try {
    const warehouseLime = await WarehouseLime.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ warehouseLime });
  } catch (err) {
    console.error(err.message);
  }
});

rawMaterialsWarehouseRouter.post('/lime', async (req, res) => {
  const { supplier, quantity } = req.body;

  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const year = today.getFullYear();

  const date = `${day}.${month}.${year}`;

  try {
    const warehouseLime = await WarehouseLime.create({
      supplier,
      quantity,
      date,
    });

    const totalLimeQuantity = await WarehouseLime.sum('quantity');

    const latestRecord = await WarehouseLime.findOne({
      order: [['date', 'DESC']],
      attributes: ['date'],
    });

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord ? latestRecord.date : new Date();

    await RawMaterialsWarehouse.update(
      {
        remaining_quantity: totalLimeQuantity,
        last_updated: lastUpdated,
      },
      {
        where: {
          material_type: 'Lime',
        },
      }
    );

    myEmitter.emit(ADD_NEW_WAREHOUSE_LIME_SOCKET, warehouseLime);
    const updatedWarehouse = await RawMaterialsWarehouse.findOne({
      where: { material_type: 'Lime' },
    });
    myEmitter.emit(UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET, updatedWarehouse);
    return res.json(warehouseLime).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post('/lime/update', async (req, res) => {
  const { supplier, ...updateFields } = req.body;

  try {
    if (!supplier) {
      return res.status(400).json({ message: 'Supplier is required' });
    }

    const updateData = Object.fromEntries(
      Object.entries(updateFields).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const warehouseLime = await WarehouseLime.update(updateData, {
      where: { supplier },
      returning: true,
      plain: true,
    });

    myEmitter.emit(UPDATE_WAREHOUSE_LIME_SOCKET, warehouseLime);
    return res.json(warehouseLime).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post('/lime/delete', async (req, res) => {
  const { lime_warehouse_id } = req.body;

  try {
    await WarehouseLime.destroy({ where: { id: lime_warehouse_id } });

    myEmitter.emit(DELETE_WAREHOUSE_LIME_SOCKET, lime_warehouse_id);
    return res.json(lime_warehouse_id).status(200);
  } catch (err) {
    return ErrorUtils.catchError(res, err);
  }
});

// Cement
rawMaterialsWarehouseRouter.get('/cement', async (req, res) => {
  try {
    const warehouseCement = await WarehouseCement.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ warehouseCement });
  } catch (err) {
    console.error(err.message);
  }
});

rawMaterialsWarehouseRouter.post('/cement', async (req, res) => {
  const { supplier, quantity } = req.body;

  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const year = today.getFullYear();

  const date = `${day}.${month}.${year}`;

  try {
    const warehouseCement = await WarehouseCement.create({
      supplier,
      quantity,
      date,
    });

    const totalCementQuantity = await WarehouseCement.sum('quantity');

    const latestRecord = await WarehouseCement.findOne({
      order: [['date', 'DESC']],
      attributes: ['date'],
    });

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord ? latestRecord.date : new Date();

    await RawMaterialsWarehouse.update(
      {
        remaining_quantity: totalCementQuantity,
        last_updated: lastUpdated,
      },
      {
        where: {
          material_type: 'Cement',
        },
      }
    );

    myEmitter.emit(ADD_NEW_WAREHOUSE_CEMENT_SOCKET, warehouseCement);
    const updatedWarehouse = await RawMaterialsWarehouse.findOne({
      where: { material_type: 'Cement' },
    });
    myEmitter.emit(UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET, updatedWarehouse);
    return res.json(warehouseCement).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post('/cement/update', async (req, res) => {
  const { supplier, ...updateFields } = req.body;

  try {
    if (!supplier) {
      return res.status(400).json({ message: 'Supplier is required' });
    }

    const updateData = Object.fromEntries(
      Object.entries(updateFields).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const warehouseCement = await WarehouseCement.update(updateData, {
      where: { supplier },
      returning: true,
      plain: true,
    });

    myEmitter.emit(UPDATE_WAREHOUSE_CEMENT_SOCKET, warehouseCement);
    return res.json(warehouseCement).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post('/cement/delete', async (req, res) => {
  const { cement_warehouse_id } = req.body;

  try {
    await WarehouseCement.destroy({ where: { id: cement_warehouse_id } });

    myEmitter.emit(DELETE_WAREHOUSE_CEMENT_SOCKET, cement_warehouse_id);
    return res.json(cement_warehouse_id).status(200);
  } catch (err) {
    return ErrorUtils.catchError(res, err);
  }
});

// Gypsum
rawMaterialsWarehouseRouter.get('/gypsum', async (req, res) => {
  try {
    const warehouseGypsum = await WarehouseGypsum.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ warehouseGypsum });
  } catch (err) {
    console.error(err.message);
  }
});

rawMaterialsWarehouseRouter.post('/gypsum', async (req, res) => {
  const { supplier, quantity } = req.body;

  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const year = today.getFullYear();

  const date = `${day}.${month}.${year}`;

  try {
    const warehouseGypsum = await WarehouseGypsum.create({
      supplier,
      quantity,
      date,
    });

    const totalGypsumQuantity = await WarehouseGypsum.sum('quantity');

    const latestRecord = await WarehouseGypsum.findOne({
      order: [['date', 'DESC']],
      attributes: ['date'],
    });

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord ? latestRecord.date : new Date();

    await RawMaterialsWarehouse.update(
      {
        remaining_quantity: totalGypsumQuantity,
        last_updated: lastUpdated,
      },
      {
        where: {
          material_type: 'Gypsum',
        },
      }
    );

    myEmitter.emit(ADD_NEW_WAREHOUSE_GYPSUM_SOCKET, warehouseGypsum);
    const updatedWarehouse = await RawMaterialsWarehouse.findOne({
      where: { material_type: 'Gypsum' },
    });
    myEmitter.emit(UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET, updatedWarehouse);
    return res.json(warehouseGypsum).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post('/gypsum/update', async (req, res) => {
  const { supplier, ...updateFields } = req.body;

  try {
    if (!supplier) {
      return res.status(400).json({ message: 'Supplier is required' });
    }

    const updateData = Object.fromEntries(
      Object.entries(updateFields).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const warehouseGypsum = await WarehouseGypsum.update(updateData, {
      where: { supplier },
      returning: true,
      plain: true,
    });

    myEmitter.emit(UPDATE_WAREHOUSE_GYPSUM_SOCKET, warehouseGypsum);
    return res.json(warehouseGypsum).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post('/gypsum/delete', async (req, res) => {
  const { gypsum_warehouse_id } = req.body;

  try {
    await WarehouseGypsum.destroy({ where: { id: gypsum_warehouse_id } });

    myEmitter.emit(DELETE_WAREHOUSE_GYPSUM_SOCKET, gypsum_warehouse_id);
    return res.json(gypsum_warehouse_id).status(200);
  } catch (err) {
    return ErrorUtils.catchError(res, err);
  }
});

// Gypsum stone
rawMaterialsWarehouseRouter.get('/gypsum-stone', async (req, res) => {
  try {
    const warehouseGypsumStone = await WarehouseGypsumStone.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ warehouseGypsumStone });
  } catch (err) {
    console.error(err.message);
  }
});

rawMaterialsWarehouseRouter.post('/gypsum-stone', async (req, res) => {
  const { supplier, quantity } = req.body;

  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const year = today.getFullYear();

  const date = `${day}.${month}.${year}`;

  try {
    const warehouseGypsumStone = await WarehouseGypsumStone.create({
      supplier,
      quantity,
      date,
    });

    const totalGypsumStoneQuantity = await WarehouseGypsumStone.sum('quantity');

    const latestRecord = await WarehouseGypsumStone.findOne({
      order: [['date', 'DESC']],
      attributes: ['date'],
    });

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord ? latestRecord.date : new Date();

    await RawMaterialsWarehouse.update(
      {
        remaining_quantity: totalGypsumStoneQuantity,
        last_updated: lastUpdated,
      },
      {
        where: {
          material_type: 'Gypsum stone',
        },
      }
    );

    myEmitter.emit(ADD_NEW_WAREHOUSE_GYPSUM_STONE_SOCKET, warehouseGypsumStone);
    const updatedWarehouse = await RawMaterialsWarehouse.findOne({
      where: { material_type: 'Gypsum stone' },
    });
    myEmitter.emit(UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET, updatedWarehouse);
    return res.json(warehouseGypsumStone).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post('/gypsum-stone/update', async (req, res) => {
  const { supplier, ...updateFields } = req.body;

  try {
    if (!supplier) {
      return res.status(400).json({ message: 'Supplier is required' });
    }

    const updateData = Object.fromEntries(
      Object.entries(updateFields).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const warehouseGypsumStone = await WarehouseGypsumStone.update(updateData, {
      where: { supplier },
      returning: true,
      plain: true,
    });

    myEmitter.emit(UPDATE_WAREHOUSE_GYPSUM_STONE_SOCKET, warehouseGypsumStone);
    return res.json(warehouseGypsumStone).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post('/gypsum-stone/delete', async (req, res) => {
  const { gypsum_stone_warehouse_id } = req.body;

  try {
    await WarehouseGypsumStone.destroy({
      where: { id: gypsum_stone_warehouse_id },
    });

    myEmitter.emit(DELETE_WAREHOUSE_GYPSUM_STONE_SOCKET, gypsum_stone_warehouse_id);
    return res.json(gypsum_stone_warehouse_id).status(200);
  } catch (err) {
    return ErrorUtils.catchError(res, err);
  }
});

// Aluminum1
rawMaterialsWarehouseRouter.get('/aluminum1', async (req, res) => {
  try {
    const warehouseAluminum1 = await WarehouseAluminum1.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ warehouseAluminum1 });
  } catch (err) {
    console.error(err.message);
  }
});

rawMaterialsWarehouseRouter.post('/aluminum1', async (req, res) => {
  const { supplier, quantity } = req.body;

  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const year = today.getFullYear();

  const date = `${day}.${month}.${year}`;

  try {
    const warehouseAluminum1 = await WarehouseAluminum1.create({
      supplier,
      quantity,
      date,
    });

    const totalAluminum1Quantity = await WarehouseAluminum1.sum('quantity');

    const latestRecord = await WarehouseAluminum1.findOne({
      order: [['date', 'DESC']],
      attributes: ['date'],
    });

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord ? latestRecord.date : new Date();

    await RawMaterialsWarehouse.update(
      {
        remaining_quantity: totalAluminum1Quantity,
        last_updated: lastUpdated,
      },
      {
        where: {
          material_type: 'Aluminum 1',
        },
      }
    );

    myEmitter.emit(ADD_NEW_WAREHOUSE_ALUMINUM1_SOCKET, warehouseAluminum1);
    const updatedWarehouse = await RawMaterialsWarehouse.findOne({
      where: { material_type: 'Aluminum 1' },
    });
    myEmitter.emit(UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET, updatedWarehouse);
    return res.json(warehouseAluminum1).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post('/aluminum1/update', async (req, res) => {
  const { supplier, ...updateFields } = req.body;

  try {
    if (!supplier) {
      return res.status(400).json({ message: 'Supplier is required' });
    }

    const updateData = Object.fromEntries(
      Object.entries(updateFields).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const warehouseAluminum1 = await WarehouseAluminum1.update(updateData, {
      where: { supplier },
      returning: true,
      plain: true,
    });

    myEmitter.emit(UPDATE_WAREHOUSE_ALUMINUM1_SOCKET, warehouseAluminum1);
    return res.json(warehouseAluminum1).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post('/aluminum1/delete', async (req, res) => {
  const { aluminum1_warehouse_id } = req.body;

  try {
    await WarehouseAluminum1.destroy({ where: { id: aluminum1_warehouse_id } });

    myEmitter.emit(DELETE_WAREHOUSE_ALUMINUM1_SOCKET, aluminum1_warehouse_id);
    return res.json(aluminum1_warehouse_id).status(200);
  } catch (err) {
    return ErrorUtils.catchError(res, err);
  }
});

// Aluminum2
rawMaterialsWarehouseRouter.get('/aluminum2', async (req, res) => {
  try {
    const warehouseAluminum2 = await WarehouseAluminum2.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ warehouseAluminum2 });
  } catch (err) {
    console.error(err.message);
  }
});

rawMaterialsWarehouseRouter.post('/aluminum2', async (req, res) => {
  const { supplier, quantity } = req.body;

  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const year = today.getFullYear();

  const date = `${day}.${month}.${year}`;

  try {
    const warehouseAluminum2 = await WarehouseAluminum2.create({
      supplier,
      quantity,
      date,
    });

    const totalAluminum2Quantity = await WarehouseAluminum2.sum('quantity');

    const latestRecord = await WarehouseAluminum2.findOne({
      order: [['date', 'DESC']],
      attributes: ['date'],
    });

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord ? latestRecord.date : new Date();

    await RawMaterialsWarehouse.update(
      {
        remaining_quantity: totalAluminum2Quantity,
        last_updated: lastUpdated,
      },
      {
        where: {
          material_type: 'Aluminum 2',
        },
      }
    );

    myEmitter.emit(ADD_NEW_WAREHOUSE_ALUMINUM2_SOCKET, warehouseAluminum2);
    const updatedWarehouse = await RawMaterialsWarehouse.findOne({
      where: { material_type: 'Aluminum 2' },
    });
    myEmitter.emit(UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET, updatedWarehouse);
    return res.json(warehouseAluminum2).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post('/aluminum2/update', async (req, res) => {
  const { supplier, ...updateFields } = req.body;

  try {
    if (!supplier) {
      return res.status(400).json({ message: 'Supplier is required' });
    }

    const updateData = Object.fromEntries(
      Object.entries(updateFields).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const warehouseAluminum2 = await WarehouseAluminum2.update(updateData, {
      where: { supplier },
      returning: true,
      plain: true,
    });

    myEmitter.emit(UPDATE_WAREHOUSE_ALUMINUM2_SOCKET, warehouseAluminum2);
    return res.json(warehouseAluminum2).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post('/aluminum2/delete', async (req, res) => {
  const { aluminum2_warehouse_id } = req.body;

  try {
    await WarehouseAluminum2.destroy({ where: { id: aluminum2_warehouse_id } });

    myEmitter.emit(DELETE_WAREHOUSE_ALUMINUM2_SOCKET, aluminum2_warehouse_id);
    return res.json(aluminum2_warehouse_id).status(200);
  } catch (err) {
    return ErrorUtils.catchError(res, err);
  }
});

// Grinding Balls
rawMaterialsWarehouseRouter.get('/grinding-balls', async (req, res) => {
  try {
    const warehouseGrindingBalls = await WarehouseGrindingBalls.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ warehouseGrindingBalls });
  } catch (err) {
    console.error(err.message);
  }
});

rawMaterialsWarehouseRouter.post('/grinding-balls', async (req, res) => {
  const { supplier, quantity } = req.body;

  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const year = today.getFullYear();

  const date = `${day}.${month}.${year}`;

  try {
    const warehouseGrindingBalls = await WarehouseGrindingBalls.create({
      supplier,
      quantity,
      date,
    });

    const totalGrindingBallsQuantity = await WarehouseGrindingBalls.sum('quantity');

    const latestRecord = await WarehouseGrindingBalls.findOne({
      order: [['date', 'DESC']],
      attributes: ['date'],
    });

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord ? latestRecord.date : new Date();

    await RawMaterialsWarehouse.update(
      {
        remaining_quantity: totalGrindingBallsQuantity,
        last_updated: lastUpdated,
      },
      {
        where: {
          material_type: 'Grinding Balls',
        },
      }
    );

    myEmitter.emit(ADD_NEW_WAREHOUSE_GRINDING_BALLS_SOCKET, warehouseGrindingBalls);
    const updatedWarehouse = await RawMaterialsWarehouse.findOne({
      where: { material_type: 'Grinding Balls' },
    });
    myEmitter.emit(UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET, updatedWarehouse);
    return res.json(warehouseGrindingBalls).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post('/grinding-balls/update', async (req, res) => {
  const { supplier, ...updateFields } = req.body;

  try {
    if (!supplier) {
      return res.status(400).json({ message: 'Supplier is required' });
    }

    const updateData = Object.fromEntries(
      Object.entries(updateFields).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const warehouseGrindingBalls = await WarehouseGrindingBalls.update(updateData, {
      where: { supplier },
      returning: true,
      plain: true,
    });

    myEmitter.emit(UPDATE_WAREHOUSE_GRINDING_BALLS_SOCKET, warehouseGrindingBalls);
    return res.json(warehouseGrindingBalls).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post('/grinding-balls/delete', async (req, res) => {
  const { grinding_balls_warehouse_id } = req.body;

  try {
    await WarehouseGrindingBalls.destroy({
      where: { id: grinding_balls_warehouse_id },
    });

    myEmitter.emit(
      DELETE_WAREHOUSE_GRINDING_BALLS_SOCKET,
      grinding_balls_warehouse_id
    );
    return res.json(grinding_balls_warehouse_id).status(200);
  } catch (err) {
    return ErrorUtils.catchError(res, err);
  }
});

// AAC
rawMaterialsWarehouseRouter.get('/aac', async (req, res) => {
  try {
    const warehouseAAC = await WarehouseAAC.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ warehouseAAC });
  } catch (err) {
    console.error(err.message);
  }
});

rawMaterialsWarehouseRouter.post('/aac', async (req, res) => {
  const { supplier, quantity } = req.body;

  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const year = today.getFullYear();

  const date = `${day}.${month}.${year}`;

  try {
    const warehouseAAC = await WarehouseAAC.create({
      supplier,
      quantity,
      date,
    });

    const totalAACQuantity = await WarehouseAAC.sum('quantity');

    const latestRecord = await WarehouseAAC.findOne({
      order: [['date', 'DESC']],
      attributes: ['date'],
    });

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord ? latestRecord.date : new Date();

    await RawMaterialsWarehouse.update(
      {
        remaining_quantity: totalAACQuantity,
        last_updated: lastUpdated,
      },
      {
        where: {
          material_type: 'AAC',
        },
      }
    );

    myEmitter.emit(ADD_NEW_WAREHOUSE_AAC_SOCKET, warehouseAAC);
    const updatedWarehouse = await RawMaterialsWarehouse.findOne({
      where: { material_type: 'AAC' },
    });
    myEmitter.emit(UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET, updatedWarehouse);
    return res.json(warehouseAAC).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post('/aac/update', async (req, res) => {
  const { supplier, ...updateFields } = req.body;

  try {
    if (!supplier) {
      return res.status(400).json({ message: 'Supplier is required' });
    }

    const updateData = Object.fromEntries(
      Object.entries(updateFields).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const warehouseAAC = await WarehouseAAC.update(updateData, {
      where: { supplier },
      returning: true,
      plain: true,
    });

    myEmitter.emit(UPDATE_WAREHOUSE_AAC_SOCKET, warehouseAAC);
    return res.json(warehouseAAC).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post('/aac/delete', async (req, res) => {
  const { aac_warehouse_id } = req.body;

  try {
    await WarehouseAAC.destroy({ where: { id: aac_warehouse_id } });

    myEmitter.emit(DELETE_WAREHOUSE_AAC_SOCKET, aac_warehouse_id);
    return res.json(aac_warehouse_id).status(200);
  } catch (err) {
    return ErrorUtils.catchError(res, err);
  }
});

module.exports = rawMaterialsWarehouseRouter;
