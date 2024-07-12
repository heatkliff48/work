import { put, call, takeLatest, select } from 'redux-saga/effects';
import {
  ADD_USER,
  GET_CHECK_USER,
  DEL_USER,
  GET_ADD_USER,
  GET_DEL_USER,
  GET_LOGIN_USER,
  CHECK_USER,
} from '../types/userTypes';
import axios from 'axios';
import showErrorMessage from '../../Utils/showErrorMessage';
import { deleteToken, setToken } from '../actions/jwtAction';

let accessTokenFront;

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

url.interceptors.request.use(
  async (config) => {
    // Проверяем, является ли текущий запрос запросом checkUser
    const isCheckUserRequest =
      config.url === '/auth/check/user' && config.method === 'post';

    if (isCheckUserRequest && accessTokenFront) {
      config.headers['Authorization'] = `Bearer ${accessTokenFront}`;
    }
    return config;
  },
  (error) => {
    console.log('Interceptor: Request error', error);
    return Promise.reject(error);
  }
);

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

const checkUser = () => {
  return url
    .post('/auth/check/user')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const delUser = () => {
  return url.post('/auth/logout').catch(showErrorMessage);
};

function* addUserWatcher(action) {
  accessTokenFront = yield select((state) => state.jwt);

  try {
    const { user, accessToken, accessTokenExpiration } = yield call(
      addUser,
      action.payload
    );

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
    accessTokenFront = yield select((state) => state.jwt);

    const { user, accessToken, accessTokenExpiration } = yield call(
      loginUser,
      action.payload
    );

    window.localStorage.setItem('user', JSON.stringify(user));
    window.localStorage.setItem('jwt', accessToken);

    yield put({ type: ADD_USER, payload: user });
    yield put(setToken({ accessToken, accessTokenExpiration }));
  } catch (err) {
    yield put({ type: ADD_USER, payload: null });
  }
}

function* checkUserWatcher(action) {
  try {
    accessTokenFront = yield select((state) => state.jwt);

    const { user, accessToken, accessTokenExpiration } = yield call(checkUser);

    window.localStorage.setItem('user', JSON.stringify(user));
    window.localStorage.setItem('jwt', accessToken);

    yield put({ type: CHECK_USER, payload: user });
    yield put(setToken({ accessToken, accessTokenExpiration }));
  } catch (err) {
    yield put({ type: CHECK_USER, payload: null });
  }
}

function* delUserWatcher() {
  try {
    accessTokenFront = yield select((state) => state.jwt);

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
  yield takeLatest(GET_CHECK_USER, checkUserWatcher);
  yield takeLatest(GET_DEL_USER, delUserWatcher);
}

export default userWatcher;
