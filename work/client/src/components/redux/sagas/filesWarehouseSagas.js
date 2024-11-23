import { put, call, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import showErrorMessage from '../../Utils/showErrorMessage';
import {
  ADD_NEW_FILES_WAREHOUSE,
  DELETE_FILES_WAREHOUSE,
  FULL_FILES_WAREHOUSE,
  GET_FULL_FILES_WAREHOUSE,
  NEED_DELETE_FILES_WAREHOUSE,
  NEW_FILES_WAREHOUSE,
} from '../types/filesWarehouseTypes';

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

const getFilesWarehouse = () => {
  return url
    .get('/filesWarehouse')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewFilesWarehouse = (filesWarehouse) => {
  return url
    .post('/filesWarehouse', filesWarehouse)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const deleteFilesWarehouse = (warehouse_id) => {
  return url
    .post('/filesWarehouse/delete', { warehouse_id })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

function* getFilesWarehouseWorker(action) {
  try {
    const { filesWarehouse } = yield call(getFilesWarehouse);

    yield put({ type: FULL_FILES_WAREHOUSE, payload: filesWarehouse });
  } catch (err) {
    yield put({ type: FULL_FILES_WAREHOUSE, payload: [] });
  }
}

function* addNewFilesWarehouseWorker(action) {
  try {
    const { filesWarehouse } = yield call(addNewFilesWarehouse, action.payload);

    yield put({ type: NEW_FILES_WAREHOUSE, payload: filesWarehouse });
  } catch (err) {
    yield put({ type: NEW_FILES_WAREHOUSE, payload: [] });
  }
}

function* deleteFilesWarehouseWorker(action) {
  try {
    const { payload } = action;

    yield call(deleteFilesWarehouse, payload);

    yield put({ type: NEED_DELETE_FILES_WAREHOUSE, payload });
  } catch (err) {
    yield put({ type: NEED_DELETE_FILES_WAREHOUSE, payload: [] });
  }
}

// watchers

function* filesWarehouseWatcher() {
  yield takeLatest(GET_FULL_FILES_WAREHOUSE, getFilesWarehouseWorker);
  yield takeLatest(ADD_NEW_FILES_WAREHOUSE, addNewFilesWarehouseWorker);
  yield takeLatest(DELETE_FILES_WAREHOUSE, deleteFilesWarehouseWorker);
}

export default filesWarehouseWatcher;
