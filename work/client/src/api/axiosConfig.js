import axios from 'axios';
import { getApiUrl } from '#utils/getApiUrl.js';

let accessToken = null;

export const setApiAccessToken = (token) => {
  accessToken = token || null;
};

export const getApiAccessToken = () => {
  return accessToken;
};

export const clearApiAccessToken = () => {
  accessToken = null;
};

const api = axios.create({
  baseURL: getApiUrl() || 'http://localhost:3001',
  withCredentials: true,
  timeout: 60000,
});

api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    console.log(
      `Запрос: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
    );

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('Ошибка ответа:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Нет ответа от сервера:', error.request);
    } else {
      console.error('Ошибка запроса:', error.message);
    }

    return Promise.reject(error);
  },
);

export default api;
