import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import showErrorMessage from '../../Utils/showErrorMessage';
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

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

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
    const { allUsersInfo } = yield call(getAllUsersInfo);

    yield put({ type: ALL_USERS_INFO, payload: allUsersInfo });
  } catch (err) {
    yield put({ type: ALL_USERS_INFO, payload: [] });
  }
}

function* addNewUsersInfoWorker(action) {
  try {
    const { usersInfo } = yield call(addNewUsersInfo, action.payload);

    yield put({ type: NEW_USERS_INFO, payload: usersInfo });
  } catch (err) {
    yield put({ type: NEW_USERS_INFO, payload: [] });
  }
}

function* updateUsersInfoWorker(action) {
  try {
    const { usersInfo } = yield call(updateUsersInfo, action.payload);

    yield put({ type: UPDATE_USERS_INFO, payload: usersInfo });
  } catch (err) {
    yield put({ type: UPDATE_USERS_INFO, payload: [] });
  }
}

function* getAllUsersMainInfoWorker(action) {
  try {
    const { allUsersMainInfo } = yield call(getAllUsersMainInfo, action.payload);

    yield put({ type: ALL_USERS_MAIN_INFO, payload: allUsersMainInfo });
  } catch (err) {
    yield put({ type: ALL_USERS_MAIN_INFO, payload: [] });
  }
}

function* addNewUsersMainInfoWorker(action) {
  try {
    const { usersMainInfo } = yield call(addNewUsersMainInfo, action.payload);

    yield put({ type: NEW_USERS_MAIN_INFO, payload: usersMainInfo });
  } catch (err) {
    yield put({ type: NEW_USERS_MAIN_INFO, payload: [] });
  }
}

function* updateUsersMainInfoWorker(action) {
  try {
    const { usersMainInfo } = yield call(updateUsersMainInfo, action.payload);

    yield put({ type: UPDATE_USERS_MAIN_INFO, payload: usersMainInfo });
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
