import showErrorMessage from '../../Utils/showErrorMessage';
import { setToken } from '../actions/jwtAction';
import axios from 'axios';
import { put, call, takeLatest, select } from 'redux-saga/effects';
import {
  ADD_NEW_DRY_MIXES_JOURNAL,
  ADD_NEW_RELATED_MATERIALS_JOURNAL,
  FULL_DRY_MIXES_JOURNAL,
  FULL_RELATED_MATERIALS_JOURNAL,
  GET_FULL_DRY_MIXES_JOURNAL,
  GET_FULL_RELATED_MATERIALS_JOURNAL,
  NEW_DRY_MIXES_JOURNAL,
  NEW_RELATED_MATERIALS_JOURNAL,
} from '../types/productsTypeJournalTypes';

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

const getDryMixesJournal = () => {
  return url
    .get('/dryMixesJournal')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewDryMixesJournal = (dryMixesJournal) => {
  return url
    .post('/dryMixesJournal', dryMixesJournal)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const getRelatedMaterialsJournal = () => {
  return url
    .get('/relatedMaterialsJournal')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewRelatedMaterialsJournal = (relatedMaterialsJournal) => {
  return url
    .post('/relatedMaterialsJournal', relatedMaterialsJournal)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

function* getDryMixesJournalWorker(action) {
  try {
    // accessTokenFront = yield select((state) => state.jwt);
    // const { allClients, accessToken, accessTokenExpiration } = yield call(
    const { dryMixesJournal } = yield call(getDryMixesJournal);

    // window.localStorage.setItem('jwt', accessToken);

    yield put({ type: FULL_DRY_MIXES_JOURNAL, payload: dryMixesJournal });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: FULL_DRY_MIXES_JOURNAL, payload: [] });
  }
}

function* addNewDryMixesJournalWorker(action) {
  try {
    // accessTokenFront = yield select((state) => state.jwt);

    // const { client, accessToken, accessTokenExpiration } = yield call(
    const { dryMixesJournal } = yield call(addNewDryMixesJournal, action.payload);
    // window.localStorage.setItem('jwt', accessToken);

    yield put({ type: NEW_DRY_MIXES_JOURNAL, payload: dryMixesJournal });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: NEW_DRY_MIXES_JOURNAL, payload: [] });
  }
}

function* getRelatedMaterialsJournalWorker(action) {
  try {
    // accessTokenFront = yield select((state) => state.jwt);
    // const { allClients, accessToken, accessTokenExpiration } = yield call(
    const { relatedMaterialsJournal } = yield call(getRelatedMaterialsJournal);

    // window.localStorage.setItem('jwt', accessToken);

    yield put({
      type: FULL_RELATED_MATERIALS_JOURNAL,
      payload: relatedMaterialsJournal,
    });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: FULL_RELATED_MATERIALS_JOURNAL, payload: [] });
  }
}

function* addNewRelatedMaterialsJournalWorker(action) {
  try {
    // accessTokenFront = yield select((state) => state.jwt);

    // const { client, accessToken, accessTokenExpiration } = yield call(
    const { relatedMaterialsJournal } = yield call(
      addNewRelatedMaterialsJournal,
      action.payload
    );
    // window.localStorage.setItem('jwt', accessToken);

    yield put({
      type: NEW_RELATED_MATERIALS_JOURNAL,
      payload: relatedMaterialsJournal,
    });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: NEW_RELATED_MATERIALS_JOURNAL, payload: [] });
  }
}

// watchers

function* productsTypeJournalWatcher() {
  yield takeLatest(GET_FULL_DRY_MIXES_JOURNAL, getDryMixesJournalWorker);
  yield takeLatest(ADD_NEW_DRY_MIXES_JOURNAL, addNewDryMixesJournalWorker);
  yield takeLatest(
    GET_FULL_RELATED_MATERIALS_JOURNAL,
    getRelatedMaterialsJournalWorker
  );
  yield takeLatest(
    ADD_NEW_RELATED_MATERIALS_JOURNAL,
    addNewRelatedMaterialsJournalWorker
  );
}

export default productsTypeJournalWatcher;
