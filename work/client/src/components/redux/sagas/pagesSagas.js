import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import showErrorMessage from '../../Utils/showErrorMessage';
import { setToken } from '../actions/jwtAction';
import { ALL_PAGES, GET_ALL_PAGES } from '../types/rolesTypes';

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
