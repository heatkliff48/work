import { put, call, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import showErrorMessage from '../../Utils/showErrorMessage';
import {
  ADD_NEW_FILES_ORDER,
  DELETE_FILES_ORDER,
  FULL_FILES_ORDER,
  GET_FULL_FILES_ORDER,
  NEED_DELETE_FILES_ORDER,
  NEW_FILES_ORDER,
} from '../types/filesOrderTypes';

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

const getFilesOrder = () => {
  return url
    .get('/filesOrder')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewFilesOrder = (filesOrder) => {
  return url
    .post('/filesOrder', filesOrder)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const deleteFilesOrder = (order_id) => {
  return url
    .post('/filesOrder/delete', { order_id })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

function* getFilesOrderWorker(action) {
  try {
    const { filesOrder } = yield call(getFilesOrder);

    yield put({ type: FULL_FILES_ORDER, payload: filesOrder });
  } catch (err) {
    yield put({ type: FULL_FILES_ORDER, payload: [] });
  }
}

function* addNewFilesOrderWorker(action) {
  try {
    const { filesOrder } = yield call(addNewFilesOrder, action.payload);

    yield put({ type: NEW_FILES_ORDER, payload: filesOrder });
  } catch (err) {
    yield put({ type: NEW_FILES_ORDER, payload: [] });
  }
}

function* deleteFilesOrderWorker(action) {
  try {
    const { payload } = action;

    yield call(deleteFilesOrder, payload);

    yield put({ type: NEED_DELETE_FILES_ORDER, payload });
  } catch (err) {
    yield put({ type: NEED_DELETE_FILES_ORDER, payload: [] });
  }
}

// watchers

function* filesOrderWatcher() {
  yield takeLatest(GET_FULL_FILES_ORDER, getFilesOrderWorker);
  yield takeLatest(ADD_NEW_FILES_ORDER, addNewFilesOrderWorker);
  yield takeLatest(DELETE_FILES_ORDER, deleteFilesOrderWorker);
}

export default filesOrderWatcher;
