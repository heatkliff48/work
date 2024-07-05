import { put, call, takeLatest } from 'redux-saga/effects';
import {
  ADD_USER,
  DEL_USER,
  GET_ADD_USER,
  GET_DEL_USER,
  GET_LOGIN_USER,
} from '../types/userTypes';
import axios from 'axios';
import showErrorMessage from '../../Utils/showErrorMessage';
import { deleteToken, setToken } from '../actions/jwtAction';

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

const addUser = (user) => {
  return url
    .post('/auth/sign-up', { user })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};
const loginUser = (user) => {
  return url
    .post('/auth/sign-in', { user })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};
const delUser = () => {
  return url.post('/auth/logout').catch(showErrorMessage);
};

function* addUserWatcher(action) {
  console.log("USER WATCHER", action);
  try {
    const { user, accessToken, accessTokenExpiration } = yield call(
      addUser,
      action.payload
    );
    console.log('USER SAGA', user);
    window.localStorage.setItem('user', JSON.stringify(user));
    window.localStorage.setItem('jwt', accessToken);
    yield put(setToken({ accessToken, accessTokenExpiration }));
    yield put({ type: ADD_USER, payload: user });
  } catch (err) {
    yield put({ type: ADD_USER, payload: null });
  }
}

function* loginUserWatcher(action) {
  try {
    const { user, accessToken, accessTokenExpiration } = yield call(
      loginUser,
      action.payload
    );
    console.log('USER SAGA', user);
    window.localStorage.setItem('user', JSON.stringify(user));
    window.localStorage.setItem('jwt', accessToken);
  
    yield put({ type: ADD_USER, payload: user });
    yield put(setToken({ accessToken, accessTokenExpiration }));
  } catch (err) {
    yield put({ type: ADD_USER, payload: null });
  }
}

function* delUserWatcher() {
  try {
    yield call(delUser);
    yield put({ type: DEL_USER, payload: null });
    yield put(deleteToken());
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
