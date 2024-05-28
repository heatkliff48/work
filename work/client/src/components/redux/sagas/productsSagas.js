import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import inMemoryJWT from '../../../services/inMemoryJWT';
import showErrorMessage from '../../Utils/showErrorMessage';
import { ALL_PRODUCTS, GET_ALL_PRODUCTS } from '../types/productsTypes';

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

url.interceptors.request.use(
  (config) => {
    const accessToken = inMemoryJWT.getToken();

    if (!accessToken) config.headers['Authorization'] = `Bearer ${accessToken}`;

    return config;
  },
  (err) => Promise.reject(err)
);

const getAllProducts = (user) => {
  return url
    .post('/products/all', { user })
    .then((res) => {
      const { accessToken, accessTokenExpiration } = res.data;

      inMemoryJWT.setToken(accessToken, accessTokenExpiration);
      return res.data.products;
    })
    .catch(showErrorMessage);
};

function* getAllProductsWatcher(action) {
  try {
    console.log('GET ALL PROD WATCH', action.payload);
    const products = yield call(getAllProducts, action.payload);

    yield put({ type: ALL_PRODUCTS, payload: products });
  } catch (err) {
    yield put({ type: ALL_PRODUCTS, payload: null });
  }
}

function* productsWatcher() {
  yield takeLatest(GET_ALL_PRODUCTS, getAllProductsWatcher);
}

export default productsWatcher;
