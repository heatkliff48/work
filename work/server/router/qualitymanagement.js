const qualityManagementRouter = require('express').Router();
const {
  QualityManagement,
  RawMaterialsWarehouse,
  WarehousePallet,
  Products,
  sequelize,
} = require('../db/models/index.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_NEW_QUALITY_MANAGEMENT_DATA_SOCKET,
  UPDATE_QUALITY_MANAGEMENT_DATA_SOCKET,
  DELETE_QUALITY_MANAGEMENT_DATA_SOCKET,
  UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET,
  UPDATE_WAREHOUSE_PALLETS_SOCKET,
} = require('../src/constants/event.js');
const { ErrorUtils } = require('../utils/Errors.js');
const { getPalletTypeByPalletSize } = require('../utils/palletTypes.js');

qualityManagementRouter.get('/', async (req, res) => {
  try {
    const qualityManagementData = await QualityManagement.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ qualityManagementData });
  } catch (err) {
    console.error(err.message);
  }
});

qualityManagementRouter.post('/', async (req, res) => {
  const {
    batch_id,
    product_article,
    total_quantity_plan,
    reserved_quantity,
    reserved_quantity_allocated,
    reserved_quantity_remaining,
    free_quantity_fact,
    production_plan_id,
    sorting,
    raw_mat_cons_batch_id,
    id_ordered_product_to_warehouse,
    date,
  } = req.body;

  try {
    const qualityManagementData = await QualityManagement.create({
      batch_id,
      product_article,
      total_quantity_plan,
      reserved_quantity,
      reserved_quantity_allocated,
      reserved_quantity_remaining,
      free_quantity_fact,
      production_plan_id,
      sorting,
      raw_mat_cons_batch_id,
      id_ordered_product_to_warehouse,
      date,
    });

    myEmitter.emit(
      ADD_NEW_QUALITY_MANAGEMENT_DATA_SOCKET,
      qualityManagementData,
    );
    return res.json(qualityManagementData).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

qualityManagementRouter.post('/update', async (req, res) => {
  const {
    id,
    batch_id,
    product_article,
    total_quantity_plan,
    reserved_quantity,
    reserved_quantity_allocated,
    reserved_quantity_remaining,
    free_quantity_fact,
    sorting,
    raw_mat_cons_batch_id,
  } = req.body;

  try {
    const qualityManagementData = await QualityManagement.update(
      {
        batch_id,
        product_article,
        total_quantity_plan,
        reserved_quantity,
        reserved_quantity_allocated,
        reserved_quantity_remaining,
        free_quantity_fact,
        sorting,
        raw_mat_cons_batch_id,
      },
      {
        where: {
          id,
        },
        returning: true,
        plain: true,
      },
    );

    myEmitter.emit(
      UPDATE_QUALITY_MANAGEMENT_DATA_SOCKET,
      qualityManagementData,
    );
    return res.json(qualityManagementData).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

qualityManagementRouter.post('/delete', async (req, res) => {
  console.log(
    '-----------------------------------------------------------',
    req.body,
  );
  const { qualityManagementDataID } = req.body;
  const id = qualityManagementDataID.id || qualityManagementDataID;
  const quantity = qualityManagementDataID.quantity || req.body.quantity;
  // Пластик (использовано + отходы, kg) вводится вручную и приходит только с одной партией
  const plasticQuantity =
    Number(
      qualityManagementDataID.plastic_quantity ?? req.body.plastic_quantity,
    ) || 0;

  const palletsQuantity = Number(quantity) || 0;

  // Паллеты списываются по типу (FIFO по дате поступления), как алюминий;
  // остальное — из общей строки RawMaterialsWarehouse
  const material_types = [];
  if (plasticQuantity > 0) {
    material_types.push({
      material_type: 'Plastics',
      quantity: plasticQuantity,
    });
  }

  const t = await sequelize.transaction();
  const updatedPallets = [];

  try {
    if (palletsQuantity > 0) {
      const qualityManagementRecord = await QualityManagement.findByPk(id, {
        transaction: t,
      });
      const product = await Products.findOne({
        where: { article: qualityManagementRecord?.product_article },
        order: [['version', 'DESC']],
        transaction: t,
      });

      if (!product) {
        await t.rollback();
        return res.status(400).json({
          error: `Product ${qualityManagementRecord?.product_article} not found, can't define pallet type.`,
        });
      }

      const palletType = getPalletTypeByPalletSize(product.palletSize);

      const palletRecords = await WarehousePallet.findAll({
        where: { type: palletType },
        order: [
          [sequelize.literal(`to_date("date", 'DD.MM.YYYY')`), 'ASC'],
          ['id', 'ASC'],
        ],
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      const palletsAvailable = palletRecords.reduce(
        (sum, record) =>
          sum +
          Math.max(
            0,
            (Number(record.quantity) || 0) -
              (Number(record.consumed_quantity) || 0),
          ),
        0,
      );

      if (palletsAvailable < palletsQuantity) {
        await t.rollback();
        return res.status(400).json({
          error: `Not enough materials. Pallets ${palletType} avaliable ${palletsAvailable}. Needed ${palletsQuantity}.`,
        });
      }

      let remainingToWriteOff = palletsQuantity;

      for (const record of palletRecords) {
        if (remainingToWriteOff <= 0) break;

        const consumed = Number(record.consumed_quantity) || 0;
        const available = Math.max(0, (Number(record.quantity) || 0) - consumed);
        if (available <= 0) continue;

        const quantityToWriteOff = Math.min(available, remainingToWriteOff);

        await record.update(
          { consumed_quantity: consumed + quantityToWriteOff },
          { transaction: t },
        );
        updatedPallets.push(record.toJSON());

        remainingToWriteOff -= quantityToWriteOff;
      }

      const palletsSummaryRecord = await RawMaterialsWarehouse.findOne({
        where: { material_type: 'Pallets' },
        transaction: t,
      });
      const totalPalletsQuantity =
        Number(await WarehousePallet.sum('quantity', { transaction: t })) || 0;
      const totalPalletsConsumed =
        Number(
          await WarehousePallet.sum('consumed_quantity', { transaction: t }),
        ) || 0;

      await palletsSummaryRecord.update(
        {
          remaining_quantity: totalPalletsQuantity - totalPalletsConsumed,
          consumed_quantity:
            (Number(palletsSummaryRecord.consumed_quantity) || 0) +
            palletsQuantity,
        },
        { transaction: t },
      );
    }

    for (const item of material_types) {
      const record = await RawMaterialsWarehouse.findOne({
        where: { material_type: item.material_type },
        transaction: t,
      });

      if (record.remaining_quantity < item.quantity) {
        await t.rollback();
        return res.status(400).json({
          error: `Not enough materials. ${item.material_type} avaliable ${record.remaining_quantity}. Needed ${item.quantity}.`,
        }); // или throw error
      }

      await RawMaterialsWarehouse.update(
        {
          remaining_quantity: record.remaining_quantity - item.quantity,
          consumed_quantity: record.consumed_quantity + item.quantity,
          // last_updated: formatDate(new Date()),
        },
        {
          where: { material_type: item.material_type },
          transaction: t,
        },
      );
    }

    await t.commit();

    const updatedRawMatWarehouse = await RawMaterialsWarehouse.findAll({
      order: [['id', 'ASC']],
    });

    myEmitter.emit(
      UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET,
      updatedRawMatWarehouse,
    );
    // Тот же формат, что у update(..., { returning: true, plain: true })
    for (const pallet of updatedPallets) {
      myEmitter.emit(UPDATE_WAREHOUSE_PALLETS_SOCKET, [1, pallet]);
    }

    await QualityManagement.destroy({ where: { id: id } });

    myEmitter.emit(DELETE_QUALITY_MANAGEMENT_DATA_SOCKET, id);

    return res.json(id).status(200);
  } catch (err) {
    await t.rollback();
    return ErrorUtils.catchError(res, err);
  }
});

module.exports = qualityManagementRouter;
