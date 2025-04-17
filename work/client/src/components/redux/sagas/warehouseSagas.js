import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import showErrorMessage from '../../Utils/showErrorMessage';
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
  UPDATE_ORDERED_PRODUCTION_OEM,
  UPDATE_ORDERED_PRODUCTION,
  UPD_RESERVED_PRODUCT,
  UPDATE_RESERVED_PRODUCT,
  WAREHOSE_QUANTITYS,
  UPDATE_WAREHOSE_QUANTITYS,
} from '../types/warehouseTypes';

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

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

const updateWhQuantitys = (upd_rem_srock) => {
  return url
    .post('/warehouse/upd/quantitys', upd_rem_srock)
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

const updReservedProduct = (reserved_product) => {
  return url
    .post('/warehouse/reserved/product/upd', reserved_product)
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

const updListOfOrderedProduction = (ordered_production) => {
  return url
    .post('/warehouse/ordered_production/update', ordered_production)
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

const updListOfOrderedProductionOEM = (ordered_production_oem) => {
  return url
    .post('/warehouse/ordered_production_oem/update', ordered_production_oem)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

function* getAllWarehouseWatcher() {
  try {
    const { warehouse } = yield call(getAllWarehouse);

    yield put({ type: ALL_WAREHOUSE, payload: warehouse });
  } catch (err) {
    yield put({ type: ALL_WAREHOUSE, payload: [] });
  }
}

function* getListOfReservedProductsWatcher() {
  try {
    const { listOfReservedProducts } = yield call(getListOfReservedProducts);

    yield put({ type: LIST_OF_RESERVED_PRODUCTS, payload: listOfReservedProducts });
  } catch (err) {
    yield put({ type: LIST_OF_RESERVED_PRODUCTS, payload: [] });
  }
}

function* addNewWarehouseWatcher(action) {
  try {
    yield call(addNewWarehouse, action.payload);
  } catch (err) {
    yield put({ type: NEW_WAREHOUSE, payload: [] });
  }
}

function* updRemainingStockWatcher(action) {
  try {
    const { payload } = action;
    const updWarehouse = yield call(updateRemStock, payload);
    yield put({ type: REMAINING_STOCK, payload: updWarehouse });
  } catch (err) {
    yield put({ type: REMAINING_STOCK, payload: [] });
  }
}

function* updateWhQuantitysWatcher(action) {
  try {
    const { payload } = action;
    const updWarehouse = yield call(updateWhQuantitys, payload);
    yield put({ type: WAREHOSE_QUANTITYS, payload: updWarehouse });
  } catch (err) {
    yield put({ type: WAREHOSE_QUANTITYS, payload: [] });
  }
}

function* addNewReservedProductWatcher(action) {
  try {
    const { new_reserved_product } = yield call(
      addNewReservedProduct,
      action.payload
    );

    yield put({ type: NEW_RESERVED_PRODUCT, payload: new_reserved_product });
  } catch (err) {
    yield put({ type: NEW_RESERVED_PRODUCT, payload: [] });
  }
}

function* updReservedProductWatcher(action) {
  try {
    const { new_reserved_product } = yield call(updReservedProduct, action.payload);

    yield put({ type: UPD_RESERVED_PRODUCT, payload: new_reserved_product });
  } catch (err) {
    yield put({ type: UPD_RESERVED_PRODUCT, payload: [] });
  }
}

function* deleteReservedProductWatcher(action) {
  try {
    const { payload } = action;
    yield call(deleteReservedProduct, payload);
  } catch (err) {
    yield put({ type: DELETE_PRODUCT_FROM_RESERVED_LIST, payload: [] });
  }
}

function* getListOfOrderedProductionWatcher() {
  try {
    const { orderedProduction } = yield call(getListOfOrderedProduction);

    yield put({ type: LIST_OF_ORDERED_PRODUCTION, payload: orderedProduction });
  } catch (err) {
    yield put({ type: LIST_OF_ORDERED_PRODUCTION, payload: [] });
  }
}

function* addNewListOfOrderedProductionWatcher(action) {
  try {
    const { new_ordered_production } = yield call(
      addNewListOfOrderedProduction,
      action.payload
    );

    yield put({ type: NEW_ORDERED_PRODUCTION, payload: new_ordered_production });
  } catch (err) {
    yield put({ type: NEW_ORDERED_PRODUCTION, payload: [] });
  }
}

function* updListOfOrderedProductionWorker(action) {
  try {
    const { ordered_production } = yield call(
      updListOfOrderedProduction,
      action.payload
    );

    yield put({
      type: NEW_ORDERED_PRODUCTION,
      payload: ordered_production,
    });
  } catch (err) {
    yield put({ type: NEW_ORDERED_PRODUCTION, payload: [] });
  }
}

function* getListOfOrderedProductionOEMWatcher() {
  try {
    const { orderedProductionOEM } = yield call(getListOfOrderedProductionOEM);

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
    const { new_ordered_production_OEM } = yield call(
      addNewListOfOrderedProductionOEM,
      action.payload
    );

    yield put({
      type: NEW_ORDERED_PRODUCTION_OEM,
      payload: new_ordered_production_OEM,
    });
  } catch (err) {
    yield put({ type: NEW_ORDERED_PRODUCTION_OEM, payload: [] });
  }
}

function* updListOfOrderedProductionOEMWorker(action) {
  try {
    const { upd_ordered_production_oem } = yield call(
      updListOfOrderedProductionOEM,
      action.payload
    );

    yield put({
      type: NEW_ORDERED_PRODUCTION_OEM,
      payload: upd_ordered_production_oem,
    });
  } catch (err) {
    yield put({ type: NEW_ORDERED_PRODUCTION_OEM, payload: [] });
  }
}

function* warehouseWatcher() {
  yield takeLatest(GET_ALL_WAREHOUSE, getAllWarehouseWatcher);
  yield takeLatest(GET_LIST_OF_RESERVED_PRODUCTS, getListOfReservedProductsWatcher);
  yield takeLatest(ADD_NEW_WAREHOUSE, addNewWarehouseWatcher);

  yield takeLatest(UPDATE_REMAINING_STOCK, updRemainingStockWatcher);
  yield takeLatest(UPDATE_WAREHOSE_QUANTITYS, updateWhQuantitysWatcher);

  yield takeLatest(ADD_NEW_RESERVED_PRODUCT, addNewReservedProductWatcher);
  yield takeLatest(UPDATE_RESERVED_PRODUCT, updReservedProductWatcher);

  yield takeLatest(
    GET_DELETE_PRODUCT_FROM_RESERVED_LIST,
    deleteReservedProductWatcher
  );
  yield takeLatest(
    GET_LIST_OF_ORDERED_PRODUCTION,
    getListOfOrderedProductionWatcher
  );
  yield takeLatest(ADD_NEW_ORDERED_PRODUCTION, addNewListOfOrderedProductionWatcher);
  yield takeLatest(UPDATE_ORDERED_PRODUCTION, updListOfOrderedProductionWorker);
  yield takeLatest(
    GET_LIST_OF_ORDERED_PRODUCTION_OEM,
    getListOfOrderedProductionOEMWatcher
  );
  yield takeLatest(
    ADD_NEW_ORDERED_PRODUCTION_OEM,
    addNewListOfOrderedProductionOEMWatcher
  );
  yield takeLatest(
    UPDATE_ORDERED_PRODUCTION_OEM,
    updListOfOrderedProductionOEMWorker
  );
}

export default warehouseWatcher;
