import showMessage from '../../Utils/showMessage';
import { errorToText } from '../../Utils/errorToText';
import {
  ADD_NEW_QUALITY_MANAGEMENT_DATA,
  DELETE_QUALITY_MANAGEMENT_DATA,
  FULL_QUALITY_MANAGEMENT_DATA,
  GET_FULL_QUALITY_MANAGEMENT_DATA,
  NEED_DELETE_QUALITY_MANAGEMENT_DATA,
  NEW_QUALITY_MANAGEMENT_DATA,
  UPDATE_QUALITY_MANAGEMENT_DATA,
  UPDATE_NEW_QUALITY_MANAGEMENT_DATA,
} from '../types/qualityManagementTypes';
import axios from 'axios';
import { put, call, takeLatest } from 'redux-saga/effects';

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

const getQualityManagement = () => {
  return url
    .get('/qualityManagement')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewQualityManagement = (qualityManagementData) => {
  return url
    .post('/qualityManagement', qualityManagementData)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const deleteQualityManagement = (qualityManagementDataID) => {
  return url
    .post('/qualityManagement/delete', { qualityManagementDataID })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const updateQualityManagement = (qualityManagementData) => {
  return url
    .post('/qualityManagement/update', qualityManagementData)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

function* getQualityManagementWorker(action) {
  try {
    const { qualityManagementData } = yield call(getQualityManagement);

    yield put({
      type: FULL_QUALITY_MANAGEMENT_DATA,
      payload: qualityManagementData,
    });
  } catch (err) {
    yield put({ type: FULL_QUALITY_MANAGEMENT_DATA, payload: [] });
  }
}

function* addNewQualityManagementWorker(action) {
  try {
    const { qualityManagementData } = yield call(
      addNewQualityManagement,
      action.payload
    );

    yield put({ type: NEW_QUALITY_MANAGEMENT_DATA, payload: qualityManagementData });
  } catch (err) {
    yield put({ type: NEW_QUALITY_MANAGEMENT_DATA, payload: [] });
  }
}

function* deleteQualityManagementWorker(action) {
  try {
    const { payload } = action;

    yield call(deleteQualityManagement, payload);

    yield put({ type: NEED_DELETE_QUALITY_MANAGEMENT_DATA, payload });
  } catch (err) {
    yield put({ type: NEED_DELETE_QUALITY_MANAGEMENT_DATA, payload: [] });
  }
}

function* updateQualityManagementWorker(action) {
  try {
    const { qualityManagement } = yield call(
      updateQualityManagement,
      action.payload
    );

    yield put({ type: UPDATE_QUALITY_MANAGEMENT_DATA, payload: qualityManagement });
  } catch (err) {
    yield put({ type: UPDATE_QUALITY_MANAGEMENT_DATA, payload: [] });
  }
}

// watchers

function* qualityManagementWatcher() {
  yield takeLatest(GET_FULL_QUALITY_MANAGEMENT_DATA, getQualityManagementWorker);
  yield takeLatest(ADD_NEW_QUALITY_MANAGEMENT_DATA, addNewQualityManagementWorker);
  yield takeLatest(DELETE_QUALITY_MANAGEMENT_DATA, deleteQualityManagementWorker);
  yield takeLatest(
    UPDATE_NEW_QUALITY_MANAGEMENT_DATA,
    updateQualityManagementWorker
  );
}

export default qualityManagementWatcher;
