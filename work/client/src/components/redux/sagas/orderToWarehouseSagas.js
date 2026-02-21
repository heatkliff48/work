import showMessage from '../../Utils/showMessage';
import { errorToText } from '../../Utils/errorToText';
import {
  ADD_NEW_ORDER_TO_WAREHOUSE,
  DELETE_ORDER_TO_WAREHOUSE,
  FULL_ORDER_TO_WAREHOUSE,
  GET_FULL_ORDER_TO_WAREHOUSE,
  NEED_DELETE_ORDER_TO_WAREHOUSE,
  NEW_ORDER_TO_WAREHOUSE,
  UPDATE_ORDER_TO_WAREHOUSE,
  UPDATE_NEW_ORDER_TO_WAREHOUSE,
} from '../types/orderToWarehouseTypes';
import axios from 'axios';
import { put, call, takeLatest } from 'redux-saga/effects';

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

const getOrderToWarehouse = () => {
  return url
    .get('/orderToWarehouse')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewOrderToWarehouse = (orderToWarehouse) => {
  return url
    .post('/orderToWarehouse', orderToWarehouse)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const deleteOrderToWarehouse = (order_id) => {
  return url
    .post('/orderToWarehouse/delete', { order_id })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const updateOrderToWarehouse = (orderToWarehouse) => {
  return url
    .post('/orderToWarehouse/update', orderToWarehouse)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

function* getOrderToWarehouseWorker(action) {
  try {
    const { orderToWarehouse } = yield call(getOrderToWarehouse);

    yield put({ type: FULL_ORDER_TO_WAREHOUSE, payload: orderToWarehouse });
  } catch (err) {
    yield put({ type: FULL_ORDER_TO_WAREHOUSE, payload: [] });
  }
}

function* addNewOrderToWarehouseWorker(action) {
  try {
    const { orderToWarehouse } = yield call(
      addNewOrderToWarehouse,
      action.payload,
    );

    yield put({ type: NEW_ORDER_TO_WAREHOUSE, payload: orderToWarehouse });
  } catch (err) {
    yield put({ type: NEW_ORDER_TO_WAREHOUSE, payload: [] });
  }
}

function* deleteOrderToWarehouseWorker(action) {
  try {
    const { payload } = action;

    yield call(deleteOrderToWarehouse, payload);

    yield put({ type: NEED_DELETE_ORDER_TO_WAREHOUSE, payload });
  } catch (err) {
    yield put({ type: NEED_DELETE_ORDER_TO_WAREHOUSE, payload: [] });
  }
}

function* updateClientWorker(action) {
  try {
    const { orderToWarehouse } = yield call(
      updateOrderToWarehouse,
      action.payload,
    );

    yield put({ type: UPDATE_ORDER_TO_WAREHOUSE, payload: orderToWarehouse });
  } catch (err) {
    yield put({ type: UPDATE_ORDER_TO_WAREHOUSE, payload: [] });
  }
}

// watchers

function* orderToWarehouseWatcher() {
  yield takeLatest(GET_FULL_ORDER_TO_WAREHOUSE, getOrderToWarehouseWorker);
  yield takeLatest(ADD_NEW_ORDER_TO_WAREHOUSE, addNewOrderToWarehouseWorker);
  yield takeLatest(DELETE_ORDER_TO_WAREHOUSE, deleteOrderToWarehouseWorker);
  yield takeLatest(UPDATE_NEW_ORDER_TO_WAREHOUSE, updateClientWorker);
}

export default orderToWarehouseWatcher;
