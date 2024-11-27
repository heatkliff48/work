import { put, call, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import showErrorMessage from '../../Utils/showErrorMessage';
import { setToken } from '../actions/jwtAction';
import {
  ADD_NEW_BATCH_OUTSIDE,
  DELETE_BATCH_OUTSIDE,
  FULL_BATCH_OUTSIDE,
  GET_FULL_BATCH_OUTSIDE,
  NEED_DELETE_BATCH_OUTSIDE,
  NEW_BATCH_OUTSIDE,
  UPDATE_BATCH_OUTSIDE,
  UPDATE_NEW_BATCH_OUTSIDE,
} from '../types/batchOutsideTypes';

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

const getBatchOutside = () => {
  return url
    .get('/batchOutside')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewBatchOutside = (batchOutside) => {
  return url
    .post('/batchOutside', batchOutside)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const deleteBatchOutside = (batch_id) => {
  return url
    .post('/batchOutside/delete', { batch_id })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const updateBatchOutside = (batchOutside) => {
  return url
    .post(`/batchOutside/update/${batchOutside.id}`, batchOutside)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

function* getBatchOutsideWorker(action) {
  try {
    // accessTokenFront = yield select((state) => state.jwt);
    // const { allClients, accessToken, accessTokenExpiration } = yield call(
    const { batchOutside } = yield call(getBatchOutside);

    // window.localStorage.setItem('jwt', accessToken);

    yield put({ type: FULL_BATCH_OUTSIDE, payload: batchOutside });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: FULL_BATCH_OUTSIDE, payload: [] });
  }
}

function* addNewBatchOutsideWorker(action) {
  try {
    // accessTokenFront = yield select((state) => state.jwt);

    // const { client, accessToken, accessTokenExpiration } = yield call(
    const { batchOutside } = yield call(addNewBatchOutside, action.payload);
    // window.localStorage.setItem('jwt', accessToken);

    yield put({ type: NEW_BATCH_OUTSIDE, payload: batchOutside });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: NEW_BATCH_OUTSIDE, payload: [] });
  }
}

function* deleteBatchOutsideWorker(action) {
  try {
    // accessTokenFront = yield select((state) => state.jwt);
    const { payload } = action;

    // const { client, accessToken, accessTokenExpiration } = yield call(
    yield call(deleteBatchOutside, payload);
    // window.localStorage.setItem('jwt', accessToken);

    yield put({ type: NEED_DELETE_BATCH_OUTSIDE, payload });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: NEED_DELETE_BATCH_OUTSIDE, payload: [] });
  }
}

function* updateClientWorker(action) {
  try {
    const { batchOutside } = yield call(updateBatchOutside, action.payload);

    yield put({ type: UPDATE_BATCH_OUTSIDE, payload: batchOutside });
  } catch (err) {
    yield put({ type: UPDATE_BATCH_OUTSIDE, payload: [] });
  }
}

// watchers

function* batchOutsideWatcher() {
  yield takeLatest(GET_FULL_BATCH_OUTSIDE, getBatchOutsideWorker);
  yield takeLatest(ADD_NEW_BATCH_OUTSIDE, addNewBatchOutsideWorker);
  yield takeLatest(DELETE_BATCH_OUTSIDE, deleteBatchOutsideWorker);
  yield takeLatest(UPDATE_NEW_BATCH_OUTSIDE, updateClientWorker);
}

export default batchOutsideWatcher;
