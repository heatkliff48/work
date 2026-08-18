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
  WarehousePallet,
  WarehousePlastic,
  WarehouseSandPowder,
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
  ADD_NEW_WAREHOUSE_PALLETS_SOCKET,
  UPDATE_WAREHOUSE_PALLETS_SOCKET,
  DELETE_WAREHOUSE_PALLETS_SOCKET,
  ADD_NEW_WAREHOUSE_PLASTICS_SOCKET,
  UPDATE_WAREHOUSE_PLASTICS_SOCKET,
  DELETE_WAREHOUSE_PLASTICS_SOCKET,
  ADD_NEW_WAREHOUSE_SAND_POWDER_SOCKET,
  UPDATE_WAREHOUSE_SAND_POWDER_SOCKET,
  DELETE_WAREHOUSE_SAND_POWDER_SOCKET,
  UPDATE_WAREHOUSE_SAND_SLURRY_SOCKET,
  UPDATE_RAW_MATERIALS_WAREHOUSE_STATUS_SOCKET,
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
  const { materials, date } = req.body;

  if (!Array.isArray(materials) || !materials.length)
    return res.status(400).json({
      error: 'The materials field is required and must be a non-empty array.',
    });

  const t = await sequelize.transaction();
  try {
    const deletedIds = [];
    const shortageMaterials = [];

    const materialConsumption = materials.reduce((acc, m) => {
      const type = m.type;
      const quantity = Number(m.quantity || 0);
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

    const latestRecord = allRecords
      .filter((record) => record.date != null)
      .sort((a, b) => parseDate(b.date) - parseDate(a.date))[0];

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord ? latestRecord.date : formatDate(new Date());

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
        error: 'There are not enough materials in the warehouse',
        shortageDetails: shortageMaterials,
        message: `Not enough materials: ${shortageMaterials
          .map((s) => `${s.material} (missing ${s.shortage})`)
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
            error: `There is not enough "${materialType}" material in stock. Available: ${currentRecord.remaining_quantity}, required: ${consumedQuantity}`,
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
            error: `It is not possible to create an entry for "${materialType}" with a negative quantity: ${consumedQuantity}`,
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

    const sandSlurryQuantity = totalAllMaterials;

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
    console.log('❌ ERROR, ROLLBACK:', err.message);
    await t.rollback();
    console.error(err.message);
    return res.status(500).json({ error: err.message });
  }
});

rawMaterialsWarehouseRouter.post('/raw_mat_con/update', async (req, res) => {
  const { materials } = req.body;

  const round2 = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;

  const createRequestError = (
    status,
    code,
    message,
    shortageDetails = undefined,
  ) => {
    const error = new Error(message);

    error.status = status;
    error.code = code;
    error.shortageDetails = shortageDetails;

    return error;
  };

  if (!Array.isArray(materials) || materials.length === 0) {
    return res.status(400).json({
      error: 'INVALID_MATERIALS',
      message: 'The materials field is required and must be a non-empty array.',
    });
  }

  const normMaterials = materials
    .map((material) => {
      const quantity = Number(material?.quantity);

      return {
        type: normalizeType(material?.type),
        quantity: Number.isFinite(quantity) ? round2(quantity) : NaN,
      };
    })
    .filter(
      (material) =>
        material.type &&
        Number.isFinite(material.quantity) &&
        material.quantity !== 0,
    );

  if (normMaterials.length === 0) {
    return res.status(400).json({
      error: 'NO_VALID_MATERIALS',
      message: 'There are no valid materials to write off.',
    });
  }

  const invalidNegativeMaterial = normMaterials.find(
    (material) => material.quantity < 0 && material.type !== 'Return slurry (dry)',
  );

  if (invalidNegativeMaterial) {
    return res.status(400).json({
      error: 'INVALID_MATERIAL_QUANTITY',
      message:
        `Negative quantity is not allowed for ` +
        `"${invalidNegativeMaterial.type}".`,
    });
  }

  const materialTotals = normMaterials.reduce((result, material) => {
    result[material.type] = round2((result[material.type] || 0) + material.quantity);

    return result;
  }, {});

  for (const type of Object.keys(materialTotals)) {
    if (materialTotals[type] === 0) {
      delete materialTotals[type];
    }
  }

  const updatedTypes = Object.keys(materialTotals);

  if (updatedTypes.length === 0) {
    return res.status(400).json({
      error: 'ZERO_MATERIAL_CONSUMPTION',
      message: 'The total material consumption is zero.',
    });
  }

  try {
    const transactionResult = await sequelize.transaction(async (transaction) => {
      const now = new Date();

      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();

      const currentDate = `${day}.${month}.${year}`;

      const aluminumTypes = updatedTypes
        .filter((type) => type.startsWith('Aluminum|'))
        .sort();

      const regularTypes = updatedTypes
        .filter((type) => !type.startsWith('Aluminum|'))
        .sort();

      const summaryTypesToLock = [
        ...regularTypes,
        ...(aluminumTypes.length > 0 ? ['Aluminum'] : []),
      ].sort();

      const warehouseRecords = await RawMaterialsWarehouse.findAll({
        where: {
          material_type: {
            [Op.in]: summaryTypesToLock,
          },
        },
        order: [['material_type', 'ASC']],
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      const warehouseByType = new Map(
        warehouseRecords.map((record) => [
          normalizeType(record.material_type),
          record,
        ]),
      );

      const shortageDetails = [];

      for (const materialType of regularTypes) {
        const required = round2(materialTotals[materialType]);
        const record = warehouseByType.get(materialType);

        if (!record) {
          shortageDetails.push({
            material: materialType,
            available: 0,
            required,
            shortage: required > 0 ? required : 0,
            reason: 'Material is not configured in the warehouse.',
          });

          continue;
        }

        const available = round2(Number(record.remaining_quantity) || 0);

        if (required > 0 && available < required) {
          shortageDetails.push({
            material: materialType,
            available,
            required,
            shortage: round2(required - available),
          });
        }
      }

      const aluminumRecordsByType = new Map();

      for (const aluminumType of aluminumTypes) {
        const [, rawSubtype] = aluminumType.split('|');
        const subtype = normalizeType(rawSubtype);
        const required = round2(materialTotals[aluminumType]);

        if (!subtype) {
          throw createRequestError(
            400,
            'INVALID_ALUMINUM_TYPE',
            `Aluminum subtype is not specified for "${aluminumType}".`,
          );
        }

        if (required <= 0) {
          throw createRequestError(
            400,
            'INVALID_ALUMINUM_QUANTITY',
            `Aluminum quantity must be greater than zero for "${subtype}".`,
          );
        }

        const records = await WarehouseAluminum1.findAll({
          where: { type: subtype },
          order: [
            [sequelize.literal(`to_date("date", 'DD.MM.YYYY')`), 'ASC'],
            ['id', 'ASC'],
          ],
          transaction,
          lock: transaction.LOCK.UPDATE,
        });

        aluminumRecordsByType.set(aluminumType, records);

        const available = round2(
          records.reduce((total, record) => {
            const quantity = Number(record.quantity) || 0;
            const consumed = Number(record.consumed_quantity) || 0;

            return total + Math.max(0, quantity - consumed);
          }, 0),
        );

        if (available < required) {
          shortageDetails.push({
            material: aluminumType,
            subtype,
            available,
            required,
            shortage: round2(required - available),
          });
        }
      }

      if (shortageDetails.length > 0) {
        throw createRequestError(
          409,
          'INSUFFICIENT_STOCK',
          'There are not enough materials in the warehouse.',
          shortageDetails,
        );
      }

      for (const materialType of regularTypes) {
        const delta = round2(materialTotals[materialType]);
        const record = warehouseByType.get(materialType);

        const currentRemaining = round2(Number(record.remaining_quantity) || 0);

        const newRemaining = round2(currentRemaining - delta);

        if (newRemaining < 0) {
          throw createRequestError(
            409,
            'INSUFFICIENT_STOCK',
            `There is not enough "${materialType}" in the warehouse.`,
            [
              {
                material: materialType,
                available: currentRemaining,
                required: delta,
                shortage: round2(delta - currentRemaining),
              },
            ],
          );
        }

        if (materialType === 'Return slurry (dry)') {
          await record.update(
            {
              remaining_quantity: newRemaining,
              last_updated: currentDate,
              updatedAt: now,
            },
            { transaction },
          );
        } else {
          const currentConsumed = round2(Number(record.consumed_quantity) || 0);

          await record.update(
            {
              consumed_quantity: round2(currentConsumed + delta),
              remaining_quantity: newRemaining,
              last_updated: currentDate,
              updatedAt: now,
            },
            { transaction },
          );
        }
      }

      let totalAluminumSpent = 0;

      for (const aluminumType of aluminumTypes) {
        const required = round2(materialTotals[aluminumType]);
        const records = aluminumRecordsByType.get(aluminumType) || [];

        let remainingToWriteOff = required;

        for (const record of records) {
          if (remainingToWriteOff <= 0) {
            break;
          }

          const quantity = round2(Number(record.quantity) || 0);
          const consumed = round2(Number(record.consumed_quantity) || 0);

          const available = round2(Math.max(0, quantity - consumed));

          if (available <= 0) {
            continue;
          }

          const quantityToWriteOff = round2(
            Math.min(available, remainingToWriteOff),
          );

          await record.update(
            {
              consumed_quantity: round2(consumed + quantityToWriteOff),
            },
            { transaction },
          );

          remainingToWriteOff = round2(remainingToWriteOff - quantityToWriteOff);
        }

        if (remainingToWriteOff > 0.001) {
          const [, subtype] = aluminumType.split('|');

          throw createRequestError(
            409,
            'INSUFFICIENT_STOCK',
            `There is not enough aluminum subtype "${subtype}".`,
            [
              {
                material: aluminumType,
                subtype,
                required,
                shortage: remainingToWriteOff,
              },
            ],
          );
        }

        totalAluminumSpent = round2(totalAluminumSpent + required);
      }

      if (totalAluminumSpent > 0) {
        const aluminumSummaryRecord = warehouseByType.get('Aluminum');

        if (!aluminumSummaryRecord) {
          throw createRequestError(
            409,
            'ALUMINUM_WAREHOUSE_NOT_CONFIGURED',
            'The general Aluminum record is missing from the warehouse.',
          );
        }

        const totalAluminumQuantity =
          Number(
            await WarehouseAluminum1.sum('quantity', {
              transaction,
            }),
          ) || 0;

        const totalAluminumConsumed =
          Number(
            await WarehouseAluminum1.sum('consumed_quantity', {
              transaction,
            }),
          ) || 0;

        const totalAluminumAvailable = round2(
          totalAluminumQuantity - totalAluminumConsumed,
        );

        const previousConsumed = round2(
          Number(aluminumSummaryRecord.consumed_quantity) || 0,
        );

        await aluminumSummaryRecord.update(
          {
            remaining_quantity: totalAluminumAvailable,
            consumed_quantity: round2(previousConsumed + totalAluminumSpent),
            last_updated: currentDate,
            updatedAt: now,
          },
          { transaction },
        );
      }

      const typesToRead = [
        ...regularTypes,
        ...(totalAluminumSpent > 0 ? ['Aluminum'] : []),
      ].sort();

      const updatedRecords = await RawMaterialsWarehouse.findAll({
        where: {
          material_type: {
            [Op.in]: typesToRead,
          },
        },
        order: [['id', 'ASC']],
        transaction,
      });

      return {
        updatedRecords: updatedRecords.map((record) => record.toJSON()),
        deletedIds: [],
      };
    });

    myEmitter.emit(
      UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET,
      transactionResult.updatedRecords,
    );

    return res.status(200).json(transactionResult);
  } catch (err) {
    const status = Number(err.status) || 500;

    if (status >= 500) {
      console.error('POST /raw_mat_con/update failed:', err);
    } else {
      console.warn('POST /raw_mat_con/update rejected:', err.message);
    }

    const response = {
      error: err.code || 'RAW_MATERIAL_WRITE_OFF_FAILED',
      message: err.message || 'Failed to write off raw materials.',
    };

    if (Array.isArray(err.shortageDetails)) {
      response.shortageDetails = err.shortageDetails;
    }

    return res.status(status).json(response);
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

    const latestRecord = allRecords
      .filter((record) => record.date != null)
      .sort((a, b) => parseDate(b.date) - parseDate(a.date))[0];

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
  const { id, file_name, supplier, ...updateFields } = req.body;

  try {
    if (!file_name) {
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
    } else {
      if (file_name != '-1') {
        const warehouseSand = await WarehouseSand.update(
          { file_name },
          {
            where: { id },
            returning: true,
            plain: true,
          },
        );
        myEmitter.emit(UPDATE_WAREHOUSE_SAND_SOCKET, warehouseSand);
        return res.json(warehouseSand).status(200);
      } else {
        const warehouseSand = await WarehouseSand.update(
          { file_name: null },
          {
            where: { id },
            returning: true,
            plain: true,
          },
        );
        myEmitter.emit(UPDATE_WAREHOUSE_SAND_SOCKET, warehouseSand);
        return res.json(warehouseSand).status(200);
      }
    }
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

    const latestRecord = allRecords
      .filter((record) => record.date != null)
      .sort((a, b) => parseDate(b.date) - parseDate(a.date))[0];

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
  const { id, file_name, supplier, ...updateFields } = req.body;

  try {
    if (!file_name) {
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
    } else {
      if (file_name != '-1') {
        const warehouseLime = await WarehouseLime.update(
          { file_name },
          {
            where: { id },
            returning: true,
            plain: true,
          },
        );
        myEmitter.emit(UPDATE_WAREHOUSE_LIME_SOCKET, warehouseLime);
        return res.json(warehouseLime).status(200);
      } else {
        const warehouseLime = await WarehouseLime.update(
          { file_name: null },
          {
            where: { id },
            returning: true,
            plain: true,
          },
        );
        myEmitter.emit(UPDATE_WAREHOUSE_LIME_SOCKET, warehouseLime);
        return res.json(warehouseLime).status(200);
      }
    }
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

    const latestRecord = allRecords
      .filter((record) => record.date != null)
      .sort((a, b) => parseDate(b.date) - parseDate(a.date))[0];

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
  const { id, file_name, supplier, ...updateFields } = req.body;

  try {
    if (!file_name) {
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
    } else {
      if (file_name != '-1') {
        const warehouseCement = await WarehouseCement.update(
          { file_name },
          {
            where: { id },
            returning: true,
            plain: true,
          },
        );
        myEmitter.emit(UPDATE_WAREHOUSE_CEMENT_SOCKET, warehouseCement);
        return res.json(warehouseCement).status(200);
      } else {
        const warehouseCement = await WarehouseCement.update(
          { file_name: null },
          {
            where: { id },
            returning: true,
            plain: true,
          },
        );
        myEmitter.emit(UPDATE_WAREHOUSE_CEMENT_SOCKET, warehouseCement);
        return res.json(warehouseCement).status(200);
      }
    }
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

    const latestRecord = allRecords
      .filter((record) => record.date != null)
      .sort((a, b) => parseDate(b.date) - parseDate(a.date))[0];

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
  const { id, file_name, supplier, ...updateFields } = req.body;

  try {
    if (!file_name) {
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
    } else {
      if (file_name != '-1') {
        const warehouseGypsum = await WarehouseGypsum.update(
          { file_name },
          {
            where: { id },
            returning: true,
            plain: true,
          },
        );
        myEmitter.emit(UPDATE_WAREHOUSE_GYPSUM_SOCKET, warehouseGypsum);
        return res.json(warehouseGypsum).status(200);
      } else {
        const warehouseGypsum = await WarehouseGypsum.update(
          { file_name: null },
          {
            where: { id },
            returning: true,
            plain: true,
          },
        );
        myEmitter.emit(UPDATE_WAREHOUSE_GYPSUM_SOCKET, warehouseGypsum);
        return res.json(warehouseGypsum).status(200);
      }
    }
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

    const latestRecord = allRecords
      .filter((record) => record.date != null)
      .sort((a, b) => parseDate(b.date) - parseDate(a.date))[0];

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
  const { id, file_name, supplier, ...updateFields } = req.body;

  try {
    if (!file_name) {
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
    } else {
      if (file_name != '-1') {
        const warehouseGypsumStone = await WarehouseGypsumStone.update(
          { file_name },
          {
            where: { id },
            returning: true,
            plain: true,
          },
        );
        myEmitter.emit(UPDATE_WAREHOUSE_GYPSUM_STONE_SOCKET, warehouseGypsumStone);
        return res.json(warehouseGypsumStone).status(200);
      } else {
        const warehouseGypsumStone = await WarehouseGypsumStone.update(
          { file_name: null },
          {
            where: { id },
            returning: true,
            plain: true,
          },
        );
        myEmitter.emit(UPDATE_WAREHOUSE_GYPSUM_STONE_SOCKET, warehouseGypsumStone);
        return res.json(warehouseGypsumStone).status(200);
      }
    }
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
  const { supplier, quantity, type, date } = req.body;

  try {
    const warehouseAluminum1 = await WarehouseAluminum1.create({
      supplier,
      quantity,
      consumed_quantity: 0,
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

    const latestRecord = allRecords
      .filter((record) => record.date != null)
      .sort((a, b) => parseDate(b.date) - parseDate(a.date))[0];

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord ? latestRecord.date : new Date();

    const record = await RawMaterialsWarehouse.findOne({
      where: {
        material_type: 'Aluminum',
      },
    });

    await RawMaterialsWarehouse.update(
      {
        remaining_quantity: totalAluminum1Quantity - record.consumed_quantity,
        last_updated: lastUpdated,
      },
      {
        where: {
          material_type: 'Aluminum',
        },
      },
    );

    myEmitter.emit(ADD_NEW_WAREHOUSE_ALUMINUM1_SOCKET, warehouseAluminum1);
    const updatedWarehouse = await RawMaterialsWarehouse.findOne({
      where: { material_type: 'Aluminum' },
    });
    myEmitter.emit(UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET, updatedWarehouse);
    return res.json(warehouseAluminum1).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post('/aluminum1/update', async (req, res) => {
  const { id, file_name, supplier, ...updateFields } = req.body;

  try {
    if (!file_name) {
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
    } else {
      if (file_name != '-1') {
        const warehouseAluminum1 = await WarehouseAluminum1.update(
          { file_name },
          {
            where: { id },
            returning: true,
            plain: true,
          },
        );
        myEmitter.emit(UPDATE_WAREHOUSE_ALUMINUM1_SOCKET, warehouseAluminum1);
        return res.json(warehouseAluminum1).status(200);
      } else {
        const warehouseAluminum1 = await WarehouseAluminum1.update(
          { file_name: null },
          {
            where: { id },
            returning: true,
            plain: true,
          },
        );
        myEmitter.emit(UPDATE_WAREHOUSE_ALUMINUM1_SOCKET, warehouseAluminum1);
        return res.json(warehouseAluminum1).status(200);
      }
    }
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

    const latestRecord = allRecords
      .filter((record) => record.date != null)
      .sort((a, b) => parseDate(b.date) - parseDate(a.date))[0];

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
  const { id, file_name, supplier, ...updateFields } = req.body;

  try {
    if (!file_name) {
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
    } else {
      if (file_name != '-1') {
        const warehouseAluminum2 = await WarehouseAluminum2.update(
          { file_name },
          {
            where: { id },
            returning: true,
            plain: true,
          },
        );
        myEmitter.emit(UPDATE_WAREHOUSE_ALUMINUM2_SOCKET, warehouseAluminum2);
        return res.json(warehouseAluminum2).status(200);
      } else {
        const warehouseAluminum2 = await WarehouseAluminum2.update(
          { file_name: null },
          {
            where: { id },
            returning: true,
            plain: true,
          },
        );
        myEmitter.emit(UPDATE_WAREHOUSE_ALUMINUM2_SOCKET, warehouseAluminum2);
        return res.json(warehouseAluminum2).status(200);
      }
    }
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

    const totalGrindingBallsQuantity = await WarehouseGrindingBalls.sum('quantity');

    const allRecords = await WarehouseGrindingBalls.findAll({
      attributes: ['date'],
    });

    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('.');
      return new Date(`${year}-${month}-${day}`);
    };

    const latestRecord = allRecords
      .filter((record) => record.date != null)
      .sort((a, b) => parseDate(b.date) - parseDate(a.date))[0];

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord ? latestRecord.date : new Date();

    const record = await RawMaterialsWarehouse.findOne({
      where: {
        material_type: 'Grinding Balls',
      },
    });

    await RawMaterialsWarehouse.update(
      {
        remaining_quantity: totalGrindingBallsQuantity - record.consumed_quantity,
        last_updated: lastUpdated,
      },
      {
        where: {
          material_type: 'Grinding Balls',
        },
      },
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
  const { id, file_name, supplier, ...updateFields } = req.body;

  try {
    if (!file_name) {
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

      myEmitter.emit(UPDATE_WAREHOUSE_GRINDING_BALLS_SOCKET, warehouseGrindingBalls);
      return res.json(warehouseGrindingBalls).status(200);
    } else {
      if (file_name != '-1') {
        const warehouseGrindingBalls = await WarehouseGrindingBalls.update(
          { file_name },
          {
            where: { id },
            returning: true,
            plain: true,
          },
        );
        myEmitter.emit(
          UPDATE_WAREHOUSE_GRINDING_BALLS_SOCKET,
          warehouseGrindingBalls,
        );
        return res.json(warehouseGrindingBalls).status(200);
      } else {
        const warehouseGrindingBalls = await WarehouseGrindingBalls.update(
          { file_name: null },
          {
            where: { id },
            returning: true,
            plain: true,
          },
        );
        myEmitter.emit(
          UPDATE_WAREHOUSE_GRINDING_BALLS_SOCKET,
          warehouseGrindingBalls,
        );
        return res.json(warehouseGrindingBalls).status(200);
      }
    }
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

    const latestRecord = allRecords
      .filter((record) => record.date != null)
      .sort((a, b) => parseDate(b.date) - parseDate(a.date))[0];

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
  const { id, file_name, supplier, ...updateFields } = req.body;

  try {
    if (!file_name) {
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
    } else {
      if (file_name != '-1') {
        const warehouseAAC = await WarehouseAAC.update(
          { file_name },
          {
            where: { id },
            returning: true,
            plain: true,
          },
        );
        myEmitter.emit(UPDATE_WAREHOUSE_AAC_SOCKET, warehouseAAC);
        return res.json(warehouseAAC).status(200);
      } else {
        const warehouseAAC = await WarehouseAAC.update(
          { file_name: null },
          {
            where: { id },
            returning: true,
            plain: true,
          },
        );
        myEmitter.emit(UPDATE_WAREHOUSE_AAC_SOCKET, warehouseAAC);
        return res.json(warehouseAAC).status(200);
      }
    }
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
  const { sand, gypsum_stone, water, grinding_balls, aac_scrap, date, isNeedCheck } =
    req.body;

  try {
    const materialsToCheck = [
      { model: WarehouseSand, amount: sand, material_type: 'Sand (dry)' },
      {
        model: WarehouseGypsumStone,
        amount: gypsum_stone,
        material_type: 'Gypsum stone',
      },
      {
        model: WarehouseGrindingBalls,
        amount: grinding_balls,
        material_type: 'Grinding Balls',
      },
      { model: WarehouseAAC, amount: aac_scrap, material_type: 'AAC' },
    ];

    const insufficientMaterials = [];

    for (const material of materialsToCheck) {
      if (material.amount > 0) {
        // const availableMaterial = await material.model.findOne({
        //   order: [['createdAt', 'DESC']],
        // });

        const availableMaterial = await RawMaterialsWarehouse.findOne({
          where: { material_type: material.material_type },
        });

        if (!availableMaterial || availableMaterial.quantity < material.amount) {
          insufficientMaterials.push({
            material: material.material_type,
            requested: material.amount,
            available: availableMaterial ? availableMaterial.remaining_quantity : 0,
          });
        }
      }
    }

    if (insufficientMaterials.length > 0) {
      return res.status(400).json({
        error: 'Insufficient materials',
        details: insufficientMaterials,
      });
    }

    const warehouseSandSlurry = await WarehouseSandSlurry.create({
      sand,
      gypsum_stone,
      water,
      grinding_balls,
      aac_scrap,
      date: formatDate(date),
      isNeedCheck,
    });

    myEmitter.emit(ADD_NEW_WAREHOUSE_SAND_SLURRY_SOCKET, warehouseSandSlurry);
    return res.json(warehouseSandSlurry).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post('/sand_slurry/update', async (req, res) => {
  const { id, file_name, portion_size, isNeedCheck = true } = req.body;

  try {
    if (!file_name) {
      const warehouseSandSlurry = await WarehouseSandSlurry.update(
        { portion_size, isNeedCheck },
        {
          where: { id },
          returning: true,
          plain: true,
        },
      );
      myEmitter.emit(UPDATE_WAREHOUSE_SAND_SLURRY_SOCKET, warehouseSandSlurry);
      return res.json(warehouseSandSlurry).status(200);
    } else {
      if (file_name != '-1') {
        const warehouseSandSlurry = await WarehouseSandSlurry.update(
          { file_name },
          {
            where: { id },
            returning: true,
            plain: true,
          },
        );
        myEmitter.emit(UPDATE_WAREHOUSE_SAND_SLURRY_SOCKET, warehouseSandSlurry);
        return res.json(warehouseSandSlurry).status(200);
      } else {
        const warehouseSandSlurry = await WarehouseSandSlurry.update(
          { file_name: null },
          {
            where: { id },
            returning: true,
            plain: true,
          },
        );
        myEmitter.emit(UPDATE_WAREHOUSE_SAND_SLURRY_SOCKET, warehouseSandSlurry);
        return res.json(warehouseSandSlurry).status(200);
      }
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

// Pallets

rawMaterialsWarehouseRouter.get('/pallets', async (req, res) => {
  try {
    const warehousePallets = await WarehousePallet.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ warehousePallets });
  } catch (err) {
    console.error(err.message);
  }
});

rawMaterialsWarehouseRouter.post('/pallets', async (req, res) => {
  const { supplier, quantity, date } = req.body;

  try {
    const warehousePallets = await WarehousePallet.create({
      supplier,
      quantity,
      date: formatDate(date),
    });

    const totalPalletsQuantity = await WarehousePallet.sum('quantity');

    const allRecords = await WarehousePallet.findAll({
      attributes: ['date'],
    });

    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('.');
      return new Date(`${year}-${month}-${day}`);
    };

    const latestRecord = allRecords
      .filter((record) => record.date != null)
      .sort((a, b) => parseDate(b.date) - parseDate(a.date))[0];

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord ? latestRecord.date : new Date();

    const record = await RawMaterialsWarehouse.findOne({
      where: {
        material_type: 'Pallets',
      },
    });

    await RawMaterialsWarehouse.update(
      {
        remaining_quantity: totalPalletsQuantity - record.consumed_quantity,
        last_updated: lastUpdated,
      },
      {
        where: {
          material_type: 'Pallets',
        },
      },
    );

    myEmitter.emit(ADD_NEW_WAREHOUSE_PALLETS_SOCKET, warehousePallets);
    const updatedWarehouse = await RawMaterialsWarehouse.findOne({
      where: { material_type: 'Pallets' },
    });
    myEmitter.emit(UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET, updatedWarehouse);
    return res.json(warehousePallets).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post('/pallets/update', async (req, res) => {
  const { id, file_name, supplier, ...updateFields } = req.body;

  try {
    if (!file_name) {
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

      const warehousePallets = await WarehousePallet.update(updateData, {
        where: { supplier },
        returning: true,
        plain: true,
      });

      myEmitter.emit(UPDATE_WAREHOUSE_PALLETS_SOCKET, warehousePallets);
      return res.json(warehousePallets).status(200);
    } else {
      if (file_name != '-1') {
        const warehousePallets = await WarehousePallet.update(
          { file_name },
          {
            where: { id },
            returning: true,
            plain: true,
          },
        );
        myEmitter.emit(UPDATE_WAREHOUSE_PALLETS_SOCKET, warehousePallets);
        return res.json(warehousePallets).status(200);
      } else {
        const warehousePallets = await WarehousePallet.update(
          { file_name: null },
          {
            where: { id },
            returning: true,
            plain: true,
          },
        );
        myEmitter.emit(UPDATE_WAREHOUSE_PALLETS_SOCKET, warehousePallets);
        return res.json(warehousePallets).status(200);
      }
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post('/pallets/delete', async (req, res) => {
  const { pallets_warehouse_id } = req.body;

  try {
    await WarehouseAAC.destroy({ where: { id: pallets_warehouse_id } });

    myEmitter.emit(DELETE_WAREHOUSE_PALLETS_SOCKET, pallets_warehouse_id);
    return res.json(pallets_warehouse_id).status(200);
  } catch (err) {
    return ErrorUtils.catchError(res, err);
  }
});

// Plastics

rawMaterialsWarehouseRouter.get('/plastics', async (req, res) => {
  try {
    const warehousePlastics = await WarehousePlastic.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ warehousePlastics });
  } catch (err) {
    console.error(err.message);
  }
});

rawMaterialsWarehouseRouter.post('/plastics', async (req, res) => {
  const { supplier, quantity, date } = req.body;

  try {
    const warehousePlastics = await WarehousePlastic.create({
      supplier,
      quantity,
      date: formatDate(date),
    });

    const totalPlasticsQuantity = await WarehousePlastic.sum('quantity');

    const allRecords = await WarehousePlastic.findAll({
      attributes: ['date'],
    });

    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('.');
      return new Date(`${year}-${month}-${day}`);
    };

    const latestRecord = allRecords
      .filter((record) => record.date != null)
      .sort((a, b) => parseDate(b.date) - parseDate(a.date))[0];

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord ? latestRecord.date : new Date();

    const record = await RawMaterialsWarehouse.findOne({
      where: {
        material_type: 'Plastics',
      },
    });

    await RawMaterialsWarehouse.update(
      {
        remaining_quantity: totalPlasticsQuantity - record.consumed_quantity,
        last_updated: lastUpdated,
      },
      {
        where: {
          material_type: 'Plastics',
        },
      },
    );

    myEmitter.emit(ADD_NEW_WAREHOUSE_PLASTICS_SOCKET, warehousePlastics);
    const updatedWarehouse = await RawMaterialsWarehouse.findOne({
      where: { material_type: 'Plastics' },
    });
    myEmitter.emit(UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET, updatedWarehouse);
    return res.json(warehousePlastics).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post('/plastics/update', async (req, res) => {
  const { id, file_name, supplier, ...updateFields } = req.body;

  try {
    if (!file_name) {
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

      const warehousePlastics = await WarehousePlastic.update(updateData, {
        where: { supplier },
        returning: true,
        plain: true,
      });

      myEmitter.emit(UPDATE_WAREHOUSE_PLASTICS_SOCKET, warehousePlastics);
      return res.json(warehousePlastics).status(200);
    } else {
      if (file_name != '-1') {
        const warehousePlastics = await WarehousePlastic.update(
          { file_name },
          {
            where: { id },
            returning: true,
            plain: true,
          },
        );
        myEmitter.emit(UPDATE_WAREHOUSE_PLASTICS_SOCKET, warehousePlastics);
        return res.json(warehousePlastics).status(200);
      } else {
        const warehousePlastics = await WarehousePlastic.update(
          { file_name: null },
          {
            where: { id },
            returning: true,
            plain: true,
          },
        );
        myEmitter.emit(UPDATE_WAREHOUSE_PLASTICS_SOCKET, warehousePlastics);
        return res.json(warehousePlastics).status(200);
      }
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post('/plastics/delete', async (req, res) => {
  const { plastics_warehouse_id } = req.body;

  try {
    await WarehouseAAC.destroy({ where: { id: plastics_warehouse_id } });

    myEmitter.emit(DELETE_WAREHOUSE_PLASTICS_SOCKET, plastics_warehouse_id);
    return res.json(plastics_warehouse_id).status(200);
  } catch (err) {
    return ErrorUtils.catchError(res, err);
  }
});

// Sand Powder

rawMaterialsWarehouseRouter.get('/sand-powder', async (req, res) => {
  try {
    const warehouseSandPowder = await WarehouseSandPowder.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ warehouseSandPowder });
  } catch (err) {
    console.error(err.message);
  }
});

rawMaterialsWarehouseRouter.post('/sand-powder', async (req, res) => {
  const { supplier, quantity, date } = req.body;

  try {
    const warehouseSandPowder = await WarehouseSandPowder.create({
      supplier,
      quantity,
      date: formatDate(date),
    });

    const totalSandPowderQuantity = await WarehouseSandPowder.sum('quantity');

    const allRecords = await WarehouseSandPowder.findAll({
      attributes: ['date'],
    });

    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('.');
      return new Date(`${year}-${month}-${day}`);
    };

    const latestRecord = allRecords
      .filter((record) => record.date != null)
      .sort((a, b) => parseDate(b.date) - parseDate(a.date))[0];

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord ? latestRecord.date : new Date();

    const record = await RawMaterialsWarehouse.findOne({
      where: {
        material_type: 'Sand powder (dry)',
      },
    });

    await RawMaterialsWarehouse.update(
      {
        remaining_quantity: totalSandPowderQuantity - record.consumed_quantity,
        last_updated: lastUpdated,
      },
      {
        where: {
          material_type: 'Sand powder (dry)',
        },
      },
    );

    myEmitter.emit(ADD_NEW_WAREHOUSE_SAND_POWDER_SOCKET, warehouseSandPowder);
    const updatedWarehouse = await RawMaterialsWarehouse.findOne({
      where: { material_type: 'Sand powder (dry)' },
    });
    myEmitter.emit(UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET, updatedWarehouse);
    return res.json(warehouseSandPowder).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post('/sand-powder/update', async (req, res) => {
  const { id, file_name, supplier, ...updateFields } = req.body;

  try {
    if (!file_name) {
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

      const warehouseSandPowder = await WarehouseSandPowder.update(updateData, {
        where: { supplier },
        returning: true,
        plain: true,
      });

      myEmitter.emit(UPDATE_WAREHOUSE_SAND_POWDER_SOCKET, warehouseSandPowder);
      return res.json(warehouseSandPowder).status(200);
    } else {
      if (file_name != '-1') {
        const warehouseSandPowder = await WarehouseSandPowder.update(
          { file_name },
          {
            where: { id },
            returning: true,
            plain: true,
          },
        );
        myEmitter.emit(UPDATE_WAREHOUSE_SAND_POWDER_SOCKET, warehouseSandPowder);
        return res.json(warehouseSandPowder).status(200);
      } else {
        const warehouseSandPowder = await WarehouseSandPowder.update(
          { file_name: null },
          {
            where: { id },
            returning: true,
            plain: true,
          },
        );
        myEmitter.emit(UPDATE_WAREHOUSE_SAND_POWDER_SOCKET, warehouseSandPowder);
        return res.json(warehouseSandPowder).status(200);
      }
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post('/sand-powder/delete', async (req, res) => {
  const { sand_powder_warehouse_id } = req.body;

  try {
    await WarehouseAAC.destroy({ where: { id: sand_powder_warehouse_id } });

    myEmitter.emit(DELETE_WAREHOUSE_SAND_POWDER_SOCKET, sand_powder_warehouse_id);
    return res.json(sand_powder_warehouse_id).status(200);
  } catch (err) {
    return ErrorUtils.catchError(res, err);
  }
});

module.exports = rawMaterialsWarehouseRouter;
