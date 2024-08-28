import axios from 'axios';
import { DELETE_JWT_TOKEN, SET_JWT_TOKEN } from '../types/jwtTypes';

let refreshTimeoutId = null;
const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

export const refreshToken = (expiration) => async (dispatch, getState) => {
  const timeoutTrigger = expiration - 10000;

  if (refreshTimeoutId) {
    clearTimeout(refreshTimeoutId);
  }

  refreshTimeoutId = setTimeout(() => {
    url
      .post('/auth/refresh')
      .then((res) => {
        const { accessToken, accessTokenExpiration } = res.data;
        dispatch(setToken({ accessToken, accessTokenExpiration }));
      })
      .catch(console.error);
  }, timeoutTrigger);
};
export const setToken = (payload) => async (dispatch, getState) => {
  if (payload?.accessTokenExpiration) {
    dispatch(refreshToken(payload?.accessTokenExpiration));
  }

  dispatch({
    type: SET_JWT_TOKEN,
    payload: payload?.accessToken,
  });
};

export const deleteToken = () => async (dispatch, getState) => {
  if (refreshTimeoutId) clearTimeout(refreshTimeoutId);
  dispatch({ type: DELETE_JWT_TOKEN });
};
