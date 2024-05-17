import { put, call, takeLatest } from 'redux-saga/effects';
import {
  ADD_USER,
  DEL_USER,
  GET_ADD_USER,
  GET_DEL_USER,
  GET_LOGIN_USER,
} from '../types/userTypes';
import axios from 'axios';

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

const addUser = (user) => {
  return url.post('/auth/sign-up', { user }).then((res) => res.data);
};
const loginUser = (user) => {
  return url.post('/sign-in', { user }).then((res) => res.data);
};
const delUser = () => {
  return url('/logout').then((res) => res.data);
};

function* addUserWatcher(action) {
  try {
    const user = yield call(addUser, action.payload);
    window.localStorage.setItem('user', JSON.stringify(user));
    yield put({ type: ADD_USER, payload: user });
  } catch (err) {
    yield put({ type: ADD_USER, payload: null });
  }
}

function* loginUserWatcher(action) {
  try {
    const user = yield call(loginUser, action.payload);
    yield put({ type: ADD_USER, payload: user });
  } catch (err) {
    yield put({ type: ADD_USER, payload: null });
  }
}

function* delUserWatcher() {
  try {
    yield call(delUser);

    yield put({ type: DEL_USER, payload: null });
  } catch (err) {
    yield put({ type: DEL_USER, payload: null });
  }
}

function* userWatcher() {
  yield takeLatest(GET_ADD_USER, addUserWatcher);
  yield takeLatest(GET_LOGIN_USER, loginUserWatcher);
  yield takeLatest(GET_DEL_USER, delUserWatcher);
}

export default userWatcher;
