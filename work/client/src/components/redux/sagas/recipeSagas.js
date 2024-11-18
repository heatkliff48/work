import { put, call, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import showErrorMessage from '../../Utils/showErrorMessage';
import { setToken } from '../actions/jwtAction';
import {
  ADD_NEW_RECIPE,
  DELETE_RECIPE,
  FULL_RECIPE,
  GET_FULL_RECIPE,
  NEED_DELETE_RECIPE,
  NEW_RECIPE,
  SAVE_MATERIAL_PLAN,
} from '../types/recipeTypes';

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

const getRecipe = () => {
  return url
    .get('/recipe')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewRecipe = (recipe) => {
  return url
    .post('/recipe', recipe)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const saveMaterialPlan = (material_plan) => {
  return url
    .post('/recipe_orders/', material_plan)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const deleteRecipe = (recipe_id) => {
  console.log('SAGA DELETE ID', recipe_id);
  return url
    .post('/recipe/delete', { recipe_id })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

function* getRecipeWorker(action) {
  try {
    // accessTokenFront = yield select((state) => state.jwt);
    // const { allClients, accessToken, accessTokenExpiration } = yield call(
    const { recipe } = yield call(getRecipe);

    // window.localStorage.setItem('jwt', accessToken);

    yield put({ type: FULL_RECIPE, payload: recipe });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: FULL_RECIPE, payload: [] });
  }
}

function* addNewRecipeWorker(action) {
  try {
    // accessTokenFront = yield select((state) => state.jwt);

    // const { client, accessToken, accessTokenExpiration } = yield call(
    const { recipe } = yield call(addNewRecipe, action.payload);
    // window.localStorage.setItem('jwt', accessToken);

    yield put({ type: NEW_RECIPE, payload: recipe });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: NEW_RECIPE, payload: [] });
  }
}

function* saveMaterialPlanWatcher(action) {
  try {
    yield call(saveMaterialPlan, action.payload);
  } catch (err) {
    console.log('err recipe saga', err);
  }
}

function* deleteRecipeWorker(action) {
  try {
    // accessTokenFront = yield select((state) => state.jwt);
    const { payload } = action;

    // const { client, accessToken, accessTokenExpiration } = yield call(
    yield call(deleteRecipe, payload);
    // window.localStorage.setItem('jwt', accessToken);

    yield put({ type: NEED_DELETE_RECIPE, payload });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: NEED_DELETE_RECIPE, payload: [] });
  }
}

// watchers

function* recipeWatcher() {
  yield takeLatest(GET_FULL_RECIPE, getRecipeWorker);
  yield takeLatest(ADD_NEW_RECIPE, addNewRecipeWorker);
  yield takeLatest(SAVE_MATERIAL_PLAN, saveMaterialPlanWatcher);
  yield takeLatest(DELETE_RECIPE, deleteRecipeWorker);
}

export default recipeWatcher;
