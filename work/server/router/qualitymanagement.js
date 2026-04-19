const qualityManagementRouter = require('express').Router();
const {
  QualityManagement,
  RawMaterialsWarehouse,
  sequelize,
} = require('../db/models/index.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_NEW_QUALITY_MANAGEMENT_DATA_SOCKET,
  UPDATE_QUALITY_MANAGEMENT_DATA_SOCKET,
  DELETE_QUALITY_MANAGEMENT_DATA_SOCKET,
  UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET,
} = require('../src/constants/event.js');
const { ErrorUtils } = require('../utils/Errors.js');

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

  const material_types = [
    { material_type: 'Pallets', quantity: quantity },
    { material_type: 'Plastics', quantity: quantity * 0.45 },
  ];

  const t = await sequelize.transaction();

  try {
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

    await QualityManagement.destroy({ where: { id: id } });

    myEmitter.emit(DELETE_QUALITY_MANAGEMENT_DATA_SOCKET, id);

    return res.json(id).status(200);
  } catch (err) {
    await t.rollback();
    return ErrorUtils.catchError(res, err);
  }
});

module.exports = qualityManagementRouter;
