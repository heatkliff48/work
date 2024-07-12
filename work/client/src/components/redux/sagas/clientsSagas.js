import { put, call, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import showErrorMessage from '../../Utils/showErrorMessage';
import { setToken } from '../actions/jwtAction';
import {
  GET_ALL_CLIENTS,
  ALL_CLIENTS,
  NEW_CLIENTS,
  ADD_NEW_CLIENTS,
} from '../types/clientsTypes';

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

const getAllClients = () => {
  return url
    .get('/clients/all')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewClient = ({ client }) => {
  return url
    .post('/clients/add', { client })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

function* getAllClientsWatcher(action) {
  try {
    accessTokenFront = yield select(state => state.jwt);
    const { clients, accessToken, accessTokenExpiration } = yield call(
      getAllClients
    );

    window.localStorage.setItem('jwt', accessToken);

    yield put({ type: ALL_CLIENTS, payload: clients });
    yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: ALL_CLIENTS, payload: [] });
  }
}

function* addNewClientWatcher(action) {
  try {
    accessTokenFront = yield select(state => state.jwt);

    const { clients, accessToken, accessTokenExpiration } = yield call(
      addNewClient,
      action.payload
    );

    window.localStorage.setItem('jwt', accessToken);

    yield put({ type: NEW_CLIENTS, payload: clients });
    yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: NEW_CLIENTS, payload: [] });
  }
}

function* clientsWatcher() {
  yield takeLatest(GET_ALL_CLIENTS, getAllClientsWatcher);
  yield takeLatest(ADD_NEW_CLIENTS, addNewClientWatcher);
}

export default clientsWatcher;
