import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_URL || 'http://localhost:3001', // fallback URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем интерцептор для логирования запросов (опционально)
api.interceptors.request.use(
  (config) => {
    console.log(
      `Запрос: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`,
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Добавляем интерцептор для обработки ответов и ошибок
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Сервер ответил с кодом ошибки
      console.error(
        'Ошибка ответа:',
        error.response.status,
        error.response.data,
      );
    } else if (error.request) {
      // Запрос был сделан, но ответ не получен
      console.error('Нет ответа от сервера:', error.request);
    } else {
      // Ошибка при настройке запроса
      console.error('Ошибка запроса:', error.message);
    }
    return Promise.reject(error);
  },
);

export default api;
