import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import showMessage from '../../Utils/showMessage';
import { errorToText } from '../../Utils/errorToText';
import {
  ALL_ROLES,
  GET_ALL_ROLES,
  NEED_UPDATE_ROLE,
  NEED_UPDATE_ROLE_ACTIVE,
  UPDATE_ROLE,
  UPDATE_ROLE_ACTIVE,
} from '../types/rolesTypes';

import { getApiUrl } from '#utils/getApiUrl.js';

const url = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
});

const getRoles = () => {
  return url
    .get('/roles')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const updateRole = ({ updRole }) => {
  return url
    .post('/roles/upd', { updRole })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const updateRoleActive = ({ updActiveRole }) => {
  return url
    .post('/roles/upd/active', { updActiveRole })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

function* getAllRolesWatcher() {
  try {
    const { roles } = yield call(getRoles);

    yield put({ type: ALL_ROLES, payload: roles });
  } catch (err) {
    yield put({ type: ALL_ROLES, payload: [] });
  }
}

function* updateRolesWatcher(action) {
  try {
    yield call(updateRole, action.payload);
  } catch (err) {
    yield put({ type: UPDATE_ROLE, payload: [] });
  }
}

function* updateRolesActiveWatcher(action) {
  try {
    yield call(updateRoleActive, action.payload);
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
