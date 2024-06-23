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
//   console.log('getAccessTokenFromStore');
//   const accessTokenEffect = yield select((state) => state.jwt);
//   const accessToken = accessTokenEffect;
//   console.log('getAccessTokenFromStore>>>>>>>>>>', accessToken);
//   return accessToken;
// }

// url.interceptors.request.use(
//   async (config) => {
//     console.log('url.interceptors.request');
//     const accessTokenGenerator = getAccessTokenFromStore();
//     const accessToken = yield accessTokenGenerator.next().value;
//     console.log('url.interceptors.request', accessToken);
//     console.log('CONFIG', config);

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
    console.log('PROD UPDATE SAGA', data);


    yield put({ type: UPDATE_PRODUCT, payload: data.products });
    yield put(setToken(data.accessToken, data.accessTokenExpiration));
  } catch (err) {
    yield put({ type: UPDATE_PRODUCT, payload: [] });
  }
}

function* addNewProductWatcher(action) {
  try {
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
