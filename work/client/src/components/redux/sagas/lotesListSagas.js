import showMessage from '../../Utils/showMessage';
import { errorToText } from '../../Utils/errorToText';
import {
  ADD_NEW_LOTES_LIST,
  ADD_NEW_LOTES_LIST_CAKES,
  FULL_LOTES_LIST,
  FULL_LOTES_LIST_CAKES,
  GET_FULL_LOTES_LIST,
  GET_FULL_LOTES_LIST_CAKES,
  NEW_LOTES_LIST,
  NEW_LOTES_LIST_CAKES,
  UPDATE_LOTES_LIST,
  UPDATE_LOTES_LIST_CAKES,
  UPD_LOTES_LIST,
  UPD_LOTES_LIST_CAKES,
} from '../types/lotesListTypes';
import axios from 'axios';
import { put, call, takeLatest } from 'redux-saga/effects';

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
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

// watchers

function* lotesListWatcher() {
  yield takeLatest(GET_FULL_LOTES_LIST, getLotesListWorker);
  yield takeLatest(ADD_NEW_LOTES_LIST, addNewLotesListWorker);
  yield takeLatest(UPDATE_LOTES_LIST, updateLotesListRecipeWorker);
  //-----------------Lotes List Cakes------------------
  yield takeLatest(GET_FULL_LOTES_LIST_CAKES, getLotesListCakesWorker);
  yield takeLatest(ADD_NEW_LOTES_LIST_CAKES, addNewLotesListCakesWorker);
  yield takeLatest(UPDATE_LOTES_LIST_CAKES, updateLotesListCakesRecipeWorker);
}

export default lotesListWatcher;
