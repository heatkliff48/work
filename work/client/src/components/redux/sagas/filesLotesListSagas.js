import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import showMessage from '../../Utils/showMessage';
import { errorToText } from '../../Utils/errorToText';
import {
  ADD_NEW_FILES_LOTES_LIST,
  DELETE_FILES_LOTES_LIST,
  FULL_FILES_LOTES_LIST,
  GET_FULL_FILES_LOTES_LIST,
  NEED_DELETE_FILES_LOTES_LIST,
  NEW_FILES_LOTES_LIST,
} from '../types/filesLotesListTypes';

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

const getFilesLotesList = () => {
  return url
    .get('/allfiles/lotesList')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewFilesLotesList = (filesLotesList) => {
  return url
    .post('/allfiles', filesLotesList)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const deleteFilesLotesList = (LotesList_id) => {
  return url
    .post('/allfiles/delete', { LotesList_id })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

function* getFilesLotesListWorker(action) {
  try {
    const { filesLotesList } = yield call(getFilesLotesList);

    yield put({ type: FULL_FILES_LOTES_LIST, payload: filesLotesList });
  } catch (err) {
    yield put({ type: FULL_FILES_LOTES_LIST, payload: [] });
  }
}

function* addNewFilesLotesListWorker(action) {
  try {
    const { filesLotesList } = yield call(addNewFilesLotesList, action.payload);

    yield put({ type: NEW_FILES_LOTES_LIST, payload: filesLotesList });
  } catch (err) {
    yield put({ type: NEW_FILES_LOTES_LIST, payload: [] });
  }
}

function* deleteFilesLotesListWorker(action) {
  try {
    const { payload } = action;

    yield call(deleteFilesLotesList, payload);

    yield put({ type: NEED_DELETE_FILES_LOTES_LIST, payload });
  } catch (err) {
    yield put({ type: NEED_DELETE_FILES_LOTES_LIST, payload: [] });
  }
}

function* filesLotesListWatcher() {
  yield takeLatest(GET_FULL_FILES_LOTES_LIST, getFilesLotesListWorker);
  yield takeLatest(ADD_NEW_FILES_LOTES_LIST, addNewFilesLotesListWorker);
  yield takeLatest(DELETE_FILES_LOTES_LIST, deleteFilesLotesListWorker);
}

export default filesLotesListWatcher;
