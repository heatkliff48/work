import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import showMessage from '../../Utils/showMessage';
import { errorToText } from '../../Utils/errorToText';
import {
  ADD_NEW_ALDABARAN,
  ALL_ALDABARAN,
  GET_ALL_ALDABARAN,
} from '../types/aldabaranTypes';
import { NEW_ALDABARAN_SOCKET } from '../types/socketTypes/socket';

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

const getAldabaran = () => {
  return url
    .get('/aldabaran/all')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addAldabaran = (data) => {
  return url
    .post('/aldabaran/add', data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

function* getAllAldabaranWatcher() {
  try {
    const aldabaran = yield call(getAldabaran);

    yield put({ type: ALL_ALDABARAN, payload: aldabaran });
  } catch (err) {
    yield put({ type: ALL_ALDABARAN, payload: [] });
  }
}

function* addAldabaranWatcher(action) {
  try {
    const { payload } = action;
    yield call(addAldabaran, payload);
  } catch (err) {
    yield put({ type: NEW_ALDABARAN_SOCKET, payload: [] });
  }
}

function* aldabaranWatcher() {
  yield takeLatest(GET_ALL_ALDABARAN, getAllAldabaranWatcher);
  yield takeLatest(ADD_NEW_ALDABARAN, addAldabaranWatcher);
}

export default aldabaranWatcher;
