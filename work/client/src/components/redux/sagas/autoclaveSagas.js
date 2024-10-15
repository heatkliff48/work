import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import showErrorMessage from '../../Utils/showErrorMessage';
import {
  GET_AUTOCLAVE,
  NEW_SAVE_AUTOCLAVE,
  SAVE_AUTOCLAVE,
  SET_AUTOCLAVE,
} from '../types/autoclaveTypes';

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

const getAutoclave = () => {
  return url
    .get('/autoclave')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const saveAutoclave = (autoclave) => {
  return url
    .post('/autoclave/save', autoclave)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

function* getAutoclaveWatcher(action) {
  try {
    const autoclave = yield call(getAutoclave, action.payload);

    yield put({ type: SET_AUTOCLAVE, payload: autoclave });
  } catch (err) {
    yield put({ type: SET_AUTOCLAVE, payload: null });
  }
}

function* saveAutoclaveWatcher(action) {
  try {
    yield call(saveAutoclave, action.payload);

    yield put({ type: NEW_SAVE_AUTOCLAVE, payload: action.payload });
  } catch (err) {
    yield put({ type: NEW_SAVE_AUTOCLAVE, payload: null });
  }
}

function* autoclaveWatcher() {
  yield takeLatest(GET_AUTOCLAVE, getAutoclaveWatcher);
  yield takeLatest(SAVE_AUTOCLAVE, saveAutoclaveWatcher);
}

export default autoclaveWatcher;
