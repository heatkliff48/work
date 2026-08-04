import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import api from '../../api/axiosConfig';
import './GreenLineMonitoring.css';

const TemperatureDataMonitoring = () => {
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [sensorsData, setSensorsData] = useState({});
  const [sensorsStatistics, setSensorsStatistics] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Получение доступных дат при загрузке компонента
  useEffect(() => {
    fetchAvailableDates();
  }, []);

  // Получение данных при выборе даты
  useEffect(() => {
    if (selectedDate) {
      fetchSensorData(selectedDate);
    }
  }, [selectedDate]);

  const fetchAvailableDates = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        '/temperaturedatamonitoring/dates/available',
      );
      setAvailableDates(response.data.availableDates || []);
    } catch (err) {
      setError('Error loading available dates');
      console.error('Error fetching available dates:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSensorData = async (date) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(
        '/temperaturedatamonitoring/data/by-date',
        {
          params: { date },
        },
      );

      const { data } = response.data;

      const chartData = {};
      const statsData = {};

      Object.entries(data).forEach(([sensorId, sensorInfo]) => {
        chartData[sensorId] = sensorInfo.measurements.map((measurement) => ({
          timestamp: new Date(measurement.timestamp).toLocaleTimeString(
            'ru-RU',
            {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            },
          ),
          temperature: measurement.temperature,
          status: measurement.status,
          fullTimestamp: measurement.timestamp,
        }));

        statsData[sensorId] = sensorInfo.statistics;
      });

      setSensorsData(chartData);
      setSensorsStatistics(statsData);
    } catch (err) {
      setError('Error loading sensor data');
      console.error('Error fetching sensor data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      normal: '#4CAF50',
      warning: '#FFC107',
      error: '#F44336',
      offline: '#9E9E9E',
      critical: '#D32F2F',
    };
    return statusColors[status?.toLowerCase()] || '#757575';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      normal: 'Normal',
      warning: 'Warning',
      error: 'Error',
      offline: 'Offline',
      critical: 'Critical',
    };
    return statusTexts[status?.toLowerCase()] || status || 'Unknown';
  };

  return (
    <div className="sensor-monitoring">
      <div className="controls">
        <div className="date-selector">
          <label htmlFor="date-select">Select date:</label>
          <select
            id="date-select"
            value={selectedDate}
            onChange={handleDateChange}
            disabled={loading}
          >
            <option value="">-- Select date --</option>
            {availableDates.map((date) => (
              <option key={date} value={date}>
                {formatDate(date)}
              </option>
            ))}
          </select>
          {availableDates.length > 0 && (
            <span className="dates-count">
              Available dates: {availableDates.length}
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <span>Loading data...</span>
        </div>
      )}

      {!loading && selectedDate && Object.keys(sensorsData).length === 0 && (
        <div className="no-data">
          <span className="no-data-icon">📊</span>
          <p>No data for the selected date</p>
        </div>
      )}

      <div className="sensors-grid">
        {Object.entries(sensorsData).map(([sensorId, data]) => {
          const stats = sensorsStatistics[sensorId] || {};

          return (
            <div key={sensorId} className="sensor-card">
              <div className="sensor-header">
                <h3>Sensor #{sensorId}</h3>
                <span
                  className="sensor-status"
                  style={{
                    backgroundColor: getStatusColor(stats.current_status),
                  }}
                >
                  {getStatusText(stats.current_status)}
                </span>
              </div>

              <div className="sensor-chart">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tick={{ fontSize: 10 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      label={{
                        value: 'Height (mm)',
                        angle: -90,
                        position: 'insideLeft',
                        style: { fontSize: 10, textAnchor: 'middle' },
                      }}
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip
                      formatter={(value) => [
                        `${value?.toFixed(2)} mm`,
                        'Height',
                      ]}
                      labelFormatter={(label) => `Time: ${label}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="#2196F3"
                      name="Height"
                      dot={false}
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="sensor-stats">
                <div className="stat-item">
                  <span className="stat-label">Min. </span>
                  <span className="stat-value">
                    {stats.min_temperature?.toFixed(2)}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Avg. </span>
                  <span className="stat-value">
                    {stats.average_temperature?.toFixed(2)}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Max. </span>
                  <span className="stat-value">
                    {stats.max_temperature?.toFixed(2)}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Measurements </span>
                  <span className="stat-value">{stats.total_measurements}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TemperatureDataMonitoring;
