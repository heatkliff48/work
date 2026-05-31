import showMessage from '../../Utils/showMessage';
import { errorToText } from '../../Utils/errorToText';
import axios from 'axios';
import { put, call, takeLatest } from 'redux-saga/effects';
import {
  ADD_NEW_RELATED_MATERIALS_BACKORDER,
  FULL_RELATED_MATERIALS_BACKORDER,
  GET_FULL_RELATED_MATERIALS_BACKORDER,
  NEW_RELATED_MATERIALS_BACKORDER,
  UPDATE_NEW_RELATED_MATERIALS_BACKORDER,
  UPDATE_RELATED_MATERIALS_BACKORDER,
} from '../types/relatedMaterialsBackorderListTypes';

import { getApiUrl } from '#utils/getApiUrl.js';

const url = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
});

const getRelatedMaterialsBackorder = () => {
  return url
    .get('/relatedMaterialsBackorderList')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewRelatedMaterialsBackorder = (relatedMaterialsBackorderList) => {
  return url
    .post('/relatedMaterialsBackorderList', relatedMaterialsBackorderList)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const updateRelatedMaterialsBackorder = (relatedMaterialsBackorderList) => {
  return url
    .post(
      '/relatedMaterialsBackorderList/update',
      relatedMaterialsBackorderList,
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

function* getRelatedMaterialsBackorderListWorker() {
  try {
    const { relatedMaterialsBackorderList } = yield call(
      getRelatedMaterialsBackorder,
    );

    yield put({
      type: FULL_RELATED_MATERIALS_BACKORDER,
      payload: relatedMaterialsBackorderList,
    });
  } catch (err) {
    yield put({ type: FULL_RELATED_MATERIALS_BACKORDER, payload: [] });
  }
}

function* addNewRelatedMaterialsBackorderListWorker(action) {
  try {
    const { relatedMaterialsBackorderList } = yield call(
      addNewRelatedMaterialsBackorder,
      action.payload,
    );

    yield put({
      type: NEW_RELATED_MATERIALS_BACKORDER,
      payload: relatedMaterialsBackorderList,
    });
  } catch (err) {
    yield put({ type: NEW_RELATED_MATERIALS_BACKORDER, payload: [] });
  }
}

function* updateNewRelatedMaterialsBackorderListWorker(action) {
  try {
    const { relatedMaterialsBackorderList } = yield call(
      updateRelatedMaterialsBackorder,
      action.payload,
    );

    yield put({
      type: UPDATE_RELATED_MATERIALS_BACKORDER,
      payload: relatedMaterialsBackorderList,
    });
  } catch (err) {
    yield put({ type: UPDATE_RELATED_MATERIALS_BACKORDER, payload: [] });
  }
}

// watchers

function* relatedMaterialsBackorderListWatcher() {
  yield takeLatest(
    GET_FULL_RELATED_MATERIALS_BACKORDER,
    getRelatedMaterialsBackorderListWorker,
  );
  yield takeLatest(
    ADD_NEW_RELATED_MATERIALS_BACKORDER,
    addNewRelatedMaterialsBackorderListWorker,
  );
  yield takeLatest(
    UPDATE_NEW_RELATED_MATERIALS_BACKORDER,
    updateNewRelatedMaterialsBackorderListWorker,
  );
}

export default relatedMaterialsBackorderListWatcher;
