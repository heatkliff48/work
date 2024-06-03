import axios from 'axios';
import { SET_GWT_TOKEN } from '../types/jwtTypes';

let refreshTimeoutId = null;
const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

export const refreshToken = () => async (dispatch, expiration) => {
  const timeoutTrigger = expiration - 10000;

  refreshTimeoutId = setTimeout(() => {
    url
      .post('/auth/refresh')
      .then((res) => {
        const { accessToken, accessTokenExpiration } = res.data;
        dispatch(setToken(accessToken, accessTokenExpiration));
      })
      .catch(console.error);
  }, timeoutTrigger);
};
export const setToken = () => async (dispatch, payload) => {
  if (payload) dispatch(refreshToken);
  return {
    type: SET_GWT_TOKEN,
    payload,
  };
};
export const deleteToken = () => async (dispatch) => {
  if (refreshTimeoutId) clearInterval(refreshTimeoutId);
  dispatch(setToken(null));
};
