import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import showMessage from '../../Utils/showMessage';
import { errorToText } from '../../Utils/errorToText';
import {
  ADD_NEW_RAW_MAT_CONSUMPTION,
  ADD_NEW_RAW_MAT_CONSUMPTION_CURRENT_MOLDS,
  ADD_NEW_RECIPE,
  DELETE_MATERIAL_PLAN,
  DELETE_RAW_MAT_CONSUMPTION,
  DELETE_RAW_MAT_CONSUMPTION_CURRENT_MOLDS,
  DELETE_RECIPE,
  FULL_RECIPE,
  GET_FULL_RECIPE,
  GET_RAW_MAT_CONSUMPTION,
  GET_RAW_MAT_CONSUMPTION_CURRENT_MOLDS,
  GET_RECIPE_ORDERS_DATA,
  NEED_DELETE_RECIPE,
  NEW_RECIPE,
  RAW_MAT_CONSUMPTION,
  RAW_MAT_CONSUMPTION_CURRENT_MOLDS,
  RECIPE_ORDERS_DATA,
  SAVE_MATERIAL_PLAN,
  UPDATE_NEW_RECIPE,
  UPDATE_RAW_MAT_CONSUMPTION,
  UPDATE_RECIPE,
} from '../types/recipeTypes';
import {
  DELETE_RAW_MAT_CONSUMPTION_CURRENT_MOLDS_SOCKET,
  DELETE_RAW_MAT_CONSUMPTION_SOCKET,
  NEW_RAW_MAT_CONSUMPTION_CURRENT_MOLDS_SOCKET,
  NEW_RAW_MAT_CONSUMPTION_SOCKET,
  UPDT_RAW_MAT_CONSUMPTION_SOCKET,
} from '../types/socketTypes/socket';

import { getApiUrl } from '#utils/getApiUrl.js';

const url = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
});

const getRecipe = () => {
  return url
    .get('/recipe')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewRecipe = (recipe) => {
  return url
    .post('/recipe', recipe)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const updateRecipe = (recipe) => {
  return url
    .post('/recipe/update', recipe)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const deleteRecipe = (recipe_id) => {
  return url
    .post('/recipe/delete', { recipe_id })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const getRecipeOrdersData = () => {
  return url
    .get('/recipe_orders/')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const saveMaterialPlan = (material_plan) => {
  return url
    .post('/recipe_orders/', material_plan)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const deleteMaterialPlan = (material_plan_id) => {
  return url
    .post('/recipe_orders/delete', { material_plan_id })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const getRawMatConsumption = () => {
  return url
    .get('/recipe_orders/raw_mat_consumption')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewRawMatConsumption = (rawMatConsumption) => {
  return url
    .post('/recipe_orders/raw_mat_consumption', rawMatConsumption)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const updateRawMatConsumption = (rawMatConsumption) => {
  return url
    .post('/recipe_orders/raw_mat_consumption/update', rawMatConsumption)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const deleteRawMatConsumption = (rawMatConsumption) => {
  return url
    .post('/recipe_orders/raw_mat_consumption/delete', rawMatConsumption)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const getRawMatConsumptionCurrentMolds = () => {
  return url
    .get('/recipe_orders/raw_mat_consumption_current_molds')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewRawMatConsumptionCurrentMolds = (rawMatConsumption) => {
  return url
    .post('/recipe_orders/raw_mat_consumption_current_molds', rawMatConsumption)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const deleteRawMatConsumptionCurrentMolds = (rawMatConsumption) => {
  return url
    .post(
      '/recipe_orders/raw_mat_consumption_current_molds/delete',
      rawMatConsumption,
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

function* getRecipeWorker(action) {
  try {
    const { recipe } = yield call(getRecipe);

    yield put({ type: FULL_RECIPE, payload: recipe });
  } catch (err) {
    yield put({ type: FULL_RECIPE, payload: [] });
  }
}

function* addNewRecipeWorker(action) {
  try {
    const { recipe } = yield call(addNewRecipe, action.payload);

    yield put({ type: NEW_RECIPE, payload: recipe });
  } catch (err) {
    yield put({ type: NEW_RECIPE, payload: [] });
  }
}

function* updateRecipeWorker(action) {
  try {
    const { recipe } = yield call(updateRecipe, action.payload);

    yield put({ type: UPDATE_NEW_RECIPE, payload: recipe });
  } catch (err) {
    yield put({ type: UPDATE_NEW_RECIPE, payload: [] });
  }
}

function* deleteRecipeWorker(action) {
  try {
    const { payload } = action;

    yield call(deleteRecipe, payload);

    yield put({ type: NEED_DELETE_RECIPE, payload });
  } catch (err) {
    yield put({ type: NEED_DELETE_RECIPE, payload: [] });
  }
}

function* getRecipeOrdersDataWatcher() {
  try {
    const data = yield call(getRecipeOrdersData);
    yield put({ type: RECIPE_ORDERS_DATA, payload: data });
  } catch (err) {
    console.log('err recipe saga', err);
  }
}

function* saveMaterialPlanWatcher(action) {
  try {
    yield call(saveMaterialPlan, action.payload);
  } catch (err) {
    console.log('err recipe saga', err);
  }
}

function* deleteMaterialPlanWatcher(action) {
  try {
    yield call(deleteMaterialPlan, action.payload);
  } catch (err) {
    console.log('err recipe saga', err);
  }
}

function* getRawMatConsumptionWorker(action) {
  try {
    const rawMatConsumption = yield call(getRawMatConsumption);

    yield put({ type: RAW_MAT_CONSUMPTION, payload: rawMatConsumption });
  } catch (err) {
    yield put({ type: RAW_MAT_CONSUMPTION, payload: [] });
  }
}

function* addNewRawMatConsumptionWorker(action) {
  try {
    yield call(addNewRawMatConsumption, action.payload);
  } catch (err) {
    yield put({ type: NEW_RAW_MAT_CONSUMPTION_SOCKET, payload: [] });
  }
}

function* updateRawMatConsumptionWorker(action) {
  try {
    yield call(updateRawMatConsumption, action.payload);
  } catch (err) {
    yield put({ type: UPDT_RAW_MAT_CONSUMPTION_SOCKET, payload: [] });
  }
}

function* deleteRawMatConsumptionWorker(action) {
  try {
    yield call(deleteRawMatConsumption, action.payload);
  } catch (err) {
    yield put({ type: DELETE_RAW_MAT_CONSUMPTION_SOCKET, payload: [] });
  }
}

function* getRawMatConsumptionCurrentMoldsWorker(action) {
  try {
    const rawMatConsumption = yield call(getRawMatConsumptionCurrentMolds);

    yield put({
      type: RAW_MAT_CONSUMPTION_CURRENT_MOLDS,
      payload: rawMatConsumption,
    });
  } catch (err) {
    yield put({ type: RAW_MAT_CONSUMPTION_CURRENT_MOLDS, payload: [] });
  }
}

function* addNewRawMatConsumptionCurrentMoldsWorker(action) {
  try {
    yield call(addNewRawMatConsumptionCurrentMolds, action.payload);
  } catch (err) {
    yield put({
      type: NEW_RAW_MAT_CONSUMPTION_CURRENT_MOLDS_SOCKET,
      payload: [],
    });
  }
}

function* deleteRawMatConsumptionCurrentMoldsWorker(action) {
  try {
    yield call(deleteRawMatConsumptionCurrentMolds, action.payload);
  } catch (err) {
    yield put({
      type: DELETE_RAW_MAT_CONSUMPTION_CURRENT_MOLDS_SOCKET,
      payload: [],
    });
  }
}
// watchers

function* recipeWatcher() {
  yield takeLatest(GET_FULL_RECIPE, getRecipeWorker);
  yield takeLatest(ADD_NEW_RECIPE, addNewRecipeWorker);
  yield takeLatest(UPDATE_RECIPE, updateRecipeWorker);
  yield takeLatest(DELETE_RECIPE, deleteRecipeWorker);

  yield takeLatest(SAVE_MATERIAL_PLAN, saveMaterialPlanWatcher);
  yield takeLatest(DELETE_MATERIAL_PLAN, deleteMaterialPlanWatcher);
  yield takeLatest(GET_RECIPE_ORDERS_DATA, getRecipeOrdersDataWatcher);

  yield takeLatest(GET_RAW_MAT_CONSUMPTION, getRawMatConsumptionWorker);
  yield takeLatest(ADD_NEW_RAW_MAT_CONSUMPTION, addNewRawMatConsumptionWorker);
  yield takeLatest(UPDATE_RAW_MAT_CONSUMPTION, updateRawMatConsumptionWorker);
  yield takeLatest(DELETE_RAW_MAT_CONSUMPTION, deleteRawMatConsumptionWorker);

  yield takeLatest(
    GET_RAW_MAT_CONSUMPTION_CURRENT_MOLDS,
    getRawMatConsumptionCurrentMoldsWorker,
  );
  yield takeLatest(
    ADD_NEW_RAW_MAT_CONSUMPTION_CURRENT_MOLDS,
    addNewRawMatConsumptionCurrentMoldsWorker,
  );
  yield takeLatest(
    DELETE_RAW_MAT_CONSUMPTION_CURRENT_MOLDS,
    deleteRawMatConsumptionCurrentMoldsWorker,
  );
}

export default recipeWatcher;
