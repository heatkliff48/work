import showMessage from '../../Utils/showMessage';
import { errorToText } from '../../Utils/errorToText';
import {
  ADD_NEW_LOTES_LIST,
  ADD_NEW_LOTES_LIST_CAKES,
  DELETE_LAST_LOTES_LIST_CAKES,
  DELETE_LOTES_LIST_CAKES,
  FULL_LOTES_LIST,
  FULL_LOTES_LIST_CAKES,
  GET_FULL_LOTES_LIST,
  GET_FULL_LOTES_LIST_CAKES,
  NEW_LOTES_LIST,
  NEW_LOTES_LIST_CAKES,
  UPDATE_LOTES_LIST,
  UPDATE_LOTES_LIST_CAKES,
  UPDATE_LOTES_LIST_CAKES_BOOLEAN,
  UPDATE_LOTES_LIST_NOTES,
  UPD_LOTES_LIST,
  UPD_LOTES_LIST_CAKES,
  UPD_LOTES_LIST_CAKES_BOOLEAN,
  UPD_LOTES_LIST_NOTES,
} from '../types/lotesListTypes';
import axios from 'axios';
import { put, call, takeLatest } from 'redux-saga/effects';

import { getApiUrl } from '#utils/getApiUrl.js';

const url = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
});

const getLotesList = () => {
  return url
    .get('/lotesList/batches')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewLotesList = (lotesListBatches) => {
  return url
    .post('/lotesList/batches', lotesListBatches)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const updateLotesListRecipe = (lotesListBatches) => {
  return url
    .post('/lotesList/batches/update/recipe', lotesListBatches)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const updateLotesListNotes = (lotesListBatches) => {
  return url
    .post('/lotesList/batches/update/notes', lotesListBatches)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const getLotesListCakes = () => {
  return url
    .get('/lotesList/cakes')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewLotesListCakes = (lotesListCakes) => {
  return url
    .post('/lotesList/cakes', lotesListCakes)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const updateLotesListCakesRecipe = (lotesListCakes) => {
  return url
    .post('/lotesList/cakes/update/recipe', lotesListCakes)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const updateLotesListCakesBooleanRecipe = (lotesListCakes) => {
  return url
    .post('/lotesList/cakes/update/boolean/recipe', lotesListCakes)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const deleteLotesListCakes = (lotesListCakes) => {
  return url
    .post('/lotesList/cakes/delete', lotesListCakes)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

function* getLotesListWorker(action) {
  try {
    const { lotesListBatches } = yield call(getLotesList);

    yield put({ type: FULL_LOTES_LIST, payload: lotesListBatches });
  } catch (err) {
    yield put({ type: FULL_LOTES_LIST, payload: [] });
  }
}

function* addNewLotesListWorker(action) {
  try {
    const { lotesListBatches } = yield call(addNewLotesList, action.payload);

    yield put({ type: NEW_LOTES_LIST, payload: lotesListBatches });
  } catch (err) {
    yield put({ type: NEW_LOTES_LIST, payload: [] });
  }
}

function* updateLotesListRecipeWorker(action) {
  try {
    yield call(updateLotesListRecipe, action.payload);
  } catch (err) {
    yield put({ type: UPD_LOTES_LIST, payload: [] });
  }
}

function* updateLotesListNotesWorker(action) {
  try {
    yield call(updateLotesListNotes, action.payload);
  } catch (err) {
    yield put({ type: UPD_LOTES_LIST_NOTES, payload: [] });
  }
}

function* getLotesListCakesWorker(action) {
  try {
    const result = yield call(getLotesListCakes);

    yield put({ type: FULL_LOTES_LIST_CAKES, payload: result });
  } catch (err) {
    yield put({ type: FULL_LOTES_LIST_CAKES, payload: [] });
  }
}

function* addNewLotesListCakesWorker(action) {
  try {
    yield call(addNewLotesListCakes, action.payload);
  } catch (err) {
    yield put({ type: NEW_LOTES_LIST_CAKES, payload: [] });
  }
}

function* updateLotesListCakesRecipeWorker(action) {
  try {
    yield call(updateLotesListCakesRecipe, action.payload);
  } catch (err) {
    yield put({ type: UPD_LOTES_LIST_CAKES, payload: [] });
  }
}

function* updateLotesListCakesBooleanRecipeWorker(action) {
  try {
    yield call(updateLotesListCakesBooleanRecipe, action.payload);
  } catch (err) {
    yield put({ type: UPD_LOTES_LIST_CAKES_BOOLEAN, payload: [] });
  }
}

function* deleteLotesListCakesWorker(action) {
  try {
    yield call(deleteLotesListCakes, action.payload);
  } catch (err) {
    yield put({ type: DELETE_LOTES_LIST_CAKES, payload: [] });
  }
}

// watchers

function* lotesListWatcher() {
  yield takeLatest(GET_FULL_LOTES_LIST, getLotesListWorker);
  yield takeLatest(ADD_NEW_LOTES_LIST, addNewLotesListWorker);
  yield takeLatest(UPDATE_LOTES_LIST, updateLotesListRecipeWorker);
  yield takeLatest(UPDATE_LOTES_LIST_NOTES, updateLotesListNotesWorker);
  //-----------------Lotes List Cakes------------------
  yield takeLatest(GET_FULL_LOTES_LIST_CAKES, getLotesListCakesWorker);
  yield takeLatest(ADD_NEW_LOTES_LIST_CAKES, addNewLotesListCakesWorker);
  yield takeLatest(UPDATE_LOTES_LIST_CAKES, updateLotesListCakesRecipeWorker);
  yield takeLatest(
    UPDATE_LOTES_LIST_CAKES_BOOLEAN,
    updateLotesListCakesBooleanRecipeWorker,
  );
  yield takeLatest(DELETE_LAST_LOTES_LIST_CAKES, deleteLotesListCakesWorker);
}

export default lotesListWatcher;
