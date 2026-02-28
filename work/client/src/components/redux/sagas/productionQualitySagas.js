import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import showMessage from '../../Utils/showMessage';
import { errorToText } from '../../Utils/errorToText';
import {
  ADD_NEW_PRODUCTION_QUALITY,
  ALL_PRODUCTION_QUALITY,
  GET_ALL_PRODUCTION_QUALITY,
  NEW_PRODUCTION_QUALITY,
} from '../types/productionQualityTypes';

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

const getProductionQuality = () => {
  return url
    .get('/productionQuality')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewProductionQuality = (data) => {
  return url
    .post('/productionQuality/add', data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

function* getAllProductionQualityWatcher() {
  try {
    const productions_quality = yield call(getProductionQuality);

    yield put({ type: ALL_PRODUCTION_QUALITY, payload: productions_quality });
  } catch (err) {
    yield put({ type: ALL_PRODUCTION_QUALITY, payload: [] });
  }
}

function* addNewProductionQualityWatcher(action) {
  try {
    yield call(addNewProductionQuality, action.payload);
  } catch (err) {
    yield put({ type: NEW_PRODUCTION_QUALITY, payload: [] });
  }
}

function* productionQualityWatcher() {
  yield takeLatest(GET_ALL_PRODUCTION_QUALITY, getAllProductionQualityWatcher);
  yield takeLatest(ADD_NEW_PRODUCTION_QUALITY, addNewProductionQualityWatcher);
}

export default productionQualityWatcher;
