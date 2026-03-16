import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import showMessage from '../../Utils/showMessage';
import { errorToText } from '../../Utils/errorToText';
import {
  ADD_NEW_COMPRESSIONS_QUALITY,
  ADD_NEW_DIMENSIONS_QUALITY,
  ADD_NEW_PRODUCTION_QUALITY,
  ALL_COMPRESSIONS_QUALITY,
  ALL_DIMENSIONS_QUALITY,
  ALL_PRODUCTION_QUALITY,
  GET_ALL_COMPRESSIONS_QUALITY,
  GET_ALL_DIMENSIONS_QUALITY,
  GET_ALL_PRODUCTION_QUALITY,
  NEW_COMPRESSIONS_QUALITY,
  NEW_DIMENSIONS_QUALITY,
  NEW_PRODUCTION_QUALITY,
  UPDATE_COMPRESSIONS_QUALITY,
  UPDATE_DIMENSIONS_QUALITY,
} from '../types/productionQualityTypes';

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

//PRODUCTION QUALITY
const getProductionQuality = () => {
  return url
    .get('/productionQuality')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewProductionQuality = (data) => {
  return url
    .post('/productionQuality/add', data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

//DIMENSION QUALITY
const getDimensionsQuality = () => {
  return url
    .get('/productionQuality/dimensions')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewDimensionsQuality = (data) => {
  return url
    .post('/productionQuality/dimensions/add', data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const updateDimensionsQuality = (data) => {
  return url
    .post('/productionQuality/dimensions/upd', data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

//COMPRESSIONS QUALITY
const getCompressionsQuality = () => {
  return url
    .get('/productionQuality/compressions')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewCompressionsQuality = (data) => {
  return url
    .post('/productionQuality/compressions/add', data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const updateCompressionsQuality = (data) => {
  return url
    .post('/productionQuality/compressions/upd', data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

//PRODUCTION QUALITY
function* getAllProductionQualityWatcher() {
  try {
    const productions_quality = yield call(getProductionQuality);

    yield put({ type: ALL_PRODUCTION_QUALITY, payload: productions_quality });
  } catch (err) {
    yield put({ type: ALL_PRODUCTION_QUALITY, payload: [] });
  }
}

function* addNewProductionQualityWatcher(action) {
  try {
    yield call(addNewProductionQuality, action.payload);
  } catch (err) {
    yield put({ type: NEW_PRODUCTION_QUALITY, payload: [] });
  }
}

//DIMENSION QUALITY
function* getAllDimensionsQualityWatcher() {
  try {
    const productions_quality = yield call(getDimensionsQuality);

    yield put({ type: ALL_DIMENSIONS_QUALITY, payload: productions_quality });
  } catch (err) {
    yield put({ type: ALL_DIMENSIONS_QUALITY, payload: [] });
  }
}

function* addNewDimensionsQualityWatcher(action) {
  try {
    yield call(addNewDimensionsQuality, action.payload);
  } catch (err) {
    yield put({ type: NEW_DIMENSIONS_QUALITY, payload: [] });
  }
}

function* updateDimensionsQualityWatcher(action) {
  try {
    yield call(updateDimensionsQuality, action.payload);
  } catch (err) {
    yield put({ type: NEW_DIMENSIONS_QUALITY, payload: [] });
  }
}

//COMPRESSIONS QUALITY
function* getAllCompressionsQualityWatcher() {
  try {
    const productions_quality = yield call(getCompressionsQuality);

    yield put({ type: ALL_COMPRESSIONS_QUALITY, payload: productions_quality });
  } catch (err) {
    yield put({ type: ALL_COMPRESSIONS_QUALITY, payload: [] });
  }
}

function* addNewCompressionsQualityWatcher(action) {
  try {
    yield call(addNewCompressionsQuality, action.payload);
  } catch (err) {
    yield put({ type: NEW_COMPRESSIONS_QUALITY, payload: [] });
  }
}

function* updateCompressionsQualityWatcher(action) {
  try {
    yield call(updateCompressionsQuality, action.payload);
  } catch (err) {
    yield put({ type: NEW_COMPRESSIONS_QUALITY, payload: [] });
  }
}

function* productionQualityWatcher() {
  //PRODUCTION QUALITY
  yield takeLatest(GET_ALL_PRODUCTION_QUALITY, getAllProductionQualityWatcher);
  yield takeLatest(ADD_NEW_PRODUCTION_QUALITY, addNewProductionQualityWatcher);
  //DIMENSION QUALITY
  yield takeLatest(GET_ALL_DIMENSIONS_QUALITY, getAllDimensionsQualityWatcher);
  yield takeLatest(ADD_NEW_DIMENSIONS_QUALITY, addNewDimensionsQualityWatcher);
  yield takeLatest(UPDATE_DIMENSIONS_QUALITY, updateDimensionsQualityWatcher);
  //COMPRESSIONS QUALITY
  yield takeLatest(GET_ALL_COMPRESSIONS_QUALITY, getAllCompressionsQualityWatcher);
  yield takeLatest(ADD_NEW_COMPRESSIONS_QUALITY, addNewCompressionsQualityWatcher);
  yield takeLatest(UPDATE_COMPRESSIONS_QUALITY, updateCompressionsQualityWatcher);
}

export default productionQualityWatcher;
