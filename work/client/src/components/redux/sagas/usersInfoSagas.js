import { put, call, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import showErrorMessage from '../../Utils/showErrorMessage';
import { setToken } from '../actions/jwtAction';
import {
  GET_ALL_USERS_INFO,
  ADD_NEW_USERS_INFO,
  NEED_UPDATE_USERS_INFO,
  GET_ALL_USERS_MAIN_INFO,
  ADD_NEW_USERS_MAIN_INFO,
  NEED_UPDATE_USERS_MAIN_INFO,
  ALL_USERS_INFO,
  NEW_USERS_INFO,
  UPDATE_USERS_INFO,
  ALL_USERS_MAIN_INFO,
  NEW_USERS_MAIN_INFO,
  UPDATE_USERS_MAIN_INFO,
} from '../types/usersInfoTypes';

let accessTokenFront;

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

url.interceptors.request.use(
  async (config) => {
    if (accessTokenFront) {
      config.headers['Authorization'] = `Bearer ${accessTokenFront}`;
    }
    return config;
  },
  (error) => {
    console.log('Interceptor: Request error', error);
    return Promise.reject(error);
  }
);

const getAllUsersInfo = () => {
  return url
    .get('/usersInfo')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewUsersInfo = ({ usersInfo }) => {
  return url
    .post('/usersInfo', { usersInfo })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const updateUsersInfo = ({ usersInfo }) => {
  return url
    .post(`/usersInfo/update/${usersInfo.u_id}`, { usersInfo })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const getAllUsersMainInfo = () => {
  return url
    .get(`/usersMainInfo`)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewUsersMainInfo = ({ usersMainInfo }) => {
  return url
    .post('/usersMainInfo', { usersMainInfo })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const updateUsersMainInfo = ({ usersMainInfo }) => {
  return url
    .post(`/usersMainInfo/update/${usersMainInfo.u_id}`, { usersMainInfo })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

// workers

function* getAllUsersInfoWorker(action) {
  try {
    accessTokenFront = yield select((state) => state.jwt);
    const { allUsersInfo, accessToken, accessTokenExpiration } = yield call(
      getAllUsersInfo
    );

    window.localStorage.setItem('jwt', accessToken);

    yield put({ type: ALL_USERS_INFO, payload: allUsersInfo });
    yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: ALL_USERS_INFO, payload: [] });
  }
}

function* addNewUsersInfoWorker(action) {
  try {
    accessTokenFront = yield select((state) => state.jwt);

    const { usersInfo, accessToken, accessTokenExpiration } = yield call(
      addNewUsersInfo,
      action.payload
    );
    window.localStorage.setItem('jwt', accessToken);

    yield put({ type: NEW_USERS_INFO, payload: usersInfo });
    yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: NEW_USERS_INFO, payload: [] });
  }
}

function* updateUsersInfoWorker(action) {
  try {
    accessTokenFront = yield select((state) => state.jwt);

    const { usersInfo, accessToken, accessTokenExpiration } = yield call(
      updateUsersInfo,
      action.payload
    );
    window.localStorage.setItem('jwt', accessToken);

    yield put({ type: UPDATE_USERS_INFO, payload: usersInfo });
    yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: UPDATE_USERS_INFO, payload: [] });
  }
}

function* getAllUsersMainInfoWorker(action) {
  try {
    accessTokenFront = yield select((state) => state.jwt);

    const { allUsersMainInfo, accessToken, accessTokenExpiration } = yield call(
      getAllUsersMainInfo,
      action.payload
    );

    window.localStorage.setItem('jwt', accessToken);

    yield put({ type: ALL_USERS_MAIN_INFO, payload: allUsersMainInfo });
    yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: ALL_USERS_MAIN_INFO, payload: [] });
  }
}

function* addNewUsersMainInfoWorker(action) {
  try {
    accessTokenFront = yield select((state) => state.jwt);

    const { usersMainInfo, accessToken, accessTokenExpiration } = yield call(
      addNewUsersMainInfo,
      action.payload
    );
    window.localStorage.setItem('jwt', accessToken);

    yield put({ type: NEW_USERS_MAIN_INFO, payload: usersMainInfo });
    yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: NEW_USERS_MAIN_INFO, payload: [] });
  }
}

function* updateUsersMainInfoWorker(action) {
  try {
    accessTokenFront = yield select((state) => state.jwt);

    const { usersMainInfo, accessToken, accessTokenExpiration } = yield call(
      updateUsersMainInfo,
      action.payload
    );
    window.localStorage.setItem('jwt', accessToken);

    yield put({ type: UPDATE_USERS_MAIN_INFO, payload: usersMainInfo });
    yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: UPDATE_USERS_MAIN_INFO, payload: [] });
  }
}

// watchers

function* usersInfoWatcher() {
  yield takeLatest(GET_ALL_USERS_INFO, getAllUsersInfoWorker);
  yield takeLatest(ADD_NEW_USERS_INFO, addNewUsersInfoWorker);
  yield takeLatest(NEED_UPDATE_USERS_INFO, updateUsersInfoWorker);

  yield takeLatest(GET_ALL_USERS_MAIN_INFO, getAllUsersMainInfoWorker);
  yield takeLatest(ADD_NEW_USERS_MAIN_INFO, addNewUsersMainInfoWorker);
  yield takeLatest(NEED_UPDATE_USERS_MAIN_INFO, updateUsersMainInfoWorker);
}

export default usersInfoWatcher;
