import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import showMessage from '../../Utils/showMessage';
import { errorToText } from '../../Utils/errorToText';
import {
  ADD_NEW_PRODUCT,
  ALL_PRODUCTS,
  CHANGE_PRODUCT_PRICES,
  FIX_PRODUCT_ARTICLES,
  GET_ALL_PRODUCTS,
  NEED_UPDATE_PRODUCT,
  NEW_PRODUCT,
  REP_PRODUCT,
  REPAIR_PRODUCT,
  UPDATE_PRODUCT,
} from '../types/productsTypes';

import { getApiUrl } from '#utils/getApiUrl.js';

const url = axios.create({
  baseURL: getApiUrl(),
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

const fixProductArticles = (changes) => {
  return url
    .post('/products/fix-articles', { changes })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const changeProductPrices = (changes) => {
  return url
    .post('/products/change-prices', { changes })
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

function* fixProductArticlesWatcher(action) {
  try {
    yield call(fixProductArticles, action.payload);
    showMessage(`Articles fixed: ${action.payload.length}`, 'success');
    yield put({ type: GET_ALL_PRODUCTS });
  } catch (err) {
    console.error('Error in fixProductArticlesWatcher:', err);
  }
}

// Новые версии продуктов приходят всем клиентам через ADD_NEW_PRODUCT_SOCKET
function* changeProductPricesWatcher(action) {
  try {
    const { created } = yield call(changeProductPrices, action.payload);
    showMessage(`New product versions: ${created}`, 'success');
  } catch (err) {
    console.error('Error in changeProductPricesWatcher:', err);
  }
}

function* productsWatcher() {
  yield takeLatest(GET_ALL_PRODUCTS, getAllProductsWatcher);
  yield takeLatest(ADD_NEW_PRODUCT, addNewProductWatcher);
  yield takeLatest(NEED_UPDATE_PRODUCT, updateProductWatcher);
  yield takeLatest(REPAIR_PRODUCT, repairProductWatcher);
  yield takeLatest(FIX_PRODUCT_ARTICLES, fixProductArticlesWatcher);
  yield takeLatest(CHANGE_PRODUCT_PRICES, changeProductPricesWatcher);
}

export default productsWatcher;
