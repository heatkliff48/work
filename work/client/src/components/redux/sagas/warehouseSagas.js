import { put, call, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import showErrorMessage from '../../Utils/showErrorMessage';
import { setToken } from '../actions/jwtAction';
import {
  ADD_NEW_RESERVED_PRODUCT,
  ADD_NEW_WAREHOUSE,
  ALL_WAREHOUSE,
  DELETE_PRODUCT_FROM_RESERVED_LIST,
  GET_ALL_WAREHOUSE,
  GET_DELETE_PRODUCT_FROM_RESERVED_LIST,
  GET_LIST_OF_RESERVED_PRODUCTS,
  LIST_OF_RESERVED_PRODUCTS,
  NEW_RESERVED_PRODUCT,
  NEW_WAREHOUSE,
  REMAINING_STOCK,
  UPDATE_REMAINING_STOCK,
} from '../types/warehouseTypes';

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

const getAllWarehouse = () => {
  return url
    .get('/warehouse')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const getListOfReservedProducts = () => {
  return url
    .get('/warehouse/reserved/product')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewWarehouse = (new_warehouse) => {
  return url
    .post('/warehouse/add', new_warehouse)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const updateRemStock = (upd_rem_srock) => {
  return url
    .post('/warehouse/upd/remaining_stock', upd_rem_srock)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewReservedProduct = (reserved_product) => {
  return url
    .post('/warehouse/reserved/product/add', reserved_product)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const deleteReservedProduct = (id) => {
  return url
    .post('/warehouse/reserved/product/delete', { id })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

function* getAllWarehouseWatcher() {
  try {
    accessTokenFront = yield select((state) => state.jwt);

    const { warehouse, accessToken, accessTokenExpiration } = yield call(
      getAllWarehouse
    );

    window.localStorage.setItem('jwt', accessToken);

    yield put(setToken({ accessToken, accessTokenExpiration }));
    yield put({ type: ALL_WAREHOUSE, payload: warehouse });
  } catch (err) {
    yield put({ type: ALL_WAREHOUSE, payload: [] });
  }
}

function* getListOfReservedProductsWatcher() {
  try {
    accessTokenFront = yield select((state) => state.jwt);

    const { listOfReservedProducts, accessToken, accessTokenExpiration } =
      yield call(getListOfReservedProducts);

    window.localStorage.setItem('jwt', accessToken);

    yield put(setToken({ accessToken, accessTokenExpiration }));
    yield put({ type: LIST_OF_RESERVED_PRODUCTS, payload: listOfReservedProducts });
  } catch (err) {
    yield put({ type: LIST_OF_RESERVED_PRODUCTS, payload: [] });
  }
}

function* addNewWarehouseWatcher(action) {
  try {
    accessTokenFront = yield select((state) => state.jwt);

    const { new_warehouse, accessToken, accessTokenExpiration } = yield call(
      addNewWarehouse,
      action.payload
    );

    window.localStorage.setItem('jwt', accessToken);

    yield put({ type: NEW_WAREHOUSE, payload: new_warehouse });
    yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: NEW_WAREHOUSE, payload: [] });
  }
}

function* updRemainingStockWatcher(action) {
  try {
    const { payload } = action;
    accessTokenFront = yield select((state) => state.jwt);

    const { accessToken, accessTokenExpiration } = yield call(
      updateRemStock,
      payload
    );

    window.localStorage.setItem('jwt', accessToken);

    yield put({ type: REMAINING_STOCK, payload });
    yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: REMAINING_STOCK, payload: [] });
  }
}

function* addNewReservedProductWatcher(action) {
  try {
    const { payload } = action;
    accessTokenFront = yield select((state) => state.jwt);

    const { accessToken, accessTokenExpiration } = yield call(
      addNewReservedProduct,
      payload
    );

    window.localStorage.setItem('jwt', accessToken);

    yield put({ type: NEW_RESERVED_PRODUCT, payload });
    yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: NEW_RESERVED_PRODUCT, payload: [] });
  }
}

function* deleteReservedProductWatcher(action) {
  try {
    const { payload } = action;
    accessTokenFront = yield select((state) => state.jwt);

    const { accessToken, accessTokenExpiration } = yield call(
      deleteReservedProduct,
      payload
    );

    window.localStorage.setItem('jwt', accessToken);

    yield put({
      type: DELETE_PRODUCT_FROM_RESERVED_LIST,
      payload,
    });
    yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: DELETE_PRODUCT_FROM_RESERVED_LIST, payload: [] });
  }
}

function* warehouseWatcher() {
  yield takeLatest(GET_ALL_WAREHOUSE, getAllWarehouseWatcher);
  yield takeLatest(GET_LIST_OF_RESERVED_PRODUCTS, getListOfReservedProductsWatcher);
  yield takeLatest(ADD_NEW_WAREHOUSE, addNewWarehouseWatcher);
  yield takeLatest(UPDATE_REMAINING_STOCK, updRemainingStockWatcher);
  yield takeLatest(ADD_NEW_RESERVED_PRODUCT, addNewReservedProductWatcher);
  yield takeLatest(
    GET_DELETE_PRODUCT_FROM_RESERVED_LIST,
    deleteReservedProductWatcher
  );
}

export default warehouseWatcher;
