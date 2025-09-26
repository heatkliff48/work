import showErrorMessage from '../../Utils/showErrorMessage';
import {
  ADD_NEW_WAREHOUSE_SAND,
  DELETE_WAREHOUSE_SAND,
  FULL_WAREHOUSE_SAND,
  GET_FULL_WAREHOUSE_SAND,
  NEED_DELETE_WAREHOUSE_SAND,
  NEW_WAREHOUSE_SAND,
  UPDATE_WAREHOUSE_SAND,
  UPDATE_NEW_WAREHOUSE_SAND,
} from '../types/warehouseRawMaterialsTypes';
import axios from 'axios';
import { put, call, takeLatest } from 'redux-saga/effects';

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

const getWarehouseSand = () => {
  return url
    .get('/rawMaterialsWarehouse/sand')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewWarehouseSand = (warehouseSand) => {
  return url
    .post('/rawMaterialsWarehouse/sand', warehouseSand)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const deleteWarehouseSand = (sand_warehouse_id) => {
  return url
    .post('/rawMaterialsWarehouse/sand/delete', { sand_warehouse_id })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const updateWarehouseSand = (warehouseSand) => {
  return url
    .post('/rawMaterialsWarehouse/sand/update', warehouseSand)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

function* getWarehouseSandWorker(action) {
  try {
    const { warehouseSand } = yield call(getWarehouseSand);

    yield put({ type: FULL_WAREHOUSE_SAND, payload: warehouseSand });
  } catch (err) {
    yield put({ type: FULL_WAREHOUSE_SAND, payload: [] });
  }
}

function* addNewWarehouseSandWorker(action) {
  try {
    const { warehouseSand } = yield call(addNewWarehouseSand, action.payload);

    yield put({ type: NEW_WAREHOUSE_SAND, payload: warehouseSand });
  } catch (err) {
    yield put({ type: NEW_WAREHOUSE_SAND, payload: [] });
  }
}

function* deleteWarehouseSandWorker(action) {
  try {
    const { payload } = action;

    yield call(deleteWarehouseSand, payload);

    yield put({ type: NEED_DELETE_WAREHOUSE_SAND, payload });
  } catch (err) {
    yield put({ type: NEED_DELETE_WAREHOUSE_SAND, payload: [] });
  }
}

function* updateClientWorker(action) {
  try {
    const { warehouseSand } = yield call(updateWarehouseSand, action.payload);

    yield put({ type: UPDATE_WAREHOUSE_SAND, payload: warehouseSand });
  } catch (err) {
    yield put({ type: UPDATE_WAREHOUSE_SAND, payload: [] });
  }
}

// watchers

function* warehouseRawMaterialsWatcher() {
  yield takeLatest(GET_FULL_WAREHOUSE_SAND, getWarehouseSandWorker);
  yield takeLatest(ADD_NEW_WAREHOUSE_SAND, addNewWarehouseSandWorker);
  yield takeLatest(DELETE_WAREHOUSE_SAND, deleteWarehouseSandWorker);
  yield takeLatest(UPDATE_NEW_WAREHOUSE_SAND, updateClientWorker);
}

export default warehouseRawMaterialsWatcher;
