import { put, call, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import showErrorMessage from '../../Utils/showErrorMessage';
import { setToken } from '../actions/jwtAction';
import {
  ADD_NEW_WAREHOUSE,
  ALL_WAREHOUSE,
  GET_ALL_WAREHOUSE,
  NEW_WAREHOUSE,
} from '../types/warehouseTypes';

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

const getAllWarehouse = () => {
  return url
    .get('/warehouse')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewWarehouse = (new_warehouse) => {
  return url
    .post('/warehouse/add', new_warehouse)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

function* getAllWarehouseWatcher() {
  try {
    accessTokenFront = yield select((state) => state.jwt);

    const { warehouse, accessToken, accessTokenExpiration } = yield call(
      getAllWarehouse
    );

    window.localStorage.setItem('jwt', accessToken);

    yield put(setToken({ accessToken, accessTokenExpiration }));
    yield put({ type: ALL_WAREHOUSE, payload: warehouse });
  } catch (err) {
    yield put({ type: ALL_WAREHOUSE, payload: [] });
  }
}

function* addNewWarehouseWatcher(action) {
  try {
    accessTokenFront = yield select((state) => state.jwt);

    const { new_warehouse, accessToken, accessTokenExpiration } = yield call(
      addNewWarehouse,
      action.payload
    );

    window.localStorage.setItem('jwt', accessToken);

    yield put({ type: NEW_WAREHOUSE, payload: new_warehouse });
    yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: NEW_WAREHOUSE, payload: [] });
  }
}

function* warehouseWatcher() {
  yield takeLatest(GET_ALL_WAREHOUSE, getAllWarehouseWatcher);
  yield takeLatest(ADD_NEW_WAREHOUSE, addNewWarehouseWatcher);
}

export default warehouseWatcher;
