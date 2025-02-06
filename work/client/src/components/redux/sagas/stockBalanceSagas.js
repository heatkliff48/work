import showErrorMessage from '../../Utils/showErrorMessage';
import {
  ADD_NEW_STOCK_BALANCE,
  ALL_STOCK_BALANCE,
  GET_ALL_STOCK_BALANCE,
  NEW_STOCK_BALANCE,
} from '../types/StockBalanceTypes';
import axios from 'axios';
import { put, call, takeLatest } from 'redux-saga/effects';

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

const getStockBalance = () => {
  return url
    .get('/stockBalance')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addStockBalance = (stock) => {
  return url
    .post('/stockBalance/add', stock)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

function* getStockBalanceWatcher(action) {
  try {
    const stock = yield call(getStockBalance, action.payload);
    yield put({ type: ALL_STOCK_BALANCE, payload: stock });
  } catch (err) {
    yield put({ type: ALL_STOCK_BALANCE, payload: [] });
  }
}

function* addNewStockBalance(action) {
  try {
    const newStock = yield call(addStockBalance, action.payload);
    yield put({ type: NEW_STOCK_BALANCE, payload: newStock });
  } catch (err) {
    yield put({ type: NEW_STOCK_BALANCE, payload: [] });
  }
}

function* stockBalanceWatcher() {
  yield takeLatest(GET_ALL_STOCK_BALANCE, getStockBalanceWatcher);
  yield takeLatest(ADD_NEW_STOCK_BALANCE, addNewStockBalance);
}

export default stockBalanceWatcher;
