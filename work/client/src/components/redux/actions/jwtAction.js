import axios from 'axios';
import { SET_GWT_TOKEN } from '../types/jwtTypes';

let refreshTimeoutId = null;
const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

export const refreshToken = (expiration) => async (dispatch, getState) => {
  const timeoutTrigger = expiration - 10000;
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
  if (payload?.accessTokenExpiration)
    dispatch(refreshToken(payload?.accessTokenExpiration));
  return {
    type: SET_GWT_TOKEN,
    payload: payload?.accessToken,
  };
};
export const deleteToken = () => async (dispatch, getState) => {
  if (refreshTimeoutId) clearInterval(refreshTimeoutId);
  dispatch(setToken(null));
};
