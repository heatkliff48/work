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

let accessTokenFront;

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

url.interceptors.request.use(
  async (config) => {
    if (accessTokenFront) {
      config.headers['Authorization'] = `Bearer ${accessTokenFront}`;
    }
    return config;
  },
  (error) => {
    console.log('Interceptor: Request error', error);
    return Promise.reject(error);
  }
);

const getAllProducts = () => {
  return url
    .get('/products/all')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const updateProducts = ({ product }) => {
  return url
    .post('/products/upd', { product })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewProduct = ({ product }) => {
  return url
    .post('/products/add', { product })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

function* getAllProductsWatcher() {
  try {
    accessTokenFront = yield select((state) => state.jwt);
    const { products, accessToken, accessTokenExpiration } = yield call(
      getAllProducts
    );

    window.localStorage.setItem('jwt', accessToken);

    yield put({ type: ALL_PRODUCTS, payload: products });
    yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    console.error('Error in getAllProductsWatcher:', err);
    yield put({ type: ALL_PRODUCTS, payload: [] });
  }
}

function* updateProductWatcher(action) {
  try {
    accessTokenFront = yield select((state) => state.jwt);
    const { products, accessToken, accessTokenExpiration } = yield call(
      updateProducts,
      action.payload
    );
    window.localStorage.setItem('jwt', accessToken);

    yield put({ type: UPDATE_PRODUCT, payload: products });
    yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: UPDATE_PRODUCT, payload: [] });
  }
}

function* addNewProductWatcher(action) {
  try {
    accessTokenFront = yield select((state) => state.jwt);
    const { products, accessToken, accessTokenExpiration } = yield call(
      addNewProduct,
      action.payload
    );
    window.localStorage.setItem('jwt', accessToken);

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
