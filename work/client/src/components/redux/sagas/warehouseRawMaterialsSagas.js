import showMessage from '../../Utils/showMessage';
import { errorToText } from '../../Utils/errorToText';
import {
  ADD_NEW_WAREHOUSE_SAND,
  DELETE_WAREHOUSE_SAND,
  FULL_WAREHOUSE_SAND,
  GET_FULL_WAREHOUSE_SAND,
  NEED_DELETE_WAREHOUSE_SAND,
  NEW_WAREHOUSE_SAND,
  UPDATE_WAREHOUSE_SAND,
  UPDATE_NEW_WAREHOUSE_SAND,
  ADD_NEW_WAREHOUSE_LIME,
  DELETE_WAREHOUSE_LIME,
  FULL_WAREHOUSE_LIME,
  GET_FULL_WAREHOUSE_LIME,
  NEED_DELETE_WAREHOUSE_LIME,
  NEW_WAREHOUSE_LIME,
  UPDATE_WAREHOUSE_LIME,
  UPDATE_NEW_WAREHOUSE_LIME,
  ADD_NEW_WAREHOUSE_CEMENT,
  DELETE_WAREHOUSE_CEMENT,
  FULL_WAREHOUSE_CEMENT,
  GET_FULL_WAREHOUSE_CEMENT,
  NEED_DELETE_WAREHOUSE_CEMENT,
  NEW_WAREHOUSE_CEMENT,
  UPDATE_WAREHOUSE_CEMENT,
  UPDATE_NEW_WAREHOUSE_CEMENT,
  ADD_NEW_WAREHOUSE_GYPSUM,
  DELETE_WAREHOUSE_GYPSUM,
  FULL_WAREHOUSE_GYPSUM,
  GET_FULL_WAREHOUSE_GYPSUM,
  NEED_DELETE_WAREHOUSE_GYPSUM,
  NEW_WAREHOUSE_GYPSUM,
  UPDATE_WAREHOUSE_GYPSUM,
  UPDATE_NEW_WAREHOUSE_GYPSUM,
  ADD_NEW_WAREHOUSE_GYPSUM_STONE,
  DELETE_WAREHOUSE_GYPSUM_STONE,
  FULL_WAREHOUSE_GYPSUM_STONE,
  GET_FULL_WAREHOUSE_GYPSUM_STONE,
  NEED_DELETE_WAREHOUSE_GYPSUM_STONE,
  NEW_WAREHOUSE_GYPSUM_STONE,
  UPDATE_WAREHOUSE_GYPSUM_STONE,
  UPDATE_NEW_WAREHOUSE_GYPSUM_STONE,
  ADD_NEW_WAREHOUSE_ALUMINUM1,
  DELETE_WAREHOUSE_ALUMINUM1,
  FULL_WAREHOUSE_ALUMINUM1,
  GET_FULL_WAREHOUSE_ALUMINUM1,
  NEED_DELETE_WAREHOUSE_ALUMINUM1,
  NEW_WAREHOUSE_ALUMINUM1,
  UPDATE_WAREHOUSE_ALUMINUM1,
  UPDATE_NEW_WAREHOUSE_ALUMINUM1,
  ADD_NEW_WAREHOUSE_ALUMINUM2,
  DELETE_WAREHOUSE_ALUMINUM2,
  FULL_WAREHOUSE_ALUMINUM2,
  GET_FULL_WAREHOUSE_ALUMINUM2,
  NEED_DELETE_WAREHOUSE_ALUMINUM2,
  NEW_WAREHOUSE_ALUMINUM2,
  UPDATE_WAREHOUSE_ALUMINUM2,
  UPDATE_NEW_WAREHOUSE_ALUMINUM2,
  ADD_NEW_WAREHOUSE_GRINDING_BALLS,
  DELETE_WAREHOUSE_GRINDING_BALLS,
  FULL_WAREHOUSE_GRINDING_BALLS,
  GET_FULL_WAREHOUSE_GRINDING_BALLS,
  NEED_DELETE_WAREHOUSE_GRINDING_BALLS,
  NEW_WAREHOUSE_GRINDING_BALLS,
  UPDATE_WAREHOUSE_GRINDING_BALLS,
  UPDATE_NEW_WAREHOUSE_GRINDING_BALLS,
  ADD_NEW_WAREHOUSE_AAC,
  DELETE_WAREHOUSE_AAC,
  FULL_WAREHOUSE_AAC,
  GET_FULL_WAREHOUSE_AAC,
  NEED_DELETE_WAREHOUSE_AAC,
  NEW_WAREHOUSE_AAC,
  UPDATE_WAREHOUSE_AAC,
  UPDATE_NEW_WAREHOUSE_AAC,
  FULL_WAREHOUSE_SAND_SLURRY,
  NEW_WAREHOUSE_SAND_SLURRY,
  GET_FULL_WAREHOUSE_SAND_SLURRY,
  ADD_NEW_WAREHOUSE_SAND_SLURRY,
} from '../types/warehouseRawMaterialsTypes';
import axios from 'axios';
import { put, call, takeLatest } from 'redux-saga/effects';

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

// Sand API functions
const getWarehouseSand = () => {
  return url
    .get('/rawMaterialsWarehouse/sand')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewWarehouseSand = (warehouseSand) => {
  return url
    .post('/rawMaterialsWarehouse/sand', warehouseSand)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const deleteWarehouseSand = (sand_warehouse_id) => {
  return url
    .post('/rawMaterialsWarehouse/sand/delete', { sand_warehouse_id })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const updateWarehouseSand = (warehouseSand) => {
  return url
    .post('/rawMaterialsWarehouse/sand/update', warehouseSand)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

// Lime API functions
const getWarehouseLime = () => {
  return url
    .get('/rawMaterialsWarehouse/lime')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewWarehouseLime = (warehouseLime) => {
  return url
    .post('/rawMaterialsWarehouse/lime', warehouseLime)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const deleteWarehouseLime = (lime_warehouse_id) => {
  return url
    .post('/rawMaterialsWarehouse/lime/delete', { lime_warehouse_id })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const updateWarehouseLime = (warehouseLime) => {
  return url
    .post('/rawMaterialsWarehouse/lime/update', warehouseLime)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

// Cement API functions
const getWarehouseCement = () => {
  return url
    .get('/rawMaterialsWarehouse/cement')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewWarehouseCement = (warehouseCement) => {
  return url
    .post('/rawMaterialsWarehouse/cement', warehouseCement)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const deleteWarehouseCement = (cement_warehouse_id) => {
  return url
    .post('/rawMaterialsWarehouse/cement/delete', { cement_warehouse_id })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const updateWarehouseCement = (warehouseCement) => {
  return url
    .post('/rawMaterialsWarehouse/cement/update', warehouseCement)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

// Gypsum API functions
const getWarehouseGypsum = () => {
  return url
    .get('/rawMaterialsWarehouse/gypsum')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewWarehouseGypsum = (warehouseGypsum) => {
  return url
    .post('/rawMaterialsWarehouse/gypsum', warehouseGypsum)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const deleteWarehouseGypsum = (gypsum_warehouse_id) => {
  return url
    .post('/rawMaterialsWarehouse/gypsum/delete', { gypsum_warehouse_id })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const updateWarehouseGypsum = (warehouseGypsum) => {
  return url
    .post('/rawMaterialsWarehouse/gypsum/update', warehouseGypsum)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

// Gypsum stone API functions
const getWarehouseGypsumStone = () => {
  return url
    .get('/rawMaterialsWarehouse/gypsum-stone')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewWarehouseGypsumStone = (warehouseGypsumStone) => {
  return url
    .post('/rawMaterialsWarehouse/gypsum-stone', warehouseGypsumStone)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const deleteWarehouseGypsumStone = (gypsum_stone_warehouse_id) => {
  return url
    .post('/rawMaterialsWarehouse/gypsum-stone/delete', {
      gypsum_stone_warehouse_id,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const updateWarehouseGypsumStone = (warehouseGypsumStone) => {
  return url
    .post('/rawMaterialsWarehouse/gypsum-stone/update', warehouseGypsumStone)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

// Aluminum1 API functions
const getWarehouseAluminum1 = () => {
  return url
    .get('/rawMaterialsWarehouse/aluminum1')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewWarehouseAluminum1 = (warehouseAluminum1) => {
  return url
    .post('/rawMaterialsWarehouse/aluminum1', warehouseAluminum1)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const deleteWarehouseAluminum1 = (aluminum1_warehouse_id) => {
  return url
    .post('/rawMaterialsWarehouse/aluminum1/delete', { aluminum1_warehouse_id })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const updateWarehouseAluminum1 = (warehouseAluminum1) => {
  return url
    .post('/rawMaterialsWarehouse/aluminum1/update', warehouseAluminum1)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

// Aluminum2 API functions
const getWarehouseAluminum2 = () => {
  return url
    .get('/rawMaterialsWarehouse/aluminum2')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewWarehouseAluminum2 = (warehouseAluminum2) => {
  return url
    .post('/rawMaterialsWarehouse/aluminum2', warehouseAluminum2)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const deleteWarehouseAluminum2 = (aluminum2_warehouse_id) => {
  return url
    .post('/rawMaterialsWarehouse/aluminum2/delete', { aluminum2_warehouse_id })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const updateWarehouseAluminum2 = (warehouseAluminum2) => {
  return url
    .post('/rawMaterialsWarehouse/aluminum2/update', warehouseAluminum2)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

// Grinding Balls API functions
const getWarehouseGrindingBalls = () => {
  return url
    .get('/rawMaterialsWarehouse/grinding-balls')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewWarehouseGrindingBalls = (warehouseGrindingBalls) => {
  return url
    .post('/rawMaterialsWarehouse/grinding-balls', warehouseGrindingBalls)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const deleteWarehouseGrindingBalls = (grinding_balls_warehouse_id) => {
  return url
    .post('/rawMaterialsWarehouse/grinding-balls/delete', {
      grinding_balls_warehouse_id,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const updateWarehouseGrindingBalls = (warehouseGrindingBalls) => {
  return url
    .post(
      '/rawMaterialsWarehouse/grinding-balls/update',
      warehouseGrindingBalls,
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

// AAC API functions
const getWarehouseAAC = () => {
  return url
    .get('/rawMaterialsWarehouse/aac')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewWarehouseAAC = (warehouseAAC) => {
  return url
    .post('/rawMaterialsWarehouse/aac', warehouseAAC)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const deleteWarehouseAAC = (aac_warehouse_id) => {
  return url
    .post('/rawMaterialsWarehouse/aac/delete', { aac_warehouse_id })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const updateWarehouseAAC = (warehouseAAC) => {
  return url
    .post('/rawMaterialsWarehouse/aac/update', warehouseAAC)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

// Sand Slurry API functions
const getWarehouseSandSlurry = () => {
  return url
    .get('/rawMaterialsWarehouse/sand_slurry')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewWarehouseSandSlurry = (warehouseSandSlurry) => {
  return url
    .post('/rawMaterialsWarehouse/sand_slurry', warehouseSandSlurry)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

// Sand Workers
function* getWarehouseSandWorker(action) {
  try {
    const { warehouseSand } = yield call(getWarehouseSand);
    yield put({ type: FULL_WAREHOUSE_SAND, payload: warehouseSand });
  } catch (err) {
    yield put({ type: FULL_WAREHOUSE_SAND, payload: [] });
  }
}

function* addNewWarehouseSandWorker(action) {
  try {
    const { warehouseSand } = yield call(addNewWarehouseSand, action.payload);
    yield put({ type: NEW_WAREHOUSE_SAND, payload: warehouseSand });
  } catch (err) {
    yield put({ type: NEW_WAREHOUSE_SAND, payload: [] });
  }
}

function* deleteWarehouseSandWorker(action) {
  try {
    const { payload } = action;
    yield call(deleteWarehouseSand, payload);
    yield put({ type: NEED_DELETE_WAREHOUSE_SAND, payload });
  } catch (err) {
    yield put({ type: NEED_DELETE_WAREHOUSE_SAND, payload: [] });
  }
}

function* updateWarehouseSandWorker(action) {
  try {
    const { warehouseSand } = yield call(updateWarehouseSand, action.payload);
    yield put({ type: UPDATE_WAREHOUSE_SAND, payload: warehouseSand });
  } catch (err) {
    yield put({ type: UPDATE_WAREHOUSE_SAND, payload: [] });
  }
}

// Lime Workers
function* getWarehouseLimeWorker(action) {
  try {
    const { warehouseLime } = yield call(getWarehouseLime);
    yield put({ type: FULL_WAREHOUSE_LIME, payload: warehouseLime });
  } catch (err) {
    yield put({ type: FULL_WAREHOUSE_LIME, payload: [] });
  }
}

function* addNewWarehouseLimeWorker(action) {
  try {
    const { warehouseLime } = yield call(addNewWarehouseLime, action.payload);
    yield put({ type: NEW_WAREHOUSE_LIME, payload: warehouseLime });
  } catch (err) {
    yield put({ type: NEW_WAREHOUSE_LIME, payload: [] });
  }
}

function* deleteWarehouseLimeWorker(action) {
  try {
    const { payload } = action;
    yield call(deleteWarehouseLime, payload);
    yield put({ type: NEED_DELETE_WAREHOUSE_LIME, payload });
  } catch (err) {
    yield put({ type: NEED_DELETE_WAREHOUSE_LIME, payload: [] });
  }
}

function* updateWarehouseLimeWorker(action) {
  try {
    const { warehouseLime } = yield call(updateWarehouseLime, action.payload);
    yield put({ type: UPDATE_WAREHOUSE_LIME, payload: warehouseLime });
  } catch (err) {
    yield put({ type: UPDATE_WAREHOUSE_LIME, payload: [] });
  }
}

// Cement Workers
function* getWarehouseCementWorker(action) {
  try {
    const { warehouseCement } = yield call(getWarehouseCement);
    yield put({ type: FULL_WAREHOUSE_CEMENT, payload: warehouseCement });
  } catch (err) {
    yield put({ type: FULL_WAREHOUSE_CEMENT, payload: [] });
  }
}

function* addNewWarehouseCementWorker(action) {
  try {
    const { warehouseCement } = yield call(
      addNewWarehouseCement,
      action.payload,
    );
    yield put({ type: NEW_WAREHOUSE_CEMENT, payload: warehouseCement });
  } catch (err) {
    yield put({ type: NEW_WAREHOUSE_CEMENT, payload: [] });
  }
}

function* deleteWarehouseCementWorker(action) {
  try {
    const { payload } = action;
    yield call(deleteWarehouseCement, payload);
    yield put({ type: NEED_DELETE_WAREHOUSE_CEMENT, payload });
  } catch (err) {
    yield put({ type: NEED_DELETE_WAREHOUSE_CEMENT, payload: [] });
  }
}

function* updateWarehouseCementWorker(action) {
  try {
    const { warehouseCement } = yield call(
      updateWarehouseCement,
      action.payload,
    );
    yield put({ type: UPDATE_WAREHOUSE_CEMENT, payload: warehouseCement });
  } catch (err) {
    yield put({ type: UPDATE_WAREHOUSE_CEMENT, payload: [] });
  }
}

// Gypsum Workers
function* getWarehouseGypsumWorker(action) {
  try {
    const { warehouseGypsum } = yield call(getWarehouseGypsum);
    yield put({ type: FULL_WAREHOUSE_GYPSUM, payload: warehouseGypsum });
  } catch (err) {
    yield put({ type: FULL_WAREHOUSE_GYPSUM, payload: [] });
  }
}

function* addNewWarehouseGypsumWorker(action) {
  try {
    const { warehouseGypsum } = yield call(
      addNewWarehouseGypsum,
      action.payload,
    );
    yield put({ type: NEW_WAREHOUSE_GYPSUM, payload: warehouseGypsum });
  } catch (err) {
    yield put({ type: NEW_WAREHOUSE_GYPSUM, payload: [] });
  }
}

function* deleteWarehouseGypsumWorker(action) {
  try {
    const { payload } = action;
    yield call(deleteWarehouseGypsum, payload);
    yield put({ type: NEED_DELETE_WAREHOUSE_GYPSUM, payload });
  } catch (err) {
    yield put({ type: NEED_DELETE_WAREHOUSE_GYPSUM, payload: [] });
  }
}

function* updateWarehouseGypsumWorker(action) {
  try {
    const { warehouseGypsum } = yield call(
      updateWarehouseGypsum,
      action.payload,
    );
    yield put({ type: UPDATE_WAREHOUSE_GYPSUM, payload: warehouseGypsum });
  } catch (err) {
    yield put({ type: UPDATE_WAREHOUSE_GYPSUM, payload: [] });
  }
}

// Gypsum stone Workers
function* getWarehouseGypsumStoneWorker(action) {
  try {
    const { warehouseGypsumStone } = yield call(getWarehouseGypsumStone);
    yield put({
      type: FULL_WAREHOUSE_GYPSUM_STONE,
      payload: warehouseGypsumStone,
    });
  } catch (err) {
    yield put({ type: FULL_WAREHOUSE_GYPSUM_STONE, payload: [] });
  }
}

function* addNewWarehouseGypsumStoneWorker(action) {
  try {
    const { warehouseGypsumStone } = yield call(
      addNewWarehouseGypsumStone,
      action.payload,
    );
    yield put({
      type: NEW_WAREHOUSE_GYPSUM_STONE,
      payload: warehouseGypsumStone,
    });
  } catch (err) {
    yield put({ type: NEW_WAREHOUSE_GYPSUM_STONE, payload: [] });
  }
}

function* deleteWarehouseGypsumStoneWorker(action) {
  try {
    const { payload } = action;
    yield call(deleteWarehouseGypsumStone, payload);
    yield put({ type: NEED_DELETE_WAREHOUSE_GYPSUM_STONE, payload });
  } catch (err) {
    yield put({ type: NEED_DELETE_WAREHOUSE_GYPSUM_STONE, payload: [] });
  }
}

function* updateWarehouseGypsumStoneWorker(action) {
  try {
    const { warehouseGypsumStone } = yield call(
      updateWarehouseGypsumStone,
      action.payload,
    );
    yield put({
      type: UPDATE_WAREHOUSE_GYPSUM_STONE,
      payload: warehouseGypsumStone,
    });
  } catch (err) {
    yield put({ type: UPDATE_WAREHOUSE_GYPSUM_STONE, payload: [] });
  }
}

// Aluminum1 Workers
function* getWarehouseAluminum1Worker(action) {
  try {
    const { warehouseAluminum1 } = yield call(getWarehouseAluminum1);
    yield put({ type: FULL_WAREHOUSE_ALUMINUM1, payload: warehouseAluminum1 });
  } catch (err) {
    yield put({ type: FULL_WAREHOUSE_ALUMINUM1, payload: [] });
  }
}

function* addNewWarehouseAluminum1Worker(action) {
  try {
    const { warehouseAluminum1 } = yield call(
      addNewWarehouseAluminum1,
      action.payload,
    );
    yield put({ type: NEW_WAREHOUSE_ALUMINUM1, payload: warehouseAluminum1 });
  } catch (err) {
    yield put({ type: NEW_WAREHOUSE_ALUMINUM1, payload: [] });
  }
}

function* deleteWarehouseAluminum1Worker(action) {
  try {
    const { payload } = action;
    yield call(deleteWarehouseAluminum1, payload);
    yield put({ type: NEED_DELETE_WAREHOUSE_ALUMINUM1, payload });
  } catch (err) {
    yield put({ type: NEED_DELETE_WAREHOUSE_ALUMINUM1, payload: [] });
  }
}

function* updateWarehouseAluminum1Worker(action) {
  try {
    const { warehouseAluminum1 } = yield call(
      updateWarehouseAluminum1,
      action.payload,
    );
    yield put({
      type: UPDATE_WAREHOUSE_ALUMINUM1,
      payload: warehouseAluminum1,
    });
  } catch (err) {
    yield put({ type: UPDATE_WAREHOUSE_ALUMINUM1, payload: [] });
  }
}

// Aluminum2 Workers
function* getWarehouseAluminum2Worker(action) {
  try {
    const { warehouseAluminum2 } = yield call(getWarehouseAluminum2);
    yield put({ type: FULL_WAREHOUSE_ALUMINUM2, payload: warehouseAluminum2 });
  } catch (err) {
    yield put({ type: FULL_WAREHOUSE_ALUMINUM2, payload: [] });
  }
}

function* addNewWarehouseAluminum2Worker(action) {
  try {
    const { warehouseAluminum2 } = yield call(
      addNewWarehouseAluminum2,
      action.payload,
    );
    yield put({ type: NEW_WAREHOUSE_ALUMINUM2, payload: warehouseAluminum2 });
  } catch (err) {
    yield put({ type: NEW_WAREHOUSE_ALUMINUM2, payload: [] });
  }
}

function* deleteWarehouseAluminum2Worker(action) {
  try {
    const { payload } = action;
    yield call(deleteWarehouseAluminum2, payload);
    yield put({ type: NEED_DELETE_WAREHOUSE_ALUMINUM2, payload });
  } catch (err) {
    yield put({ type: NEED_DELETE_WAREHOUSE_ALUMINUM2, payload: [] });
  }
}

function* updateWarehouseAluminum2Worker(action) {
  try {
    const { warehouseAluminum2 } = yield call(
      updateWarehouseAluminum2,
      action.payload,
    );
    yield put({
      type: UPDATE_WAREHOUSE_ALUMINUM2,
      payload: warehouseAluminum2,
    });
  } catch (err) {
    yield put({ type: UPDATE_WAREHOUSE_ALUMINUM2, payload: [] });
  }
}

// Grinding Balls Workers
function* getWarehouseGrindingBallsWorker(action) {
  try {
    const { warehouseGrindingBalls } = yield call(getWarehouseGrindingBalls);
    yield put({
      type: FULL_WAREHOUSE_GRINDING_BALLS,
      payload: warehouseGrindingBalls,
    });
  } catch (err) {
    yield put({ type: FULL_WAREHOUSE_GRINDING_BALLS, payload: [] });
  }
}

function* addNewWarehouseGrindingBallsWorker(action) {
  try {
    const { warehouseGrindingBalls } = yield call(
      addNewWarehouseGrindingBalls,
      action.payload,
    );
    yield put({
      type: NEW_WAREHOUSE_GRINDING_BALLS,
      payload: warehouseGrindingBalls,
    });
  } catch (err) {
    yield put({ type: NEW_WAREHOUSE_GRINDING_BALLS, payload: [] });
  }
}

function* deleteWarehouseGrindingBallsWorker(action) {
  try {
    const { payload } = action;
    yield call(deleteWarehouseGrindingBalls, payload);
    yield put({ type: NEED_DELETE_WAREHOUSE_GRINDING_BALLS, payload });
  } catch (err) {
    yield put({ type: NEED_DELETE_WAREHOUSE_GRINDING_BALLS, payload: [] });
  }
}

function* updateWarehouseGrindingBallsWorker(action) {
  try {
    const { warehouseGrindingBalls } = yield call(
      updateWarehouseGrindingBalls,
      action.payload,
    );
    yield put({
      type: UPDATE_WAREHOUSE_GRINDING_BALLS,
      payload: warehouseGrindingBalls,
    });
  } catch (err) {
    yield put({ type: UPDATE_WAREHOUSE_GRINDING_BALLS, payload: [] });
  }
}

// AAC Workers
function* getWarehouseAACWorker(action) {
  try {
    const { warehouseAAC } = yield call(getWarehouseAAC);
    yield put({ type: FULL_WAREHOUSE_AAC, payload: warehouseAAC });
  } catch (err) {
    yield put({ type: FULL_WAREHOUSE_AAC, payload: [] });
  }
}

function* addNewWarehouseAACWorker(action) {
  try {
    const { warehouseAAC } = yield call(addNewWarehouseAAC, action.payload);
    yield put({ type: NEW_WAREHOUSE_AAC, payload: warehouseAAC });
  } catch (err) {
    yield put({ type: NEW_WAREHOUSE_AAC, payload: [] });
  }
}

function* deleteWarehouseAACWorker(action) {
  try {
    const { payload } = action;
    yield call(deleteWarehouseAAC, payload);
    yield put({ type: NEED_DELETE_WAREHOUSE_AAC, payload });
  } catch (err) {
    yield put({ type: NEED_DELETE_WAREHOUSE_AAC, payload: [] });
  }
}

function* updateWarehouseAACWorker(action) {
  try {
    const { warehouseAAC } = yield call(updateWarehouseAAC, action.payload);
    yield put({ type: UPDATE_WAREHOUSE_AAC, payload: warehouseAAC });
  } catch (err) {
    yield put({ type: UPDATE_WAREHOUSE_AAC, payload: [] });
  }
}

// Sand Slurry Workers
function* getWarehouseSandSlurryWorker(action) {
  try {
    const { warehouseSandSlurry } = yield call(getWarehouseSandSlurry);
    yield put({
      type: FULL_WAREHOUSE_SAND_SLURRY,
      payload: warehouseSandSlurry,
    });
  } catch (err) {
    yield put({ type: FULL_WAREHOUSE_SAND_SLURRY, payload: [] });
  }
}

function* addNewWarehouseSandSlurryWorker(action) {
  try {
    const { warehouseSandSlurry } = yield call(
      addNewWarehouseSandSlurry,
      action.payload,
    );
    yield put({
      type: NEW_WAREHOUSE_SAND_SLURRY,
      payload: warehouseSandSlurry,
    });
  } catch (err) {
    yield put({ type: NEW_WAREHOUSE_SAND_SLURRY, payload: [] });
  }
}

// Watchers
function* warehouseRawMaterialsWatcher() {
  // Sand
  yield takeLatest(GET_FULL_WAREHOUSE_SAND, getWarehouseSandWorker);
  yield takeLatest(ADD_NEW_WAREHOUSE_SAND, addNewWarehouseSandWorker);
  yield takeLatest(DELETE_WAREHOUSE_SAND, deleteWarehouseSandWorker);
  yield takeLatest(UPDATE_NEW_WAREHOUSE_SAND, updateWarehouseSandWorker);

  // Lime
  yield takeLatest(GET_FULL_WAREHOUSE_LIME, getWarehouseLimeWorker);
  yield takeLatest(ADD_NEW_WAREHOUSE_LIME, addNewWarehouseLimeWorker);
  yield takeLatest(DELETE_WAREHOUSE_LIME, deleteWarehouseLimeWorker);
  yield takeLatest(UPDATE_NEW_WAREHOUSE_LIME, updateWarehouseLimeWorker);

  // Cement
  yield takeLatest(GET_FULL_WAREHOUSE_CEMENT, getWarehouseCementWorker);
  yield takeLatest(ADD_NEW_WAREHOUSE_CEMENT, addNewWarehouseCementWorker);
  yield takeLatest(DELETE_WAREHOUSE_CEMENT, deleteWarehouseCementWorker);
  yield takeLatest(UPDATE_NEW_WAREHOUSE_CEMENT, updateWarehouseCementWorker);

  // Gypsum
  yield takeLatest(GET_FULL_WAREHOUSE_GYPSUM, getWarehouseGypsumWorker);
  yield takeLatest(ADD_NEW_WAREHOUSE_GYPSUM, addNewWarehouseGypsumWorker);
  yield takeLatest(DELETE_WAREHOUSE_GYPSUM, deleteWarehouseGypsumWorker);
  yield takeLatest(UPDATE_NEW_WAREHOUSE_GYPSUM, updateWarehouseGypsumWorker);

  // Gypsum stone
  yield takeLatest(
    GET_FULL_WAREHOUSE_GYPSUM_STONE,
    getWarehouseGypsumStoneWorker,
  );
  yield takeLatest(
    ADD_NEW_WAREHOUSE_GYPSUM_STONE,
    addNewWarehouseGypsumStoneWorker,
  );
  yield takeLatest(
    DELETE_WAREHOUSE_GYPSUM_STONE,
    deleteWarehouseGypsumStoneWorker,
  );
  yield takeLatest(
    UPDATE_NEW_WAREHOUSE_GYPSUM_STONE,
    updateWarehouseGypsumStoneWorker,
  );

  // Aluminum1
  yield takeLatest(GET_FULL_WAREHOUSE_ALUMINUM1, getWarehouseAluminum1Worker);
  yield takeLatest(ADD_NEW_WAREHOUSE_ALUMINUM1, addNewWarehouseAluminum1Worker);
  yield takeLatest(DELETE_WAREHOUSE_ALUMINUM1, deleteWarehouseAluminum1Worker);
  yield takeLatest(
    UPDATE_NEW_WAREHOUSE_ALUMINUM1,
    updateWarehouseAluminum1Worker,
  );

  // Aluminum2
  yield takeLatest(GET_FULL_WAREHOUSE_ALUMINUM2, getWarehouseAluminum2Worker);
  yield takeLatest(ADD_NEW_WAREHOUSE_ALUMINUM2, addNewWarehouseAluminum2Worker);
  yield takeLatest(DELETE_WAREHOUSE_ALUMINUM2, deleteWarehouseAluminum2Worker);
  yield takeLatest(
    UPDATE_NEW_WAREHOUSE_ALUMINUM2,
    updateWarehouseAluminum2Worker,
  );

  // Grinding Balls
  yield takeLatest(
    GET_FULL_WAREHOUSE_GRINDING_BALLS,
    getWarehouseGrindingBallsWorker,
  );
  yield takeLatest(
    ADD_NEW_WAREHOUSE_GRINDING_BALLS,
    addNewWarehouseGrindingBallsWorker,
  );
  yield takeLatest(
    DELETE_WAREHOUSE_GRINDING_BALLS,
    deleteWarehouseGrindingBallsWorker,
  );
  yield takeLatest(
    UPDATE_NEW_WAREHOUSE_GRINDING_BALLS,
    updateWarehouseGrindingBallsWorker,
  );

  // AAC
  yield takeLatest(GET_FULL_WAREHOUSE_AAC, getWarehouseAACWorker);
  yield takeLatest(ADD_NEW_WAREHOUSE_AAC, addNewWarehouseAACWorker);
  yield takeLatest(DELETE_WAREHOUSE_AAC, deleteWarehouseAACWorker);
  yield takeLatest(UPDATE_NEW_WAREHOUSE_AAC, updateWarehouseAACWorker);

  // Sand Slurry
  yield takeLatest(
    GET_FULL_WAREHOUSE_SAND_SLURRY,
    getWarehouseSandSlurryWorker,
  );
  yield takeLatest(
    ADD_NEW_WAREHOUSE_SAND_SLURRY,
    addNewWarehouseSandSlurryWorker,
  );
}

export default warehouseRawMaterialsWatcher;
