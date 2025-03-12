import showErrorMessage from '../../Utils/showErrorMessage';
import { setToken } from '../actions/jwtAction';
import axios from 'axios';
import { put, call, takeLatest, select } from 'redux-saga/effects';
import {
  ADD_NEW_ANCHOR,
  ADD_NEW_DRY_MIXES_JOURNAL,
  ADD_NEW_RELATED_MATERIALS_JOURNAL,
  ADD_NEW_TOOL,
  FULL_ANCHOR,
  FULL_DRY_MIXES_JOURNAL,
  FULL_RELATED_MATERIALS_JOURNAL,
  FULL_TOOL,
  GET_FULL_ANCHOR,
  GET_FULL_DRY_MIXES_JOURNAL,
  GET_FULL_RELATED_MATERIALS_JOURNAL,
  GET_FULL_TOOL,
  NEW_ANCHOR,
  NEW_DRY_MIXES_JOURNAL,
  NEW_RELATED_MATERIALS_JOURNAL,
  NEW_TOOL,
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

const getAnchor = () => {
  return url
    .get('/anchor')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewAnchor = (anchor) => {
  return url
    .post('/anchor', anchor)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const getTool = () => {
  return url
    .get('/tool')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewTool = (tool) => {
  return url
    .post('/tool', tool)
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

function* getAnchorWorker(action) {
  try {
    // accessTokenFront = yield select((state) => state.jwt);
    // const { allClients, accessToken, accessTokenExpiration } = yield call(
    const { anchor } = yield call(getAnchor);

    // window.localStorage.setItem('jwt', accessToken);

    yield put({ type: FULL_ANCHOR, payload: anchor });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: FULL_ANCHOR, payload: [] });
  }
}

function* addNewAnchorWorker(action) {
  try {
    // accessTokenFront = yield select((state) => state.jwt);

    // const { client, accessToken, accessTokenExpiration } = yield call(
    const { anchor } = yield call(addNewAnchor, action.payload);
    // window.localStorage.setItem('jwt', accessToken);

    yield put({ type: NEW_ANCHOR, payload: anchor });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: NEW_ANCHOR, payload: [] });
  }
}

function* getToolWorker(action) {
  try {
    // accessTokenFront = yield select((state) => state.jwt);
    // const { allClients, accessToken, accessTokenExpiration } = yield call(
    const { tool } = yield call(getTool);

    // window.localStorage.setItem('jwt', accessToken);

    yield put({ type: FULL_TOOL, payload: tool });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: FULL_TOOL, payload: [] });
  }
}

function* addNewToolWorker(action) {
  try {
    // accessTokenFront = yield select((state) => state.jwt);

    // const { client, accessToken, accessTokenExpiration } = yield call(
    const { tool } = yield call(addNewTool, action.payload);
    // window.localStorage.setItem('jwt', accessToken);

    yield put({ type: NEW_TOOL, payload: tool });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: NEW_TOOL, payload: [] });
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
  yield takeLatest(GET_FULL_ANCHOR, getAnchorWorker);
  yield takeLatest(ADD_NEW_ANCHOR, addNewAnchorWorker);
  yield takeLatest(GET_FULL_TOOL, getToolWorker);
  yield takeLatest(ADD_NEW_TOOL, addNewToolWorker);
}

export default productsTypeJournalWatcher;
