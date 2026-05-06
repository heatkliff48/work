const greenLineMonitoringRouter = require('express').Router();
const { GreenLineMonitoring } = require('../db/models');

greenLineMonitoringRouter.get('/', async (req, res) => {
  try {
    const allClients = await GreenLineMonitoring.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ allClients });
  } catch (err) {
    console.error(err.message);
  }
});

greenLineMonitoringRouter.get('/:sensor_id', async (req, res) => {
  try {
    const { sensor_id } = req.params;

    const oneSensorData = await GreenLineMonitoring.findAll({
      order: [['id', 'ASC']],
      where: {
        sensor_id: sensor_id,
      },
    });

    return res.status(200).json({ oneSensorData });
  } catch (err) {
    console.error(err.message);
  }
});

greenLineMonitoringRouter.post('/sensors_data_post', async (req, res) => {
  try {
    let dataToProcess = req.body;

    if (!Array.isArray(dataToProcess)) {
      dataToProcess = [dataToProcess];
    }

    if (dataToProcess.length === 0) {
      return res.status(400).json({
        error: 'No data provided',
      });
    }

    const createdRecords = await GreenLineMonitoring.bulkCreate(
      dataToProcess.map((record) => ({
        timestamp: record.timestamp,
        sensor_id: record.sensor_id,
        height_mm: record.height_mm,
        status: record.status,
        error: record.error || null,
      })),
      {
        validate: true,
        returning: true,
      },
    );

    return res.status(200).json({
      message: `Successfully created ${createdRecords.length} record(s)`,
      records: createdRecords,
    });
  } catch (err) {
    console.error('Error when adding new data:', err.message);

    return res.status(500).json({
      error: `Internal server error: ${err.message}`,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

module.exports = greenLineMonitoringRouter;
