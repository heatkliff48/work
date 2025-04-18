import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import showErrorMessage from '../../Utils/showErrorMessage';
import { ALL_PAGES, GET_ALL_PAGES } from '../types/rolesTypes';

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

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
    const { pages } = yield call(getPagesList);

    yield put({ type: ALL_PAGES, payload: pages });
  } catch (err) {
    yield put({ type: ALL_PAGES, payload: [] });
  }
}

function* pagesWatcher() {
  yield takeLatest(GET_ALL_PAGES, getAllPagesWatcher);
}

export default pagesWatcher;
