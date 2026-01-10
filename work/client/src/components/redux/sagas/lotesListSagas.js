import showMessage from '../../Utils/showMessage';
import { errorToText } from '../../Utils/errorToText';
import {
  ADD_NEW_LOTES_LIST,
  FULL_LOTES_LIST,
  GET_FULL_LOTES_LIST,
  NEW_LOTES_LIST,
  UPDATE_LOTES_LIST,
  UPD_LOTES_LIST,
} from '../types/lotesListTypes';
import axios from 'axios';
import { put, call, takeLatest } from 'redux-saga/effects';

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

const getLotesList = () => {
  return url
    .get('/lotesList')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewLotesList = (lotesList) => {
  return url
    .post('/lotesList', lotesList)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const updateLotesList = (lotesList) => {
  return url
    .post('/lotesList/update', lotesList)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

function* getLotesListWorker(action) {
  try {
    const { lotesList } = yield call(getLotesList);

    yield put({ type: FULL_LOTES_LIST, payload: lotesList });
  } catch (err) {
    yield put({ type: FULL_LOTES_LIST, payload: [] });
  }
}

function* addNewLotesListWorker(action) {
  try {
    const { lotesList } = yield call(addNewLotesList, action.payload);

    yield put({ type: NEW_LOTES_LIST, payload: lotesList });
  } catch (err) {
    yield put({ type: NEW_LOTES_LIST, payload: [] });
  }
}

function* updateLotesListWorker(action) {
  try {
    yield call(updateLotesList, action.payload);
  } catch (err) {
    yield put({ type: UPD_LOTES_LIST, payload: [] });
  }
}

// watchers

function* lotesListWatcher() {
  yield takeLatest(GET_FULL_LOTES_LIST, getLotesListWorker);
  yield takeLatest(ADD_NEW_LOTES_LIST, addNewLotesListWorker);
  yield takeLatest(UPDATE_LOTES_LIST, updateLotesListWorker);
}

export default lotesListWatcher;
