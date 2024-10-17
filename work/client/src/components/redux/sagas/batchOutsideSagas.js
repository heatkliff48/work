import { put, call, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import showErrorMessage from '../../Utils/showErrorMessage';
import { setToken } from '../actions/jwtAction';
import {
  ADD_NEW_BATCH_OUTSIDE,
  FULL_BATCH_OUTSIDE,
  GET_FULL_BATCH_OUTSIDE,
  NEW_BATCH_OUTSIDE,
} from '../types/batchOutsideTypes';

// let accessTokenFront;

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

// url.interceptors.request.use(
//   async (config) => {
//     if (accessTokenFront) {
//       config.headers['Authorization'] = `Bearer ${accessTokenFront}`;
//     }
//     return config;
//   },
//   (error) => {
//     console.log('Interceptor: Request error', error);
//     return Promise.reject(error);
//   }
// );

const getBatchOutside = () => {
  return url
    .get('/batchOutside')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewBatchOutside = ({ batchOutside }) => {
  return url
    .post('/batchOutside', { batchOutside })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

// const updateBatchOutside = ({ batchOutside }) => {
//   return url
//     .post(`/batchOutside/update/${batchOutside.c_id}`, { batchOutside })
//     .then((res) => {
//       return res.data;
//     })
//     .catch(showErrorMessage);
// };

function* getBatchOutsideWorker(action) {
  try {
    // accessTokenFront = yield select((state) => state.jwt);
    // const { allClients, accessToken, accessTokenExpiration } = yield call(
    const { batchOutside } = yield call(getBatchOutside);

    // window.localStorage.setItem('jwt', accessToken);

    yield put({ type: FULL_BATCH_OUTSIDE, payload: batchOutside });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: FULL_BATCH_OUTSIDE, payload: [] });
  }
}

function* addNewBatchOutsideWorker(action) {
  try {
    // accessTokenFront = yield select((state) => state.jwt);

    // const { client, accessToken, accessTokenExpiration } = yield call(
    const { batchOutside } = yield call(addNewBatchOutside, action.payload);
    // window.localStorage.setItem('jwt', accessToken);

    yield put({ type: NEW_BATCH_OUTSIDE, payload: batchOutside });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: NEW_BATCH_OUTSIDE, payload: [] });
  }
}

// function* updateClientWorker(action) {
//   try {
//     // accessTokenFront = yield select((state) => state.jwt);

//     // const { client, accessToken, accessTokenExpiration } = yield call(
//     const { client } = yield call(updateClient, action.payload);
//     // window.localStorage.setItem('jwt', accessToken);

//     yield put({ type: UPDATE_CLIENT, payload: client });
//     // yield put(setToken(accessToken, accessTokenExpiration));
//   } catch (err) {
//     yield put({ type: UPDATE_CLIENT, payload: [] });
//   }
// }

// watchers

function* batchOutsideWatcher() {
  yield takeLatest(GET_FULL_BATCH_OUTSIDE, getBatchOutsideWorker);
  yield takeLatest(ADD_NEW_BATCH_OUTSIDE, addNewBatchOutsideWorker);
}

export default batchOutsideWatcher;
