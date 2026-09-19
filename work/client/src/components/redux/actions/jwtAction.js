import { DELETE_JWT_TOKEN, SET_JWT_TOKEN } from '../types/jwtTypes';

import api, {
  clearApiAccessToken,
  setApiAccessToken,
} from '../../../api/axiosConfig.js';

let refreshTimeoutId = null;

export const refreshToken = (expiration) => async (dispatch) => {
  const timeoutBeforeExpiration = 10 * 1000;
  const timeoutTrigger = Math.max(expiration - timeoutBeforeExpiration, 0);

  if (refreshTimeoutId) {
    clearTimeout(refreshTimeoutId);
  }

  refreshTimeoutId = setTimeout(async () => {
    try {
      const response = await api.post('/auth/refresh');

      const { accessToken, accessTokenExpiration } = response.data;

      dispatch(
        setToken({
          accessToken,
          accessTokenExpiration,
        }),
      );
    } catch (error) {
      console.error('Не удалось обновить access-токен:', error);

      dispatch(deleteToken());
    }
  }, timeoutTrigger);
};

export const setToken = (payload) => async (dispatch) => {
  const accessToken = payload?.accessToken;
  const accessTokenExpiration = payload?.accessTokenExpiration;

  if (!accessToken) {
    dispatch(deleteToken());
    return;
  }

  // Передаём токен единому Axios-клиенту.
  setApiAccessToken(accessToken);

  // Сохраняем токен в Redux.
  dispatch({
    type: SET_JWT_TOKEN,
    payload: accessToken,
  });

  // Планируем обновление за 10 секунд до окончания действия.
  if (accessTokenExpiration) {
    dispatch(refreshToken(accessTokenExpiration));
  }
};

export const deleteToken = () => async (dispatch) => {
  if (refreshTimeoutId) {
    clearTimeout(refreshTimeoutId);
    refreshTimeoutId = null;
  }

  clearApiAccessToken();

  dispatch({
    type: DELETE_JWT_TOKEN,
  });
};
