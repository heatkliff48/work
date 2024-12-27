import { put, call, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import showErrorMessage from '../../Utils/showErrorMessage';
import {
  ADD_NEW_FILES_PRODUCT,
  DELETE_FILES_PRODUCT,
  FULL_FILES_PRODUCT,
  GET_FULL_FILES_PRODUCT,
  NEED_DELETE_FILES_PRODUCT,
  NEW_FILES_PRODUCT,
} from '../types/filesProductTypes';

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

const getFilesProduct = () => {
  return url
    .get('/filesProduct')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewFilesProduct = (filesProduct) => {
  return url
    .post('/filesProduct', filesProduct)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const deleteFilesProduct = (order_id) => {
  return url
    .post('/filesProduct/delete', { order_id })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

function* getFilesProductWorker(action) {
  try {
    const { filesProduct } = yield call(getFilesProduct);

    yield put({ type: FULL_FILES_PRODUCT, payload: filesProduct });
  } catch (err) {
    yield put({ type: FULL_FILES_PRODUCT, payload: [] });
  }
}

function* addNewFilesProductWorker(action) {
  try {
    const { filesProduct } = yield call(addNewFilesProduct, action.payload);

    yield put({ type: NEW_FILES_PRODUCT, payload: filesProduct });
  } catch (err) {
    yield put({ type: NEW_FILES_PRODUCT, payload: [] });
  }
}

function* deleteFilesProductWorker(action) {
  try {
    const { payload } = action;

    yield call(deleteFilesProduct, payload);

    yield put({ type: NEED_DELETE_FILES_PRODUCT, payload });
  } catch (err) {
    yield put({ type: NEED_DELETE_FILES_PRODUCT, payload: [] });
  }
}

// watchers

function* filesProductWatcher() {
  yield takeLatest(GET_FULL_FILES_PRODUCT, getFilesProductWorker);
  yield takeLatest(ADD_NEW_FILES_PRODUCT, addNewFilesProductWorker);
  yield takeLatest(DELETE_FILES_PRODUCT, deleteFilesProductWorker);
}

export default filesProductWatcher;
