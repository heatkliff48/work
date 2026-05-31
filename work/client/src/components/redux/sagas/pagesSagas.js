import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import showMessage from '../../Utils/showMessage';
import { errorToText } from '../../Utils/errorToText';
import { ALL_PAGES, GET_ALL_PAGES } from '../types/rolesTypes';

import { getApiUrl } from '#utils/getApiUrl.js';

const url = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
});

const getPagesList = () => {
  return url
    .get('/roles/pages')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
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
