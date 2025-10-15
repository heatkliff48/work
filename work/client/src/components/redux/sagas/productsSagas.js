import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import showMessage from '../../Utils/showMessage';
import { errorToText } from '../../Utils/errorToText';
import {
  ADD_NEW_PRODUCT,
  ALL_PRODUCTS,
  GET_ALL_PRODUCTS,
  NEED_UPDATE_PRODUCT,
  NEW_PRODUCT,
  REP_PRODUCT,
  REPAIR_PRODUCT,
  UPDATE_PRODUCT,
} from '../types/productsTypes';

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

const getAllProducts = () => {
  return url
    .get('/products/all')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const updateProducts = (product) => {
  return url
    .post('/products/upd', product)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const repairProduct = (repProduct) => {
  return url
    .post('/products/rep', repProduct)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewProduct = (product) => {
  return url
    .post('/products/add', product)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

function* getAllProductsWatcher() {
  try {
    const { products } = yield call(getAllProducts);

    yield put({ type: ALL_PRODUCTS, payload: products });
  } catch (err) {
    console.error('Error in getAllProductsWatcher:', err);
    yield put({ type: ALL_PRODUCTS, payload: [] });
  }
}

function* updateProductWatcher(action) {
  try {
    yield call(updateProducts, action.payload);
  } catch (err) {
    yield put({ type: UPDATE_PRODUCT, payload: [] });
  }
}

function* repairProductWatcher(action) {
  try {
    yield call(repairProduct, action.payload);
  } catch (err) {
    yield put({ type: REP_PRODUCT, payload: [] });
  }
}

function* addNewProductWatcher(action) {
  try {
    yield call(addNewProduct, action.payload);
  } catch (err) {
    yield put({ type: NEW_PRODUCT, payload: [] });
  }
}

function* productsWatcher() {
  yield takeLatest(GET_ALL_PRODUCTS, getAllProductsWatcher);
  yield takeLatest(ADD_NEW_PRODUCT, addNewProductWatcher);
  yield takeLatest(NEED_UPDATE_PRODUCT, updateProductWatcher);
  yield takeLatest(REPAIR_PRODUCT, repairProductWatcher);
}

export default productsWatcher;
