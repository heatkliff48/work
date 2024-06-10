import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import showErrorMessage from '../../Utils/showErrorMessage';
import { setToken } from '../actions/jwtAction';
import { GET_ALL_CLIENTS, ALL_CLIENTS, NEW_CLIENTS } from '../types/clientsTypes';
import { ADD_NEW_PRODUCT } from '../types/productsTypes';

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

// function* getAccessTokenFromStore() {
//   const accessToken = yield select((state) => state.jwt);
//   return accessToken;
// }

// url.interceptors.request.use(
//   async (config) => {
//     const accessToken = await getAccessTokenFromStore().next().value;

//     if (accessToken) config.headers['Authorization'] = `Bearer ${accessToken}`;

//     return config;
//   },
//   (err) => Promise.reject(err)
// );

const getAllClients = (user) => {
  return url
    .post('/clients/all', { user })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewClient = ({ client, user }) => {
  return url
    .post('/clients/add', { client, user })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

function* getAllClientsWatcher(action) {
  try {
    const data = yield call(getAllClients, action.payload);

    yield put({ type: ALL_CLIENTS, payload: data.clients });
    yield put(setToken(data.accessToken, data.accessTokenExpiration));
  } catch (err) {
    yield put({ type: ALL_CLIENTS, payload: [] });
  }
}

function* addNewClientWatcher(action) {
  try {
    console.log(action.payload);
    const { clients, accessToken, accessTokenExpiration } = yield call(
      addNewClient,
      action.payload
    );
    console.log('FROM BACK', clients);
    yield put({ type: NEW_CLIENTS, payload: clients });
    yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: NEW_CLIENTS, payload: [] });
  }
}

function* clientsWatcher() {
  yield takeLatest(GET_ALL_CLIENTS, getAllClientsWatcher);
  yield takeLatest(ADD_NEW_PRODUCT, addNewClientWatcher);
}

export default clientsWatcher;
