const qualityManagementRouter = require('express').Router();
const { QualityManagement } = require('../db/models/index.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_NEW_QUALITY_MANAGEMENT_DATA_SOCKET,
  UPDATE_QUALITY_MANAGEMENT_DATA_SOCKET,
  DELETE_QUALITY_MANAGEMENT_DATA_SOCKET,
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

  try {
    await QualityManagement.destroy({ where: { id: qualityManagementDataID } });

    myEmitter.emit(
      DELETE_QUALITY_MANAGEMENT_DATA_SOCKET,
      qualityManagementDataID,
    );
    return res.json(qualityManagementDataID).status(200);
  } catch (err) {
    return ErrorUtils.catchError(res, err);
  }
});

module.exports = qualityManagementRouter;
