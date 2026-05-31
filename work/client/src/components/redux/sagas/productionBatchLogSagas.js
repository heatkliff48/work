import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import showMessage from '../../Utils/showMessage';
import { errorToText } from '../../Utils/errorToText';

import {
  ALL_PRODUCTION_BATCH_LOGS,
  NEW_PRODUCTION_BATCH_LOG,
  UPDATE_PRODUCTION_BATCH_LOG,
  ADD_NEW_PRODUCTION_BATCH_LOG,
  GET_ALL_PRODUCTION_BATCH_LOGS,
  NEED_UPDATE_PRODUCTION_BATCH_LOG,
} from '../types/productionBatchLogTypes';

import { getApiUrl } from '#utils/getApiUrl.js';

const url = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
});

const getAllProductionBatchLogs = () => {
  return url
    .get('/productionBatchLog')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewProductionBatchLog = ({ productionBatchLog }) => {
  return url
    .post('/productionBatchLog', { productionBatchLog })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const updateProductionBatchLog = ({ productionBatchLog }) => {
  return url
    .post(`/productionBatchLog/update/${productionBatchLog.u_id}`, {
      productionBatchLog,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

// workers

function* getAllProductionBatchLogsWorker(action) {
  try {
    const { productionBatchLog } = yield call(getAllProductionBatchLogs);

    yield put({ type: ALL_PRODUCTION_BATCH_LOGS, payload: productionBatchLog });
  } catch (err) {
    yield put({ type: ALL_PRODUCTION_BATCH_LOGS, payload: [] });
  }
}

function* addNewProductionBatchLogWorker(action) {
  try {
    const { productionBatchLog } = yield call(
      addNewProductionBatchLog,
      action.payload,
    );

    yield put({ type: NEW_PRODUCTION_BATCH_LOG, payload: productionBatchLog });
  } catch (err) {
    yield put({ type: NEW_PRODUCTION_BATCH_LOG, payload: [] });
  }
}

function* updateProductionBatchLogWorker(action) {
  try {
    const { productionBatchLog } = yield call(
      updateProductionBatchLog,
      action.payload,
    );

    yield put({
      type: UPDATE_PRODUCTION_BATCH_LOG,
      payload: productionBatchLog,
    });
  } catch (err) {
    yield put({ type: UPDATE_PRODUCTION_BATCH_LOG, payload: [] });
  }
}

// watchers

function* productionBatchLogWatcher() {
  yield takeLatest(
    GET_ALL_PRODUCTION_BATCH_LOGS,
    getAllProductionBatchLogsWorker,
  );
  yield takeLatest(
    ADD_NEW_PRODUCTION_BATCH_LOG,
    addNewProductionBatchLogWorker,
  );
  yield takeLatest(
    NEED_UPDATE_PRODUCTION_BATCH_LOG,
    updateProductionBatchLogWorker,
  );
}

export default productionBatchLogWatcher;
