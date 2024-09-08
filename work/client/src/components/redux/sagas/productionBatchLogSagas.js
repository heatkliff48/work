import { put, call, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import showErrorMessage from '../../Utils/showErrorMessage';
// import { setToken } from '../actions/jwtAction';
import {
  ALL_PRODUCTION_BATCH_LOGS,
  NEW_PRODUCTION_BATCH_LOG,
  UPDATE_PRODUCTION_BATCH_LOG,
  ADD_NEW_PRODUCTION_BATCH_LOG,
  GET_ALL_PRODUCTION_BATCH_LOGS,
  NEED_UPDATE_PRODUCTION_BATCH_LOG,
} from '../types/productionBatchLogTypes';

// let accessTokenFront;

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

// url.interceptors.request.use(
//   async (config) => {
//     if (accessTokenFront) {
//       config.headers['Authorization'] = `Bearer ${accessTokenFront}`;
//     }
//     return config;
//   },
//   (error) => {
//     console.log('Interceptor: Request error', error);
//     return Promise.reject(error);
//   }
// );

const getAllProductionBatchLogs = () => {
  return url
    .get('/productionBatchLog')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewProductionBatchLog = ({ productionBatchLog }) => {
  return url
    .post('/productionBatchLog', { productionBatchLog })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const updateProductionBatchLog = ({ productionBatchLog }) => {
  return url
    .post(`/productionBatchLog/update/${productionBatchLog.u_id}`, {
      productionBatchLog,
    })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

// workers

function* getAllProductionBatchLogsWorker(action) {
  try {
    // accessTokenFront = yield select((state) => state.jwt);
    // const { productionBatchLog, accessToken, accessTokenExpiration } = yield call(
    const { productionBatchLog } = yield call(getAllProductionBatchLogs);

    // window.localStorage.setItem('jwt', accessToken);

    yield put({ type: ALL_PRODUCTION_BATCH_LOGS, payload: productionBatchLog });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: ALL_PRODUCTION_BATCH_LOGS, payload: [] });
  }
}

function* addNewProductionBatchLogWorker(action) {
  try {
    // accessTokenFront = yield select((state) => state.jwt);

    // const { productionBatchLog, accessToken, accessTokenExpiration } = yield call(
    const { productionBatchLog } = yield call(
      addNewProductionBatchLog,
      action.payload
    );
    // window.localStorage.setItem('jwt', accessToken);

    yield put({ type: NEW_PRODUCTION_BATCH_LOG, payload: productionBatchLog });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: NEW_PRODUCTION_BATCH_LOG, payload: [] });
  }
}

function* updateProductionBatchLogWorker(action) {
  try {
    // accessTokenFront = yield select((state) => state.jwt);

    // const { productionBatchLog, accessToken, accessTokenExpiration } = yield call(
    const { productionBatchLog } = yield call(
      updateProductionBatchLog,
      action.payload
    );
    // window.localStorage.setItem('jwt', accessToken);

    yield put({ type: UPDATE_PRODUCTION_BATCH_LOG, payload: productionBatchLog });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: UPDATE_PRODUCTION_BATCH_LOG, payload: [] });
  }
}

// watchers

function* productionBatchLogWatcher() {
  yield takeLatest(GET_ALL_PRODUCTION_BATCH_LOGS, getAllProductionBatchLogsWorker);
  yield takeLatest(ADD_NEW_PRODUCTION_BATCH_LOG, addNewProductionBatchLogWorker);
  yield takeLatest(NEED_UPDATE_PRODUCTION_BATCH_LOG, updateProductionBatchLogWorker);
}

export default productionBatchLogWatcher;
