import { put, call, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import showErrorMessage from '../../Utils/showErrorMessage';
// import { setToken } from '../actions/jwtAction';
import {
  ADD_NEW_ORDERED_PRODUCTION,
  ADD_NEW_RESERVED_PRODUCT,
  ADD_NEW_WAREHOUSE,
  ALL_WAREHOUSE,
  LIST_OF_ORDERED_PRODUCTION,
  DELETE_PRODUCT_FROM_RESERVED_LIST,
  GET_ALL_WAREHOUSE,
  GET_LIST_OF_ORDERED_PRODUCTION,
  GET_DELETE_PRODUCT_FROM_RESERVED_LIST,
  GET_LIST_OF_RESERVED_PRODUCTS,
  LIST_OF_RESERVED_PRODUCTS,
  NEW_ORDERED_PRODUCTION,
  NEW_RESERVED_PRODUCT,
  NEW_WAREHOUSE,
  REMAINING_STOCK,
  UPDATE_REMAINING_STOCK,
  LIST_OF_ORDERED_PRODUCTION_OEM,
  NEW_ORDERED_PRODUCTION_OEM,
  GET_LIST_OF_ORDERED_PRODUCTION_OEM,
  ADD_NEW_ORDERED_PRODUCTION_OEM,
} from '../types/warehouseTypes';

// let accessTokenFront;

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

// url.interceptors.request.use(
//   async (config) => {
//     if (accessTokenFront) {
//       config.headers['Authorization'] = `Bearer ${accessTokenFront}`;
//     }

//     return config;
//   },
//   (error) => {
//     console.log('Interceptor: Request error', error);
//     return Promise.reject(error);
//   }
// );

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

const getListOfOrderedProduction = () => {
  return url
    .get('/warehouse/ordered_production')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewListOfOrderedProduction = (ordered_production) => {
  return url
    .post('/warehouse/ordered_production/add', ordered_production)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const getListOfOrderedProductionOEM = () => {
  return url
    .get('/warehouse/ordered_production_oem')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewListOfOrderedProductionOEM = (ordered_production_oem) => {
  return url
    .post('/warehouse/ordered_production_oem/add', ordered_production_oem)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

function* getAllWarehouseWatcher() {
  try {
    // accessTokenFront = yield select((state) => state.jwt);

    // const { warehouse, accessToken, accessTokenExpiration } = yield call(
    const { warehouse } = yield call(getAllWarehouse);

    // window.localStorage.setItem('jwt', accessToken);

    // yield put(setToken({ accessToken, accessTokenExpiration }));
    yield put({ type: ALL_WAREHOUSE, payload: warehouse });
  } catch (err) {
    yield put({ type: ALL_WAREHOUSE, payload: [] });
  }
}

function* getListOfReservedProductsWatcher() {
  try {
    // accessTokenFront = yield select((state) => state.jwt);

    // const { listOfReservedProducts, accessToken, accessTokenExpiration } =
    const { listOfReservedProducts } = yield call(getListOfReservedProducts);

    // window.localStorage.setItem('jwt', accessToken);

    // yield put(setToken({ accessToken, accessTokenExpiration }));
    yield put({ type: LIST_OF_RESERVED_PRODUCTS, payload: listOfReservedProducts });
  } catch (err) {
    yield put({ type: LIST_OF_RESERVED_PRODUCTS, payload: [] });
  }
}

function* addNewWarehouseWatcher(action) {
  try {
    // accessTokenFront = yield select((state) => state.jwt);

    // const { new_warehouse, accessToken, accessTokenExpiration } = yield call(
    const { new_warehouse } = yield call(addNewWarehouse, action.payload);

    // window.localStorage.setItem('jwt', accessToken);

    yield put({ type: NEW_WAREHOUSE, payload: new_warehouse });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: NEW_WAREHOUSE, payload: [] });
  }
}

function* updRemainingStockWatcher(action) {
  try {
    const { payload } = action;
    // accessTokenFront = yield select((state) => state.jwt);

    // const { accessToken, accessTokenExpiration } = yield call(
    yield call(updateRemStock, payload);

    // window.localStorage.setItem('jwt', accessToken);

    yield put({ type: REMAINING_STOCK, payload });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: REMAINING_STOCK, payload: [] });
  }
}

function* addNewReservedProductWatcher(action) {
  try {
    // accessTokenFront = yield select((state) => state.jwt);

    // const { new_reserved_product, accessToken, accessTokenExpiration } = yield call(
    const { new_reserved_product } = yield call(
      addNewReservedProduct,
      action.payload
    );

    // window.localStorage.setItem('jwt', accessToken);

    yield put({ type: NEW_RESERVED_PRODUCT, payload: new_reserved_product });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: NEW_RESERVED_PRODUCT, payload: [] });
  }
}

function* deleteReservedProductWatcher(action) {
  try {
    const { payload } = action;
    // accessTokenFront = yield select((state) => state.jwt);

    // const { accessToken, accessTokenExpiration } = yield call(
    yield call(deleteReservedProduct, payload);

    // window.localStorage.setItem('jwt', accessToken);

    yield put({
      type: DELETE_PRODUCT_FROM_RESERVED_LIST,
      payload,
    });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: DELETE_PRODUCT_FROM_RESERVED_LIST, payload: [] });
  }
}

function* getListOfOrderedProductionWatcher() {
  try {
    // accessTokenFront = yield select((state) => state.jwt);

    // const { orderedProduction, accessToken, accessTokenExpiration } = yield call(
    const { orderedProduction} = yield call(
      getListOfOrderedProduction
    );

    // window.localStorage.setItem('jwt', accessToken);

    // yield put(setToken({ accessToken, accessTokenExpiration }));
    yield put({ type: LIST_OF_ORDERED_PRODUCTION, payload: orderedProduction });
  } catch (err) {
    yield put({ type: LIST_OF_ORDERED_PRODUCTION, payload: [] });
  }
}

function* addNewListOfOrderedProductionWatcher(action) {
  try {
    // accessTokenFront = yield select((state) => state.jwt);

    // const { new_ordered_production, accessToken, accessTokenExpiration } =
    const { new_ordered_production } =
      yield call(addNewListOfOrderedProduction, action.payload);

    // window.localStorage.setItem('jwt', accessToken);

    yield put({ type: NEW_ORDERED_PRODUCTION, payload: new_ordered_production });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: NEW_ORDERED_PRODUCTION, payload: [] });
  }
}

function* getListOfOrderedProductionOEMWatcher() {
  try {
    // accessTokenFront = yield select((state) => state.jwt);

    // const { orderedProductionOEM, accessToken, accessTokenExpiration } = yield call(
    const { orderedProductionOEM } = yield call(
      getListOfOrderedProductionOEM
    );

    // window.localStorage.setItem('jwt', accessToken);

    // yield put(setToken({ accessToken, accessTokenExpiration }));
    yield put({
      type: LIST_OF_ORDERED_PRODUCTION_OEM,
      payload: orderedProductionOEM,
    });
  } catch (err) {
    yield put({ type: LIST_OF_ORDERED_PRODUCTION_OEM, payload: [] });
  }
}

function* addNewListOfOrderedProductionOEMWatcher(action) {
  try {
    // accessTokenFront = yield select((state) => state.jwt);

    // const { new_ordered_production_OEM, accessToken, accessTokenExpiration } =
    const { new_ordered_production_OEM } =
      yield call(addNewListOfOrderedProductionOEM, action.payload);

    // window.localStorage.setItem('jwt', accessToken);

    yield put({
      type: NEW_ORDERED_PRODUCTION_OEM,
      payload: new_ordered_production_OEM,
    });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: NEW_ORDERED_PRODUCTION_OEM, payload: [] });
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
  yield takeLatest(
    GET_LIST_OF_ORDERED_PRODUCTION,
    getListOfOrderedProductionWatcher
  );
  yield takeLatest(ADD_NEW_ORDERED_PRODUCTION, addNewListOfOrderedProductionWatcher);
  yield takeLatest(
    GET_LIST_OF_ORDERED_PRODUCTION_OEM,
    getListOfOrderedProductionOEMWatcher
  );
  yield takeLatest(
    ADD_NEW_ORDERED_PRODUCTION_OEM,
    addNewListOfOrderedProductionOEMWatcher
  );
}

export default warehouseWatcher;
