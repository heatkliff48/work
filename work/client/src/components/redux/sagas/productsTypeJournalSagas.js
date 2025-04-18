import showErrorMessage from '../../Utils/showErrorMessage';
import axios from 'axios';
import { put, call, takeLatest } from 'redux-saga/effects';
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
  UPDATE_ANCHOR,
  UPDATE_DRY_MIXES_JOURNAL,
  UPDATE_NEW_ANCHOR,
  UPDATE_NEW_DRY_MIXES_JOURNAL,
  UPDATE_NEW_RELATED_MATERIALS_JOURNAL,
  UPDATE_NEW_TOOL,
  UPDATE_RELATED_MATERIALS_JOURNAL,
  UPDATE_TOOL,
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

const updateDryMixesJournal = (dryMixesJournal) => {
  return url
    .post('/dryMixesJournal/update', dryMixesJournal)
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

const updateRelatedMaterialsJournal = (relatedMaterialsJournal) => {
  return url
    .post('/relatedMaterialsJournal/update', relatedMaterialsJournal)
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

const updateAnchor = (anchor) => {
  return url
    .post('/anchor/update', anchor)
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

const updateTool = (tool) => {
  return url
    .post('/tool/update', tool)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

function* getDryMixesJournalWorker() {
  try {
    const { dryMixesJournal } = yield call(getDryMixesJournal);

    yield put({ type: FULL_DRY_MIXES_JOURNAL, payload: dryMixesJournal });
  } catch (err) {
    yield put({ type: FULL_DRY_MIXES_JOURNAL, payload: [] });
  }
}

function* addNewDryMixesJournalWorker(action) {
  try {
    const { dryMixesJournal } = yield call(addNewDryMixesJournal, action.payload);

    yield put({ type: NEW_DRY_MIXES_JOURNAL, payload: dryMixesJournal });
  } catch (err) {
    yield put({ type: NEW_DRY_MIXES_JOURNAL, payload: [] });
  }
}

function* updateNewDryMixesJournalWorker(action) {
  try {
    const { dryMixesJournal } = yield call(updateDryMixesJournal, action.payload);

    yield put({ type: UPDATE_DRY_MIXES_JOURNAL, payload: dryMixesJournal });
  } catch (err) {
    yield put({ type: UPDATE_DRY_MIXES_JOURNAL, payload: [] });
  }
}

function* getRelatedMaterialsJournalWorker() {
  try {
    const { relatedMaterialsJournal } = yield call(getRelatedMaterialsJournal);

    yield put({
      type: FULL_RELATED_MATERIALS_JOURNAL,
      payload: relatedMaterialsJournal,
    });
  } catch (err) {
    yield put({ type: FULL_RELATED_MATERIALS_JOURNAL, payload: [] });
  }
}

function* addNewRelatedMaterialsJournalWorker(action) {
  try {
    const { relatedMaterialsJournal } = yield call(
      addNewRelatedMaterialsJournal,
      action.payload
    );

    yield put({
      type: NEW_RELATED_MATERIALS_JOURNAL,
      payload: relatedMaterialsJournal,
    });
  } catch (err) {
    yield put({ type: NEW_RELATED_MATERIALS_JOURNAL, payload: [] });
  }
}

function* updateNewRelatedMaterialsJournalWorker(action) {
  try {
    const { relatedMaterialsJournal } = yield call(
      updateRelatedMaterialsJournal,
      action.payload
    );

    yield put({
      type: UPDATE_RELATED_MATERIALS_JOURNAL,
      payload: relatedMaterialsJournal,
    });
  } catch (err) {
    yield put({ type: UPDATE_RELATED_MATERIALS_JOURNAL, payload: [] });
  }
}

function* getAnchorWorker() {
  try {
    const { anchor } = yield call(getAnchor);

    yield put({ type: FULL_ANCHOR, payload: anchor });
  } catch (err) {
    yield put({ type: FULL_ANCHOR, payload: [] });
  }
}

function* addNewAnchorWorker(action) {
  try {
    const { anchor } = yield call(addNewAnchor, action.payload);

    yield put({ type: NEW_ANCHOR, payload: anchor });
  } catch (err) {
    yield put({ type: NEW_ANCHOR, payload: [] });
  }
}

function* updateNewAnchorWorker(action) {
  try {
    const { anchor } = yield call(updateAnchor, action.payload);

    yield put({ type: UPDATE_ANCHOR, payload: anchor });
  } catch (err) {
    yield put({ type: UPDATE_ANCHOR, payload: [] });
  }
}

function* getToolWorker() {
  try {
    const { tool } = yield call(getTool);

    yield put({ type: FULL_TOOL, payload: tool });
  } catch (err) {
    yield put({ type: FULL_TOOL, payload: [] });
  }
}

function* addNewToolWorker(action) {
  try {
    const { tool } = yield call(addNewTool, action.payload);

    yield put({ type: NEW_TOOL, payload: tool });
  } catch (err) {
    yield put({ type: NEW_TOOL, payload: [] });
  }
}

function* updateNewToolWorker(action) {
  try {
    const { tool } = yield call(updateTool, action.payload);

    yield put({ type: UPDATE_TOOL, payload: tool });
  } catch (err) {
    yield put({ type: UPDATE_TOOL, payload: [] });
  }
}

// watchers

function* productsTypeJournalWatcher() {
  yield takeLatest(GET_FULL_DRY_MIXES_JOURNAL, getDryMixesJournalWorker);
  yield takeLatest(ADD_NEW_DRY_MIXES_JOURNAL, addNewDryMixesJournalWorker);
  yield takeLatest(UPDATE_NEW_DRY_MIXES_JOURNAL, updateNewDryMixesJournalWorker);
  yield takeLatest(
    GET_FULL_RELATED_MATERIALS_JOURNAL,
    getRelatedMaterialsJournalWorker
  );
  yield takeLatest(
    ADD_NEW_RELATED_MATERIALS_JOURNAL,
    addNewRelatedMaterialsJournalWorker
  );
  yield takeLatest(
    UPDATE_NEW_RELATED_MATERIALS_JOURNAL,
    updateNewRelatedMaterialsJournalWorker
  );
  yield takeLatest(GET_FULL_ANCHOR, getAnchorWorker);
  yield takeLatest(ADD_NEW_ANCHOR, addNewAnchorWorker);
  yield takeLatest(UPDATE_NEW_ANCHOR, updateNewAnchorWorker);
  yield takeLatest(GET_FULL_TOOL, getToolWorker);
  yield takeLatest(ADD_NEW_TOOL, addNewToolWorker);
  yield takeLatest(UPDATE_NEW_TOOL, updateNewToolWorker);
}

export default productsTypeJournalWatcher;
