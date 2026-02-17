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
  WarehouseSandSlurry,
} = require('../db/models/index.js');
const { Sequelize } = require('sequelize');

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
  ADD_NEW_WAREHOUSE_SAND_SLURRY_SOCKET,
} = require('../src/constants/event.js');
const { ErrorUtils } = require('../utils/Errors.js');
const { Op } = require('sequelize');

const normalizeType = (t) => {
  const s = String(t || '').trim();
  return s;
};

const formatDate = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
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
  const { materials, portion_size, date } = req.body;

  if (!Array.isArray(materials) || !materials.length)
    return res.status(400).json({
      error: 'Поле materials обязательно и должно быть непустым массивом',
    });

  if (!portion_size)
    return res.status(400).json({
      error: 'Portion size is required!',
    });

  const t = await sequelize.transaction();
  try {
    const deletedIds = [];
    const shortageMaterials = [];

    const materialConsumption = materials.reduce((acc, m) => {
      const type = m.type;
      const quantity = Number(m.quantity || 0) * 1000;
      acc[type] = (acc[type] || 0) + quantity;
      return acc;
    }, {});

    const updatedMaterialTypes = Object.keys(materialConsumption);
    const updatedWarehouseRecords = [];

    // const today = new Date();
    // const day = today.getDate().toString().padStart(2, '0');
    // const month = (today.getMonth() + 1).toString().padStart(2, '0');
    // const year = today.getFullYear();
    // const date = `${day}.${month}.${year}`;

    const allRecords = await WarehouseSandSlurry.findAll({
      attributes: ['date'],
    });

    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('.');
      return new Date(`${year}-${month}-${day}`);
    };

    const latestRecord = allRecords.sort(
      (a, b) => parseDate(b.date) - parseDate(a.date),
    )[0];

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord
      ? latestRecord.date
      : formatDate(new Date());

    // Проверка наличия всех материалов перед началом операций
    for (const materialType of updatedMaterialTypes) {
      if (materialType === 'water') {
        continue;
      }
      const consumedQuantity = materialConsumption[materialType];

      const currentRecord = await RawMaterialsWarehouse.findOne({
        where: { material_type: materialType },
        transaction: t,
      });

      if (currentRecord) {
        if (currentRecord.remaining_quantity < consumedQuantity) {
          shortageMaterials.push({
            material: materialType,
            available: currentRecord.remaining_quantity,
            required: consumedQuantity,
            shortage: consumedQuantity - currentRecord.remaining_quantity,
          });
        }
      } else {
        // Если записи нет, считаем что материала 0
        shortageMaterials.push({
          material: materialType,
          available: 0,
          required: consumedQuantity,
          shortage: consumedQuantity,
        });
      }
    }

    // Если есть недостающие материалы, откатываем транзакцию и возвращаем ошибку
    if (shortageMaterials.length > 0) {
      await t.rollback();
      return res.status(400).json({
        error: 'Недостаточно материалов на складе',
        shortageDetails: shortageMaterials,
        message: `Недостаточно материалов: ${shortageMaterials
          .map((s) => `${s.material} (не хватает ${s.shortage})`)
          .join(', ')}`,
      });
    }

    for (const materialType of updatedMaterialTypes) {
      if (materialType === 'water') {
        continue;
      }
      const consumedQuantity = materialConsumption[materialType];

      const currentRecord = await RawMaterialsWarehouse.findOne({
        where: { material_type: materialType },
        transaction: t,
      });

      if (currentRecord) {
        if (currentRecord.remaining_quantity < consumedQuantity) {
          await t.rollback();
          return res.status(400).json({
            error: `Недостаточно материала "${materialType}" на складе. Доступно: ${currentRecord.remaining_quantity}, требуется: ${consumedQuantity}`,
          });
        }

        const [updatedRows] = await RawMaterialsWarehouse.update(
          {
            consumed_quantity: sequelize.literal(
              `consumed_quantity + ${consumedQuantity}`,
            ),
            remaining_quantity: sequelize.literal(
              `remaining_quantity - ${consumedQuantity}`,
            ),
            last_updated:
              parseDate(lastUpdated) - parseDate(formatDate(date)) > 0
                ? lastUpdated
                : formatDate(date),
          },
          {
            where: { material_type: materialType },
            transaction: t,
          },
        );
      } else {
        if (consumedQuantity < 0) {
          await t.rollback();
          return res.status(400).json({
            error: `Невозможно создать запись для "${materialType}" с отрицательным количеством: ${consumedQuantity}`,
          });
        }

        const newRecord = await RawMaterialsWarehouse.create(
          {
            material_type: materialType,
            consumed_quantity: consumedQuantity,
            remaining_quantity: -consumedQuantity,
            last_updated:
              parseDate(lastUpdated) - parseDate(formatDate(date)) > 0
                ? lastUpdated
                : formatDate(date),
          },
          { transaction: t },
        );
        updatedWarehouseRecords.push(newRecord);
      }
    }

    const totalAllMaterials = materials.reduce(
      (sum, m) => sum + Number(m.quantity || 0),
      0,
    );

    const sandSlurryQuantity = totalAllMaterials * portion_size * 10;

    const [updatedSandSlurryRows] = await RawMaterialsWarehouse.update(
      {
        remaining_quantity: sequelize.literal(
          `remaining_quantity + ${sandSlurryQuantity}`,
        ),
        last_updated:
          parseDate(lastUpdated) - parseDate(formatDate(date)) > 0
            ? lastUpdated
            : formatDate(date),
      },
      { where: { material_type: 'Sand slurry (dry)' }, transaction: t },
    );

    if (!updatedSandSlurryRows) {
      await RawMaterialsWarehouse.create(
        {
          material_type: 'Sand slurry (dry)',
          remaining_quantity: sandSlurryQuantity,
          last_updated:
            parseDate(lastUpdated) - parseDate(formatDate(date)) > 0
              ? lastUpdated
              : formatDate(date),
        },
        { transaction: t },
      );
    }

    // Списание из отдельных таблиц

    // for (const { type, quantity } of materials) {
    //   if (!quantity) continue;

    //   const modelMap = {
    //     "Sand (dry)": WarehouseSand,
    //     "Gypsum stone": WarehouseGypsumStone,
    //     "Grinding Balls": WarehouseGrindingBalls,
    //     AAC: WarehouseAAC,
    //   };
    //   const Model = modelMap[type];
    //   if (!Model) throw new Error(`Неизвестный тип материала: ${type}`);

    //   let leftToWriteOff = Number(quantity);

    //   console.log("leftToWriteOff start:", leftToWriteOff, "type:", type);

    //   const records = await Model.findAll({
    //     order: [
    //       [sequelize.literal("to_date(date, 'DD.MM.YYYY')"), "DESC"],
    //     ],
    //     transaction: t,
    //   });

    //   for (const rec of records) {
    //     if (leftToWriteOff <= 0) break;

    //     const inStock = Number(rec.quantity);

    //     console.log({ id: rec.id, inStock, leftToWriteOff });

    //     if (inStock <= leftToWriteOff) {
    //       deletedIds.push(rec.id);
    //       await rec.destroy({ transaction: t });
    //       leftToWriteOff -= inStock;
    //     } else {
    //       const [affectedRows] = await Model.update(
    //         { quantity: inStock - leftToWriteOff },
    //         { where: { id: rec.id }, transaction: t }
    //       );
    //       console.log(
    //         `📝 ${Model.name} id=${rec.id} affectedRows=${affectedRows}`
    //       );
    //       leftToWriteOff = 0;
    //     }
    //   }

    //   if (leftToWriteOff > 0)
    //     throw new Error(
    //       `Недостаточно остатков для списания ${type} (не хватило ${leftToWriteOff})`
    //     );
    // }

    await t.commit();

    const allUpdatedRecords = await RawMaterialsWarehouse.findAll({
      where: {
        material_type: {
          [Op.in]: [...updatedMaterialTypes, 'Sand slurry (dry)'],
        },
      },
    });

    myEmitter.emit(UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET, allUpdatedRecords);

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

rawMaterialsWarehouseRouter.post('/raw_mat_con/update', async (req, res) => {
  const { materials } = req.body;

  console.log(
    '======================= materials ======================',
    materials,
  );

  const round2 = (num) => Math.round(num * 100) / 100;

  if (!Array.isArray(materials) || materials.length === 0) {
    return res.status(400).json({
      error: 'Поле materials обязательно и должно быть непустым массивом',
    });
  }

  const normMaterials = materials
    .map((m) => {
      const qty = Number(m.quantity);

      return {
        type: normalizeType(m.type),
        quantity: round2(qty),
      };
    })
    .filter((m) => m.type && Number.isFinite(Number(m.quantity)));

  if (normMaterials.length === 0) {
    return res.status(400).json({ error: 'Нет валидных позиций для списания' });
  }

  const onlySandSlurryDry = normMaterials.every(
    (m) => m.type === 'Sand slurry (dry)',
  );

  const t = await sequelize.transaction();
  try {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    const date = `${day}.${month}.${year}`;

    const now = new Date();

    if (onlySandSlurryDry) {
      const total = round2(normMaterials.reduce((s, m) => s + m.quantity, 0));

      await RawMaterialsWarehouse.update(
        {
          consumed_quantity: sequelize.literal(
            `ROUND((consumed_quantity + ${delta})::numeric, 2)`,
          ),
          remaining_quantity: sequelize.literal(
            `ROUND((remaining_quantity - ${delta})::numeric, 2)`,
          ),

          last_updated: date,
          updatedAt: now,
        },
        { where: { material_type: 'Sand slurry (dry)' }, transaction: t },
      );

      await t.commit();

      const allUpdatedRecords = await RawMaterialsWarehouse.findAll({
        where: { material_type: { [Op.in]: ['Sand slurry (dry)'] } },
      });

      myEmitter.emit(UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET, allUpdatedRecords);

      return res.status(200).json({
        updatedRecords: allUpdatedRecords,
        deletedIds: [],
      });
    }

    const materialTotals = normMaterials.reduce((acc, m) => {
      acc[m.type] = round2((acc[m.type] || 0) + m.quantity);
      return acc;
    }, {});

    const updatedTypes = Object.keys(materialTotals);

    for (const materialType of updatedTypes) {
      const delta = materialTotals[materialType];
      console.log('delta', delta);
      if (materialType === 'Return slurry (dry)') {
        await RawMaterialsWarehouse.update(
          {
            remaining_quantity: sequelize.literal(
              `ROUND((remaining_quantity - ${delta})::numeric, 2)`,
            ),
            last_updated: date,
            updatedAt: now,
          },
          { where: { material_type: 'Return slurry (dry)' }, transaction: t },
        );
      } else {
        await RawMaterialsWarehouse.update(
          {
            consumed_quantity: sequelize.literal(
              `ROUND((consumed_quantity + ${delta})::numeric, 2)`,
            ),
            remaining_quantity: sequelize.literal(
              `ROUND((remaining_quantity - ${delta})::numeric, 2)`,
            ),

            last_updated: date,
            updatedAt: now,
          },
          { where: { material_type: materialType }, transaction: t },
        );
      }
    }

    await t.commit();

    const typesToRead = Array.from(
      new Set([...updatedTypes, 'Sand slurry (dry)', 'Return slurry (dry)']),
    );

    const allUpdatedRecords = await RawMaterialsWarehouse.findAll({
      where: { material_type: { [Op.in]: typesToRead } },
    });

    myEmitter.emit(UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET, allUpdatedRecords);

    const deletedIds = [];
    return res.status(200).json({
      updatedRecords: allUpdatedRecords,
      deletedIds,
    });
  } catch (err) {
    try {
      if (!t.finished) await t.rollback();
    } catch (rbErr) {
      console.error('Rollback failed:', rbErr);
    }
    console.error('❌ ROLLBACK /raw_mat_con/update:', err);
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
  const { supplier, type, quantity, date } = req.body;

  try {
    const warehouseSand = await WarehouseSand.create({
      supplier,
      quantity,
      type,
      date: formatDate(date),
    });

    const totalSandQuantity = await WarehouseSand.sum('quantity');

    const allRecords = await WarehouseSand.findAll({
      attributes: ['date'],
    });

    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('.');
      return new Date(`${year}-${month}-${day}`);
    };

    const latestRecord = allRecords.sort(
      (a, b) => parseDate(b.date) - parseDate(a.date),
    )[0];

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord ? latestRecord.date : new Date();

    const record = await RawMaterialsWarehouse.findOne({
      where: {
        material_type: 'Sand (dry)',
      },
    });

    await RawMaterialsWarehouse.update(
      {
        remaining_quantity: totalSandQuantity - record.consumed_quantity,
        last_updated: lastUpdated,
      },
      {
        where: {
          material_type: 'Sand (dry)',
        },
      },
    );

    myEmitter.emit(ADD_NEW_WAREHOUSE_SAND_SOCKET, warehouseSand);

    const updatedWarehouse = await RawMaterialsWarehouse.findOne({
      where: { material_type: 'Sand (dry)' },
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
        ([_, value]) => value !== undefined && value !== null,
      ),
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
  const { supplier, type, quantity, date } = req.body;

  try {
    const warehouseLime = await WarehouseLime.create({
      supplier,
      quantity,
      type,
      date: formatDate(date),
    });

    const totalLimeQuantity = await WarehouseLime.sum('quantity');

    const allRecords = await WarehouseLime.findAll({
      attributes: ['date'],
    });

    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('.');
      return new Date(`${year}-${month}-${day}`);
    };

    const latestRecord = allRecords.sort(
      (a, b) => parseDate(b.date) - parseDate(a.date),
    )[0];

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord ? latestRecord.date : new Date();

    const record = await RawMaterialsWarehouse.findOne({
      where: {
        material_type: 'Lime',
      },
    });

    await RawMaterialsWarehouse.update(
      {
        remaining_quantity: totalLimeQuantity - record.consumed_quantity,
        last_updated: lastUpdated,
      },
      {
        where: {
          material_type: 'Lime',
        },
      },
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
        ([_, value]) => value !== undefined && value !== null,
      ),
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
  const { supplier, quantity, type, date } = req.body;

  try {
    const warehouseCement = await WarehouseCement.create({
      supplier,
      quantity,
      type,
      date: formatDate(date),
    });

    const totalCementQuantity = await WarehouseCement.sum('quantity');

    const allRecords = await WarehouseCement.findAll({
      attributes: ['date'],
    });

    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('.');
      return new Date(`${year}-${month}-${day}`);
    };

    const latestRecord = allRecords.sort(
      (a, b) => parseDate(b.date) - parseDate(a.date),
    )[0];

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord ? latestRecord.date : new Date();

    const record = await RawMaterialsWarehouse.findOne({
      where: {
        material_type: 'Cement',
      },
    });

    await RawMaterialsWarehouse.update(
      {
        remaining_quantity: totalCementQuantity - record.consumed_quantity,
        last_updated: lastUpdated,
      },
      {
        where: {
          material_type: 'Cement',
        },
      },
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
        ([_, value]) => value !== undefined && value !== null,
      ),
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
  const { supplier, quantity, date } = req.body;

  try {
    const warehouseGypsum = await WarehouseGypsum.create({
      supplier,
      quantity,
      date: formatDate(date),
    });

    const totalGypsumQuantity = await WarehouseGypsum.sum('quantity');

    const allRecords = await WarehouseGypsum.findAll({
      attributes: ['date'],
    });

    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('.');
      return new Date(`${year}-${month}-${day}`);
    };

    const latestRecord = allRecords.sort(
      (a, b) => parseDate(b.date) - parseDate(a.date),
    )[0];

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord ? latestRecord.date : new Date();

    const record = await RawMaterialsWarehouse.findOne({
      where: {
        material_type: 'Gypsum (dry)',
      },
    });

    await RawMaterialsWarehouse.update(
      {
        remaining_quantity: totalGypsumQuantity - record.consumed_quantity,
        last_updated: lastUpdated,
      },
      {
        where: {
          material_type: 'Gypsum (dry)',
        },
      },
    );

    myEmitter.emit(ADD_NEW_WAREHOUSE_GYPSUM_SOCKET, warehouseGypsum);
    const updatedWarehouse = await RawMaterialsWarehouse.findOne({
      where: { material_type: 'Gypsum (dry)' },
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
        ([_, value]) => value !== undefined && value !== null,
      ),
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
  const { supplier, quantity, date } = req.body;

  try {
    const warehouseGypsumStone = await WarehouseGypsumStone.create({
      supplier,
      quantity,
      date: formatDate(date),
    });

    const totalGypsumStoneQuantity = await WarehouseGypsumStone.sum('quantity');

    const allRecords = await WarehouseGypsumStone.findAll({
      attributes: ['date'],
    });

    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('.');
      return new Date(`${year}-${month}-${day}`);
    };

    const latestRecord = allRecords.sort(
      (a, b) => parseDate(b.date) - parseDate(a.date),
    )[0];

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord ? latestRecord.date : new Date();

    const record = await RawMaterialsWarehouse.findOne({
      where: {
        material_type: 'Gypsum stone',
      },
    });

    await RawMaterialsWarehouse.update(
      {
        remaining_quantity: totalGypsumStoneQuantity - record.consumed_quantity,
        last_updated: lastUpdated,
      },
      {
        where: {
          material_type: 'Gypsum stone',
        },
      },
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
        ([_, value]) => value !== undefined && value !== null,
      ),
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

    myEmitter.emit(
      DELETE_WAREHOUSE_GYPSUM_STONE_SOCKET,
      gypsum_stone_warehouse_id,
    );
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
  const { supplier, quantity, type, date } = req.body;

  try {
    const warehouseAluminum1 = await WarehouseAluminum1.create({
      supplier,
      quantity,
      type,
      date: formatDate(date),
    });

    const totalAluminum1Quantity = await WarehouseAluminum1.sum('quantity');

    const allRecords = await WarehouseAluminum1.findAll({
      attributes: ['date'],
    });

    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('.');
      return new Date(`${year}-${month}-${day}`);
    };

    const latestRecord = allRecords.sort(
      (a, b) => parseDate(b.date) - parseDate(a.date),
    )[0];

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord ? latestRecord.date : new Date();

    const record = await RawMaterialsWarehouse.findOne({
      where: {
        material_type: 'Aluminum 1',
      },
    });

    await RawMaterialsWarehouse.update(
      {
        remaining_quantity: totalAluminum1Quantity - record.consumed_quantity,
        last_updated: lastUpdated,
      },
      {
        where: {
          material_type: 'Aluminum 1',
        },
      },
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
        ([_, value]) => value !== undefined && value !== null,
      ),
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
  const { supplier, quantity, type, date } = req.body;

  try {
    const warehouseAluminum2 = await WarehouseAluminum2.create({
      supplier,
      quantity,
      type,
      date: formatDate(date),
    });

    const totalAluminum2Quantity = await WarehouseAluminum2.sum('quantity');

    const allRecords = await WarehouseAluminum2.findAll({
      attributes: ['date'],
    });

    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('.');
      return new Date(`${year}-${month}-${day}`);
    };

    const latestRecord = allRecords.sort(
      (a, b) => parseDate(b.date) - parseDate(a.date),
    )[0];

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord ? latestRecord.date : new Date();

    const record = await RawMaterialsWarehouse.findOne({
      where: {
        material_type: 'Aluminum 2',
      },
    });

    await RawMaterialsWarehouse.update(
      {
        remaining_quantity: totalAluminum2Quantity - record.consumed_quantity,
        last_updated: lastUpdated,
      },
      {
        where: {
          material_type: 'Aluminum 2',
        },
      },
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
        ([_, value]) => value !== undefined && value !== null,
      ),
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
  const { supplier, quantity, diameter, date } = req.body;

  try {
    const warehouseGrindingBalls = await WarehouseGrindingBalls.create({
      supplier,
      quantity,
      diameter,
      date: formatDate(date),
    });

    const totalGrindingBallsQuantity = await WarehouseGrindingBalls.sum(
      'quantity',
    );

    const allRecords = await WarehouseGrindingBalls.findAll({
      attributes: ['date'],
    });

    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('.');
      return new Date(`${year}-${month}-${day}`);
    };

    const latestRecord = allRecords.sort(
      (a, b) => parseDate(b.date) - parseDate(a.date),
    )[0];

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord ? latestRecord.date : new Date();

    const record = await RawMaterialsWarehouse.findOne({
      where: {
        material_type: 'Grinding Balls',
      },
    });

    await RawMaterialsWarehouse.update(
      {
        remaining_quantity:
          totalGrindingBallsQuantity - record.consumed_quantity,
        last_updated: lastUpdated,
      },
      {
        where: {
          material_type: 'Grinding Balls',
        },
      },
    );

    myEmitter.emit(
      ADD_NEW_WAREHOUSE_GRINDING_BALLS_SOCKET,
      warehouseGrindingBalls,
    );
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
        ([_, value]) => value !== undefined && value !== null,
      ),
    );

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const warehouseGrindingBalls = await WarehouseGrindingBalls.update(
      updateData,
      {
        where: { supplier },
        returning: true,
        plain: true,
      },
    );

    myEmitter.emit(
      UPDATE_WAREHOUSE_GRINDING_BALLS_SOCKET,
      warehouseGrindingBalls,
    );
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
      grinding_balls_warehouse_id,
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
  const { supplier, quantity, date } = req.body;

  try {
    const warehouseAAC = await WarehouseAAC.create({
      supplier,
      quantity,
      date: formatDate(date),
    });

    const totalAACQuantity = await WarehouseAAC.sum('quantity');

    const allRecords = await WarehouseAAC.findAll({
      attributes: ['date'],
    });

    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('.');
      return new Date(`${year}-${month}-${day}`);
    };

    const latestRecord = allRecords.sort(
      (a, b) => parseDate(b.date) - parseDate(a.date),
    )[0];

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord ? latestRecord.date : new Date();

    const record = await RawMaterialsWarehouse.findOne({
      where: {
        material_type: 'AAC',
      },
    });

    await RawMaterialsWarehouse.update(
      {
        remaining_quantity: totalAACQuantity - record.consumed_quantity,
        last_updated: lastUpdated,
      },
      {
        where: {
          material_type: 'AAC',
        },
      },
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
        ([_, value]) => value !== undefined && value !== null,
      ),
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

// Sand Slurry
rawMaterialsWarehouseRouter.get('/sand_slurry', async (req, res) => {
  try {
    const warehouseSandSlurry = await WarehouseSandSlurry.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ warehouseSandSlurry });
  } catch (err) {
    console.error(err.message);
  }
});

rawMaterialsWarehouseRouter.post('/sand_slurry', async (req, res) => {
  const {
    sand,
    gypsum_stone,
    water,
    grinding_balls,
    aac_scrap,
    portion_size,
    date,
  } = req.body;

  try {
    const warehouseSandSlurry = await WarehouseSandSlurry.create({
      sand,
      gypsum_stone,
      water,
      grinding_balls,
      aac_scrap,
      portion_size,
      date: formatDate(date),
    });

    myEmitter.emit(ADD_NEW_WAREHOUSE_SAND_SLURRY_SOCKET, warehouseSandSlurry);
    return res.json(warehouseSandSlurry).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

module.exports = rawMaterialsWarehouseRouter;
