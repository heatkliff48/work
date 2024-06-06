import { put, call, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import showErrorMessage from '../../Utils/showErrorMessage';
import {
  ADD_NEW_PRODUCT,
  ALL_PRODUCTS,
  GET_ALL_PRODUCTS,
  NEED_UPDATE_PRODUCT,
  NEW_PRODUCT,
  UPDATE_PRODUCT,
} from '../types/productsTypes';
import { setToken } from '../actions/jwtAction';

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

// function* getAccessTokenFromStore() {
//   const accessToken = yield select((state) => state.jwt);
//   return accessToken;
// }

// url.interceptors.request.use(
//   async (config) => {
//     const accessToken = await getAccessTokenFromStore().next().value;

//     if (accessToken) config.headers['Authorization'] = `Bearer ${accessToken}`;

//     return config;
//   },
//   (err) => Promise.reject(err)
// );

const getAllProducts = (user) => {
  return url
    .post('/products/all', { user })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const updateProducts = ({ product, user }) => {
  return url
    .post('/products/upd', { product, user })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewProduct = ({ product, user }) => {
  return url
    .post('/products/add', { product, user })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

function* getAllProductsWatcher(action) {
  try {
    const data = yield call(getAllProducts, action.payload);
    console.log('PROD SAGA', data);

    yield put({ type: ALL_PRODUCTS, payload: data.products });
    yield put(setToken(data.accessToken, data.accessTokenExpiration));
  } catch (err) {
    yield put({ type: ALL_PRODUCTS, payload: [] });
  }
}

function* updateProductWatcher(action) {
  try {
    const data = yield call(updateProducts, action.payload);

    yield put({ type: UPDATE_PRODUCT, payload: data.products });
    yield put(setToken(data.accessToken, data.accessTokenExpiration));
  } catch (err) {
    yield put({ type: UPDATE_PRODUCT, payload: [] });
  }
}

function* addNewProductWatcher(action) {
  try {
    console.log(action.payload);
    const { products, accessToken, accessTokenExpiration } = yield call(
      addNewProduct,
      action.payload
    );
    console.log('FROM BACK', products);
    yield put({ type: NEW_PRODUCT, payload: products });
    yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: NEW_PRODUCT, payload: [] });
  }
}

function* productsWatcher() {
  yield takeLatest(GET_ALL_PRODUCTS, getAllProductsWatcher);
  yield takeLatest(ADD_NEW_PRODUCT, addNewProductWatcher);
  yield takeLatest(NEED_UPDATE_PRODUCT, updateProductWatcher);
}

export default productsWatcher;
