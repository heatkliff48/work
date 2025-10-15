import showMessage from '../../Utils/showMessage';
import { errorToText } from '../../Utils/errorToText';
import axios from 'axios';
import { put, call, takeLatest } from 'redux-saga/effects';
import {
  ADD_NEW_ANCHORS_WAREHOUSE,
  ADD_NEW_DRY_MIXES_WAREHOUSE,
  ADD_NEW_RELATED_MATERIALS_WAREHOUSE,
  ADD_NEW_TOOLS_WAREHOUSE,
  FULL_ANCHORS_WAREHOUSE,
  FULL_DRY_MIXES_WAREHOUSE,
  FULL_RELATED_MATERIALS_WAREHOUSE,
  FULL_TOOLS_WAREHOUSE,
  GET_FULL_ANCHORS_WAREHOUSE,
  GET_FULL_DRY_MIXES_WAREHOUSE,
  GET_FULL_RELATED_MATERIALS_WAREHOUSE,
  GET_FULL_TOOLS_WAREHOUSE,
  NEW_ANCHORS_WAREHOUSE,
  NEW_DRY_MIXES_WAREHOUSE,
  NEW_RELATED_MATERIALS_WAREHOUSE,
  NEW_TOOLS_WAREHOUSE,
  UPDATE_ANCHORS_WAREHOUSE,
  UPDATE_DRY_MIXES_WAREHOUSE,
  UPDATE_NEW_ANCHORS_WAREHOUSE,
  UPDATE_NEW_DRY_MIXES_WAREHOUSE,
  UPDATE_NEW_RELATED_MATERIALS_WAREHOUSE,
  UPDATE_NEW_TOOLS_WAREHOUSE,
  UPDATE_RELATED_MATERIALS_WAREHOUSE,
  UPDATE_TOOLS_WAREHOUSE,
} from '../types/productsTypeWarehouseTypes';

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

const getDryMixesWarehouse = () => {
  return url
    .get('/dryMixesWarehouse')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewDryMixesWarehouse = (dryMixesWarehouse) => {
  return url
    .post('/dryMixesWarehouse', dryMixesWarehouse)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const updateDryMixesWarehouse = (dryMixesWarehouse) => {
  return url
    .post('/dryMixesWarehouse/update', dryMixesWarehouse)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const getRelatedMaterialsWarehouse = () => {
  return url
    .get('/relatedMaterialsWarehouse')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewRelatedMaterialsWarehouse = (relatedMaterialsWarehouse) => {
  return url
    .post('/relatedMaterialsWarehouse', relatedMaterialsWarehouse)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const updateRelatedMaterialsWarehouse = (relatedMaterialsWarehouse) => {
  return url
    .post('/relatedMaterialsWarehouse/update', relatedMaterialsWarehouse)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const getAnchorsWarehouse = () => {
  return url
    .get('/anchorsWarehouse')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewAnchorsWarehouse = (anchorsWarehouse) => {
  return url
    .post('/anchorsWarehouse', anchorsWarehouse)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const updateAnchorsWarehouse = (anchorsWarehouse) => {
  return url
    .post('/anchorsWarehouse/update', anchorsWarehouse)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const getToolsWarehouse = () => {
  return url
    .get('/toolsWarehouse')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewToolsWarehouse = (toolsWarehouse) => {
  return url
    .post('/toolsWarehouse', toolsWarehouse)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const updateToolsWarehouse = (toolsWarehouse) => {
  return url
    .post('/toolsWarehouse/update', toolsWarehouse)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

function* getDryMixesWarehouseWorker() {
  try {
    const { dryMixesWarehouse } = yield call(getDryMixesWarehouse);

    yield put({ type: FULL_DRY_MIXES_WAREHOUSE, payload: dryMixesWarehouse });
  } catch (err) {
    yield put({ type: FULL_DRY_MIXES_WAREHOUSE, payload: [] });
  }
}

function* addNewDryMixesWarehouseWorker(action) {
  try {
    const { dryMixesWarehouse } = yield call(
      addNewDryMixesWarehouse,
      action.payload
    );

    yield put({ type: NEW_DRY_MIXES_WAREHOUSE, payload: dryMixesWarehouse });
  } catch (err) {
    yield put({ type: NEW_DRY_MIXES_WAREHOUSE, payload: [] });
  }
}

function* updateNewDryMixesWarehouseWorker(action) {
  try {
    const { dryMixesWarehouse } = yield call(
      updateDryMixesWarehouse,
      action.payload
    );

    yield put({ type: UPDATE_DRY_MIXES_WAREHOUSE, payload: dryMixesWarehouse });
  } catch (err) {
    yield put({ type: UPDATE_DRY_MIXES_WAREHOUSE, payload: [] });
  }
}

function* getRelatedMaterialsWarehouseWorker() {
  try {
    const { relatedMaterialsWarehouse } = yield call(getRelatedMaterialsWarehouse);

    yield put({
      type: FULL_RELATED_MATERIALS_WAREHOUSE,
      payload: relatedMaterialsWarehouse,
    });
  } catch (err) {
    yield put({ type: FULL_RELATED_MATERIALS_WAREHOUSE, payload: [] });
  }
}

function* addNewRelatedMaterialsWarehouseWorker(action) {
  try {
    const { relatedMaterialsWarehouse } = yield call(
      addNewRelatedMaterialsWarehouse,
      action.payload
    );

    yield put({
      type: NEW_RELATED_MATERIALS_WAREHOUSE,
      payload: relatedMaterialsWarehouse,
    });
  } catch (err) {
    yield put({ type: NEW_RELATED_MATERIALS_WAREHOUSE, payload: [] });
  }
}

function* updateNewRelatedMaterialsWarehouseWorker(action) {
  try {
    const { relatedMaterialsWarehouse } = yield call(
      updateRelatedMaterialsWarehouse,
      action.payload
    );

    yield put({
      type: UPDATE_RELATED_MATERIALS_WAREHOUSE,
      payload: relatedMaterialsWarehouse,
    });
  } catch (err) {
    yield put({ type: UPDATE_RELATED_MATERIALS_WAREHOUSE, payload: [] });
  }
}

function* getAnchorsWarehouseWorker() {
  try {
    const { anchorsWarehouse } = yield call(getAnchorsWarehouse);

    yield put({ type: FULL_ANCHORS_WAREHOUSE, payload: anchorsWarehouse });
  } catch (err) {
    yield put({ type: FULL_ANCHORS_WAREHOUSE, payload: [] });
  }
}

function* addNewAnchorsWarehouseWorker(action) {
  try {
    const { anchorsWarehouse } = yield call(addNewAnchorsWarehouse, action.payload);

    yield put({ type: NEW_ANCHORS_WAREHOUSE, payload: anchorsWarehouse });
  } catch (err) {
    yield put({ type: NEW_ANCHORS_WAREHOUSE, payload: [] });
  }
}

function* updateNewAnchorsWarehouseWorker(action) {
  try {
    const { anchorsWarehouse } = yield call(updateAnchorsWarehouse, action.payload);

    yield put({ type: UPDATE_ANCHORS_WAREHOUSE, payload: anchorsWarehouse });
  } catch (err) {
    yield put({ type: UPDATE_ANCHORS_WAREHOUSE, payload: [] });
  }
}

function* getToolsWarehouseWorker() {
  try {
    const { toolsWarehouse } = yield call(getToolsWarehouse);

    yield put({ type: FULL_TOOLS_WAREHOUSE, payload: toolsWarehouse });
  } catch (err) {
    yield put({ type: FULL_TOOLS_WAREHOUSE, payload: [] });
  }
}

function* addNewToolsWarehouseWorker(action) {
  try {
    const { toolsWarehouse } = yield call(addNewToolsWarehouse, action.payload);

    yield put({ type: NEW_TOOLS_WAREHOUSE, payload: toolsWarehouse });
  } catch (err) {
    yield put({ type: NEW_TOOLS_WAREHOUSE, payload: [] });
  }
}

function* updateNewToolsWarehouseWorker(action) {
  try {
    const { toolsWarehouse } = yield call(updateToolsWarehouse, action.payload);

    yield put({ type: UPDATE_TOOLS_WAREHOUSE, payload: toolsWarehouse });
  } catch (err) {
    yield put({ type: UPDATE_TOOLS_WAREHOUSE, payload: [] });
  }
}

// watchers

function* productsTypeWarehouseWatcher() {
  yield takeLatest(GET_FULL_DRY_MIXES_WAREHOUSE, getDryMixesWarehouseWorker);
  yield takeLatest(ADD_NEW_DRY_MIXES_WAREHOUSE, addNewDryMixesWarehouseWorker);
  yield takeLatest(UPDATE_NEW_DRY_MIXES_WAREHOUSE, updateNewDryMixesWarehouseWorker);
  yield takeLatest(
    GET_FULL_RELATED_MATERIALS_WAREHOUSE,
    getRelatedMaterialsWarehouseWorker
  );
  yield takeLatest(
    ADD_NEW_RELATED_MATERIALS_WAREHOUSE,
    addNewRelatedMaterialsWarehouseWorker
  );
  yield takeLatest(
    UPDATE_NEW_RELATED_MATERIALS_WAREHOUSE,
    updateNewRelatedMaterialsWarehouseWorker
  );
  yield takeLatest(GET_FULL_ANCHORS_WAREHOUSE, getAnchorsWarehouseWorker);
  yield takeLatest(ADD_NEW_ANCHORS_WAREHOUSE, addNewAnchorsWarehouseWorker);
  yield takeLatest(UPDATE_NEW_ANCHORS_WAREHOUSE, updateNewAnchorsWarehouseWorker);
  yield takeLatest(GET_FULL_TOOLS_WAREHOUSE, getToolsWarehouseWorker);
  yield takeLatest(ADD_NEW_TOOLS_WAREHOUSE, addNewToolsWarehouseWorker);
  yield takeLatest(UPDATE_NEW_TOOLS_WAREHOUSE, updateNewToolsWarehouseWorker);
}

export default productsTypeWarehouseWatcher;
