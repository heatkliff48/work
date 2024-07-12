import { put, call, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import showErrorMessage from '../../Utils/showErrorMessage';
import { setToken } from '../actions/jwtAction';
import { ALL_PAGES, GET_ALL_PAGES } from '../types/rolesTypes';

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

const getPagesList = () => {
  return url
    .get('/roles/pages')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

function* getAllPagesWatcher() {
  try {
    accessTokenFront = yield select(state => state.jwt);
    const { pages, accessToken, accessTokenExpiration } = yield call(
      getPagesList,
    );

    console.log("PAGES SAGA", pages);

    window.localStorage.setItem('jwt', accessToken);
    yield put(setToken({ accessToken, accessTokenExpiration }));
    yield put({ type: ALL_PAGES, payload: pages });
  } catch (err) {
    yield put({ type: ALL_PAGES, payload: [] });
  }
}

function* pagesWatcher() {
  yield takeLatest(GET_ALL_PAGES, getAllPagesWatcher);
}

export default pagesWatcher;
