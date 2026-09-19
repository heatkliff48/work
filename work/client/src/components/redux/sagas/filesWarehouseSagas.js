import { put, call, takeLatest } from 'redux-saga/effects';
import showMessage from '../../Utils/showMessage';
import { errorToText } from '../../Utils/errorToText';
import {
  ADD_NEW_FILES_WAREHOUSE,
  DELETE_FILES_WAREHOUSE,
  FULL_FILES_WAREHOUSE,
  GET_FULL_FILES_WAREHOUSE,
  NEED_DELETE_FILES_WAREHOUSE,
  NEW_FILES_WAREHOUSE,
} from '../types/filesWarehouseTypes';
import url from '../../../api/axiosConfig.js';


const getFilesWarehouse = () => {
  return url
    .get('/filesWarehouse')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewFilesWarehouse = (filesWarehouse) => {
  return url
    .post('/filesWarehouse', filesWarehouse)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const deleteFilesWarehouse = (warehouse_id) => {
  return url
    .post('/filesWarehouse/delete', { warehouse_id })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
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
