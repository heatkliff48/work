import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import showErrorMessage from '../../Utils/showErrorMessage';
import { setToken } from '../actions/jwtAction';
import {
  ALL_ROLES,
  GET_ALL_ROLES,
  NEED_UPDATE_ROLE,
  UPDATE_ROLE,
} from '../types/rolesTypes';

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

url.interceptors.request.use(
  async (config) => {
    const accessToken = window.localStorage.getItem('jwt');

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
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

function* getAllRolesWatcher() {
  try {
    const { roles, accessToken, accessTokenExpiration } = yield call(
      getRoles,
    );

    console.log("PAGES SAGA", roles);

    window.localStorage.setItem('jwt', accessToken);

    yield put(setToken({ accessToken, accessTokenExpiration }));
    yield put({ type: ALL_ROLES, payload: roles });
  } catch (err) {
    yield put({ type: ALL_ROLES, payload: [] });
  }
}

function* updateRolesWatcher(action) {
  try {
    const { updRoleData, accessToken, accessTokenExpiration } = yield call(
      updateRole,
      action.payload
    );

    console.log('Role UPDATE SAGA', updRoleData);
    window.localStorage.setItem('jwt', accessToken);

    yield put({ type: UPDATE_ROLE, payload: updRoleData });
    yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: UPDATE_ROLE, payload: [] });
  }
}

function* rolesWatcher() {
  yield takeLatest(GET_ALL_ROLES, getAllRolesWatcher);
  yield takeLatest(NEED_UPDATE_ROLE, updateRolesWatcher);
}

export default rolesWatcher;
