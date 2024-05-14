import { put, call, takeLatest } from 'redux-saga/effects';
import {
  ADD_USER,
  CHECK_USER,
  DEL_USER,
  GET_ADD_USER,
  GET_CHECK_USER,
  GET_DEL_USER,
  GET_LOGIN_USER,
} from '../types/userTypes';
import axios from 'axios';
const url = process.env.REACT_APP_URL;

const addUser = (user) => {
  return axios.post(`${url}/user/reg`, { user }).then((res) => res.data);
};
const loginUser = (user) => {
  return axios.post(`${url}/user/login`, { user }).then((res) => res.data);
};
const delUser = () => {
  return axios(`${url}/user/logout`).then((res) => res.data);
};
const checkUser = () => {
  console.log("check");
  return axios(`${url}/user/check`).then((res) => res.data);
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

function* checkUserWatcher() {
  try {
    const user = yield call(checkUser);
    yield put({ type: CHECK_USER, payload: user || null });
  } catch (err) {
    console.log('check', Error(err));
    yield put({ type: CHECK_USER, payload: null });
  }
}

function* userWatcher() {
  yield takeLatest(GET_ADD_USER, addUserWatcher);
  yield takeLatest(GET_LOGIN_USER, loginUserWatcher);
  yield takeLatest(GET_DEL_USER, delUserWatcher);
  yield takeLatest(GET_CHECK_USER, checkUserWatcher);
}

export default userWatcher;
