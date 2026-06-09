const temperatureDataMonitoringRouter = require('express').Router();
const { TemperatureDataMonitoring } = require('../db/models');
const { Op, fn, col, literal, Sequelize } = require('sequelize');

temperatureDataMonitoringRouter.get('/', async (req, res) => {
  try {
    const allClients = await TemperatureDataMonitoring.findAll({
      order: [['sensor_id', 'ASC']],
    });

    return res.status(200).json({ allClients });
  } catch (err) {
    console.error(err.message);
  }
});

temperatureDataMonitoringRouter.get('/:sensor_id', async (req, res) => {
  try {
    const { sensor_id } = req.params;

    const oneSensorData = await TemperatureDataMonitoring.findAll({
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

temperatureDataMonitoringRouter.post('/sensors_data_post', async (req, res) => {
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

    const createdRecords = await TemperatureDataMonitoring.bulkCreate(
      dataToProcess.map((record) => ({
        timestamp: record.timestamp,
        sensor_id: record.sensor_id,
        temperature: record.temperature,
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

// Получение списка доступных дат (только уникальные дни, месяцы и годы)
temperatureDataMonitoringRouter.get('/dates/available', async (req, res) => {
  try {
    // Получаем уникальные даты из timestamp, преобразованные в формат YYYY-MM-DD
    const dates = await TemperatureDataMonitoring.findAll({
      attributes: [[fn('DISTINCT', fn('DATE', col('timestamp'))), 'date']],
      order: [[literal('date'), 'ASC']],
      raw: true,
    });

    // Извлекаем только даты в массив
    const availableDates = dates.map((item) => item.date);

    return res.status(200).json({
      availableDates,
      count: availableDates.length,
    });
  } catch (err) {
    console.error('Error fetching available dates:', err.message);
    return res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

// Получение данных за конкретную дату, сгруппированных по датчикам
temperatureDataMonitoringRouter.get('/data/by-date', async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        error: 'Date parameter is required. Format: YYYY-MM-DD',
      });
    }

    // Валидация формата даты
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        error: 'Invalid date format. Use YYYY-MM-DD',
      });
    }

    // Решение 1: Используем функции Sequelize для работы с датами (рекомендуется)
    const sensorData = await TemperatureDataMonitoring.findAll({
      where: {
        [Op.and]: [
          // Используем Sequelize.fn для извлечения только даты из timestamp
          Sequelize.where(
            Sequelize.fn('DATE', Sequelize.col('timestamp')),
            '=',
            date,
          ),
        ],
      },
      order: [
        ['sensor_id', 'ASC'],
        ['timestamp', 'ASC'],
      ],
      raw: true,
    });

    console.log(`Found ${sensorData.length} records for date ${date}`);

    // Группируем данные по sensor_id и форматируем timestamp
    const groupedData = sensorData.reduce((acc, record) => {
      const sensorId = record.sensor_id;

      if (!acc[sensorId]) {
        acc[sensorId] = {
          sensor_id: sensorId,
          measurements: [],
          statistics: {
            total_measurements: 0,
            average_temperature: 0,
            min_temperature: Infinity,
            max_temperature: -Infinity,
            current_status: null,
          },
        };
      }

      // Добавляем измерение в массив
      acc[sensorId].measurements.push({
        timestamp: record.timestamp,
        temperature: record.temperature,
        status: record.status,
        error: record.error,
      });

      // Обновляем статистику
      const stats = acc[sensorId].statistics;
      stats.total_measurements++;
      stats.min_temperature = Math.min(
        stats.min_temperature,
        record.temperature,
      );
      stats.max_temperature = Math.max(
        stats.max_temperature,
        record.temperature,
      );

      // Сохраняем последний статус
      if (record.status) {
        stats.current_status = record.status;
      }

      return acc;
    }, {});

    // Вычисляем среднее значение для каждого датчика
    Object.values(groupedData).forEach((sensor) => {
      const totalHeight = sensor.measurements.reduce(
        (sum, m) => sum + m.temperature,
        0,
      );
      sensor.statistics.average_temperature =
        totalHeight / sensor.statistics.total_measurements;
    });

    return res.status(200).json({
      date: date,
      sensors_count: Object.keys(groupedData).length,
      total_measurements: sensorData.length,
      data: groupedData,
    });
  } catch (err) {
    console.error('Error fetching sensor data by date:', err.message);
    return res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

module.exports = temperatureDataMonitoringRouter;
