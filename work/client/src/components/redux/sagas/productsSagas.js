import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import inMemoryJWT from '../../../services/inMemoryJWT';
import showErrorMessage from '../../Utils/showErrorMessage';
import {
  ADD_NEW_PRODUCT,
  ALL_PRODUCTS,
  GET_ALL_PRODUCTS,
  NEW_PRODUCT,
} from '../types/productsTypes';
// import { useState } from 'react';

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

url.interceptors.request.use(
  (config) => {
    const accessToken = inMemoryJWT.getToken();
    if (accessToken) config.headers['Authorization'] = `Bearer ${accessToken}`;

    return config;
  },
  (err) => Promise.reject(err)
);

const getAllProducts = () => {
  return url
    .get('/products/all')
    .then((res) => {
      const { accessToken, accessTokenExpiration } = res.data;

      inMemoryJWT.setToken(accessToken, accessTokenExpiration);
      console.log('ProductsSaga', res.data.products);
      return res.data.products;
    })
    .catch(showErrorMessage);
};
const addNewProduct = (product) => {
  return url
    .post('/products/add', { product })
    .then((res) => {
      const { accessToken, accessTokenExpiration } = res.data;

      inMemoryJWT.setToken(accessToken, accessTokenExpiration);
      return res.data.products;
    })
    .catch(showErrorMessage);
};

function* getAllProductsWatcher(action) {
  try {
    const products = yield call(getAllProducts, action.payload);

    yield put({ type: ALL_PRODUCTS, payload: products });
  } catch (err) {
    yield put({ type: ALL_PRODUCTS, payload: [] });
  }
}
function* addNewProductWatcher(action) {
  try {
    console.log(action.payload);
    const products = yield call(addNewProduct, action.payload);

    yield put({ type: NEW_PRODUCT, payload: products });
  } catch (err) {
    yield put({ type: NEW_PRODUCT, payload: [] });
  }
}

function* productsWatcher() {
  yield takeLatest(GET_ALL_PRODUCTS, getAllProductsWatcher);
  yield takeLatest(ADD_NEW_PRODUCT, addNewProductWatcher);
}

export default productsWatcher;
