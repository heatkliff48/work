import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import showErrorMessage from '../../Utils/showErrorMessage';
import { ADD_NEW_ALDABARAN, ALL_ALDABARAN, GET_ALL_ALDABARAN, NEW_ALDABARAN } from '../types/aldabaranTypes';

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
    .catch(showErrorMessage);
};

const addAldabaran = (data) => {
  return url
    .post('/aldabaran/add', data)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
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
    yield put({ type: NEW_ALDABARAN, payload: [] });
  }
}

function* aldabaranWatcher() {
  yield takeLatest(GET_ALL_ALDABARAN, getAllAldabaranWatcher);
  yield takeLatest(ADD_NEW_ALDABARAN, addAldabaranWatcher);
}

export default aldabaranWatcher;
