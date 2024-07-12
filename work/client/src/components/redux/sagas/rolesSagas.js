import { put, call, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import showErrorMessage from '../../Utils/showErrorMessage';
import { setToken } from '../actions/jwtAction';
import {
  ALL_ROLES,
  GET_ALL_ROLES,
  NEED_UPDATE_ROLE,
  NEED_UPDATE_ROLE_ACTIVE,
  UPDATE_ROLE,
  UPDATE_ROLE_ACTIVE,
} from '../types/rolesTypes';

let accessTokenFront

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

url.interceptors.request.use(
  async (config) => {
    if (accessTokenFront) {
      config.headers['Authorization'] = `Bearer ${accessTokenFront}`;
    }

    console.log('Interceptor: Final config', config);
    return config;
  },
  (error) => {
    console.log('Interceptor: Request error', error);
    return Promise.reject(error);
  }
);

const getRoles = () => {
  return url
    .get('/roles')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const updateRole = ({ updRole }) => {
  return url
    .post('/roles/upd', { updRole })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const updateRoleActive = ({ updActiveRole }) => {
  return url
    .post('/roles/upd/active', { updActiveRole })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

function* getAllRolesWatcher() {
  try {
    accessTokenFront = yield select((state) => state.jwt);

    const { roles, accessToken, accessTokenExpiration } = yield call(getRoles);

    console.log('PAGES SAGA', roles);

    window.localStorage.setItem('jwt', accessToken);

    yield put(setToken({ accessToken, accessTokenExpiration }));
    yield put({ type: ALL_ROLES, payload: roles });
  } catch (err) {
    yield put({ type: ALL_ROLES, payload: [] });
  }
}

function* updateRolesWatcher(action) {
  try {
    accessTokenFront = yield select((state) => state.jwt);

    const { updRoleData, accessToken, accessTokenExpiration } = yield call(
      updateRole,
      action.payload
    );

    window.localStorage.setItem('jwt', accessToken);

    yield put({ type: UPDATE_ROLE, payload: updRoleData });
    yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: UPDATE_ROLE, payload: [] });
  }
}

function* updateRolesActiveWatcher(action) {
  try {
    accessTokenFront = yield select((state) => state.jwt);

    const { updActiveRoleData, accessToken, accessTokenExpiration } = yield call(
      updateRoleActive,
      action.payload
    );

    console.log('Role UPDATE active SAGA', updActiveRoleData);
    window.localStorage.setItem('jwt', accessToken);

    yield put({ type: UPDATE_ROLE_ACTIVE, payload: updActiveRoleData });
    yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: UPDATE_ROLE_ACTIVE, payload: [] });
  }
}

function* rolesWatcher() {
  yield takeLatest(GET_ALL_ROLES, getAllRolesWatcher);
  yield takeLatest(NEED_UPDATE_ROLE, updateRolesWatcher);
  yield takeLatest(NEED_UPDATE_ROLE_ACTIVE, updateRolesActiveWatcher);
}

export default rolesWatcher;
