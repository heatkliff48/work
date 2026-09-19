import { call, put, takeLatest } from 'redux-saga/effects';

import {
  ADD_USER,
  CHECK_USER,
  DEL_USER,
  GET_ADD_USER,
  GET_CHECK_USER,
  GET_DEL_USER,
  GET_LOGIN_USER,
} from '../types/userTypes';

import api, { getApiAccessToken } from '../../../api/axiosConfig.js';

import { deleteToken, setToken } from '../actions/jwtAction.js';

import showMessage from '../../Utils/showMessage';
import { errorToText } from '../../Utils/errorToText';

const addUserRequest = async (user) => {
  const response = await api.post('/auth/sign-up', {
    user,
  });

  return response.data;
};

const loginUserRequest = async (user) => {
  const response = await api.post('/auth/sign-in', {
    user,
  });

  return response.data;
};

const checkUserRequest = async () => {
  if (getApiAccessToken()) {
    try {
      const response = await api.post('/auth/check/user');
      return response.data;
    } catch (error) {
      if (error.response?.status !== 401) {
        throw error;
      }
    }
  }

  const response = await api.post('/auth/refresh');
  return response.data;
};

const logoutUserRequest = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

function* addUserWatcher(action) {
  try {
    const { user, accessToken, accessTokenExpiration } = yield call(
      addUserRequest,
      action.payload,
    );

    yield put(
      setToken({
        accessToken,
        accessTokenExpiration,
      }),
    );

    window.localStorage.setItem('user', JSON.stringify(user));

    yield put({
      type: ADD_USER,
      payload: user,
    });
  } catch (error) {
    showMessage(errorToText(error), 'error');

    window.localStorage.removeItem('user');

    yield put(deleteToken());

    yield put({
      type: ADD_USER,
      payload: null,
    });
  }
}

function* loginUserWatcher(action) {
  try {
    const { user, accessToken, accessTokenExpiration } = yield call(
      loginUserRequest,
      action.payload,
    );

    yield put(
      setToken({
        accessToken,
        accessTokenExpiration,
      }),
    );

    window.localStorage.setItem('user', JSON.stringify(user));

    yield put({
      type: ADD_USER,
      payload: user,
    });
  } catch (error) {
    showMessage(errorToText(error), 'error');

    window.localStorage.removeItem('user');

    yield put(deleteToken());

    yield put({
      type: ADD_USER,
      payload: null,
    });
  }
}

function* checkUserWatcher() {
  try {
    const { user, accessToken, accessTokenExpiration } =
      yield call(checkUserRequest);

    /*
     * /auth/check/user возвращает только пользователя.
     * /auth/refresh возвращает пользователя и новый токен.
     */
    if (accessToken) {
      yield put(
        setToken({
          accessToken,
          accessTokenExpiration,
        }),
      );
    }

    window.localStorage.setItem('user', JSON.stringify(user));

    yield put({
      type: CHECK_USER,
      payload: user,
    });
  } catch (error) {
    window.localStorage.removeItem('user');

    yield put(deleteToken());

    yield put({
      type: CHECK_USER,
      payload: null,
    });
  }
}

function* delUserWatcher() {
  try {
    yield call(logoutUserRequest);
  } catch (error) {
    showMessage(errorToText(error), 'error');
  } finally {
    window.localStorage.removeItem('user');

    yield put(deleteToken());

    yield put({
      type: DEL_USER,
      payload: null,
    });
  }
}

function* userWatcher() {
  yield takeLatest(GET_ADD_USER, addUserWatcher);
  yield takeLatest(GET_LOGIN_USER, loginUserWatcher);
  yield takeLatest(GET_CHECK_USER, checkUserWatcher);
  yield takeLatest(GET_DEL_USER, delUserWatcher);
}

export default userWatcher;
