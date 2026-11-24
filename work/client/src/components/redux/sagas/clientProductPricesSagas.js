import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import showMessage from '../../Utils/showMessage';
import { errorToText } from '../../Utils/errorToText';
import { getApiUrl } from '#utils/getApiUrl.js';
import { REQUEST_TIMEOUT } from '#utils/requestTimeout.js';
import {
  ADD_CLIENT_PRODUCT_PRICE,
  ALL_CLIENT_PRODUCT_PRICES,
  DELETE_CLIENT_PRODUCT_PRICE,
  GET_CLIENT_PRODUCT_PRICES,
  UPDATE_CLIENT_PRODUCT_PRICE,
} from '../types/clientProductPricesTypes';

const url = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
  timeout: REQUEST_TIMEOUT,
});

const getAll = () =>
  url
    .get('/clientProductPrices')
    .then((res) => res.data)
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });

const createRow = (row) =>
  url
    .post('/clientProductPrices', row)
    .then((res) => res.data)
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });

const updateRow = ({ id, price }) =>
  url
    .put(`/clientProductPrices/${id}`, { price })
    .then((res) => {
      showMessage('Price updated successfully', 'success');
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });

const removeRow = (id) =>
  url
    .delete(`/clientProductPrices/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });

function* getAllWorker() {
  try {
    const rows = yield call(getAll);
    yield put({ type: ALL_CLIENT_PRODUCT_PRICES, payload: rows });
  } catch (err) {
    yield put({ type: ALL_CLIENT_PRODUCT_PRICES, payload: [] });
  }
}

function* createWorker(action) {
  try {
    yield call(createRow, action.payload);
  } catch (err) {
    // сообщение уже показано, список обновит вебсокет
  }
}

function* updateWorker(action) {
  try {
    yield call(updateRow, action.payload);
  } catch (err) {
    // сообщение уже показано, список обновит вебсокет
  }
}

function* removeWorker(action) {
  try {
    yield call(removeRow, action.payload);
  } catch (err) {
    // сообщение уже показано, список обновит вебсокет
  }
}

function* clientProductPricesWatcher() {
  yield takeLatest(GET_CLIENT_PRODUCT_PRICES, getAllWorker);
  yield takeLatest(ADD_CLIENT_PRODUCT_PRICE, createWorker);
  yield takeLatest(UPDATE_CLIENT_PRODUCT_PRICE, updateWorker);
  yield takeLatest(DELETE_CLIENT_PRODUCT_PRICE, removeWorker);
}

export default clientProductPricesWatcher;
