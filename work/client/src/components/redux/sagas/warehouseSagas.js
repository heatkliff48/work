import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import showErrorMessage from '../../Utils/showErrorMessage';
import {
  ADD_NEW_ORDERED_PRODUCTION,
  ADD_NEW_RESERVED_PRODUCT,
  ADD_NEW_WAREHOUSE,
  ALL_WAREHOUSE,
  LIST_OF_ORDERED_PRODUCTION,
  GET_ALL_WAREHOUSE,
  GET_LIST_OF_ORDERED_PRODUCTION,
  GET_DELETE_PRODUCT_FROM_RESERVED_LIST,
  GET_LIST_OF_RESERVED_PRODUCTS,
  LIST_OF_RESERVED_PRODUCTS,
  NEW_WAREHOUSE,
  REMAINING_STOCK,
  UPDATE_REMAINING_STOCK,
  LIST_OF_ORDERED_PRODUCTION_OEM,
  GET_LIST_OF_ORDERED_PRODUCTION_OEM,
  ADD_NEW_ORDERED_PRODUCTION_OEM,
  UPDATE_ORDERED_PRODUCTION_OEM,
  UPDATE_ORDERED_PRODUCTION,
  UPD_RESERVED_PRODUCT,
  UPDATE_RESERVED_PRODUCT,
  WAREHOSE_QUANTITYS,
  UPDATE_WAREHOSE_QUANTITYS,
  LIST_OF_DRY_MIXED_RESERVED_PRODUCTS,
  LIST_OF_ANCHOR_RESERVED_PRODUCTS,
  LIST_OF_TOOL_RESERVED_PRODUCTS,
  LIST_OF_REL_MAT_PRODUCTS,
  GET_LIST_OF_DRY_MIXED_RESERVED_PRODUCTS,
  ADD_NEW_DRY_MIXED_RESERVED_PRODUCT,
  UPDATE_DRY_MIXED_RESERVED_PRODUCT,
  GET_DELETE_PRODUCT_FROM_DRY_MIXED_RESERVED_LIST,
  GET_LIST_OF_ANCHOR_RESERVED_PRODUCTS,
  ADD_NEW_ANCHOR_RESERVED_PRODUCT,
  UPDATE_ANCHOR_RESERVED_PRODUCT,
  GET_DELETE_PRODUCT_FROM_ANCHOR_RESERVED_LIST,
  GET_LIST_OF_TOOL_RESERVED_PRODUCTS,
  ADD_NEW_TOOL_RESERVED_PRODUCT,
  UPDATE_TOOL_RESERVED_PRODUCT,
  GET_DELETE_PRODUCT_FROM_TOOL_RESERVED_LIST,
  GET_LIST_OF_REL_MAT_PRODUCTS,
  ADD_NEW_REL_MAT_RESERVED_PRODUCT,
  UPDATE_REL_MAT_PRODUCT,
  GET_DELETE_PRODUCT_FROM_REL_MAT_LIST,
  UPDATE_DRY_MIXED_WAREHOSE_QUANTITYS,
  UPDATE_ANCHOR_WAREHOSE_QUANTITYS,
  UPDATE_TOOL_WAREHOSE_QUANTITYS,
  UPDATE_REL_MAT_WAREHOSE_QUANTITYS,
  GET_AUTOCLAVE_CALENDAR,
  ADD_NEW_AUTOCLAVE_CALENDAR,
  AUTOCLAVE_CALENDAR,
  NEW_AUTOCLAVE_CALENDAR,
  RAW_MATERIALS_WAREHOUSE,
  UPDATE_RAW_MATERIALS_WAREHOUSE,
  GET_RAW_MATERIALS_WAREHOUSE,
  UPDATE_NEW_RAW_MATERIALS_WAREHOUSE,
} from '../types/warehouseTypes';
import {
  ANCHOR_QUANTITYS_SOCKET,
  DELETE_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  DELETE_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  DELETE_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  DELETE_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  DELETE_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  DRY_MIXES_QUANTITYS_SOCKET,
  NEW_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  NEW_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  NEW_LIST_OF_ORDERED_PRODUCTION_OEM_SOCKET,
  NEW_LIST_OF_ORDERED_PRODUCTION_SOCKET,
  NEW_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  NEW_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  NEW_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  REL_MAT_QUANTITYS_SOCKET,
  TOOL_QUANTITYS_SOCKET,
  UPDATE_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  UPDATE_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  UPDATE_LIST_OF_ORDERED_PRODUCTION_OEM_SOCKET,
  UPDATE_LIST_OF_ORDERED_PRODUCTION_SOCKET,
  UPDATE_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  UPDATE_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET,
} from '../types/socketTypes/socket';

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

const updateDryMixedWhQuantitys = (upd_rem_srock) => {
  return url
    .post('/warehouse/upd/quantitys/drymix', upd_rem_srock)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const updateAnchorWhQuantitys = (upd_rem_srock) => {
  return url
    .post('/warehouse/upd/quantitys/anchor', upd_rem_srock)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const updateToolWhQuantitys = (upd_rem_srock) => {
  return url
    .post('/warehouse/upd/quantitys/tool', upd_rem_srock)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const updateRelMatWhQuantitys = (upd_rem_srock) => {
  return url
    .post('/warehouse/upd/quantitys/relmat', upd_rem_srock)
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

const getListOfDryMixedReservedProducts = () => {
  return url
    .get('/warehouse/reserved/drymix')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewDryMixedReservedProduct = (reserved_product) => {
  return url
    .post('/warehouse/reserved/drymix/add', reserved_product)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const updDryMixedReservedProduct = (reserved_product) => {
  return url
    .post('/warehouse/reserved/drymix/upd', reserved_product)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const deleteDryMixedReservedProduct = (id) => {
  return url
    .post('/warehouse/reserved/drymix/delete', { id })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const getListOfAnchorReservedProducts = () => {
  return url
    .get('/warehouse/reserved/anchor')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewAnchorReservedProduct = (reserved_product) => {
  return url
    .post('/warehouse/reserved/anchor/add', reserved_product)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const updAnchorReservedProduct = (reserved_product) => {
  return url
    .post('/warehouse/reserved/anchor/upd', reserved_product)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const deleteAnchorReservedProduct = (id) => {
  return url
    .post('/warehouse/reserved/anchor/delete', { id })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const getListOfToolReservedProducts = () => {
  return url
    .get('/warehouse/reserved/tool')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewToolReservedProduct = (reserved_product) => {
  return url
    .post('/warehouse/reserved/tool/add', reserved_product)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const updToolReservedProduct = (reserved_product) => {
  return url
    .post('/warehouse/reserved/tool/upd', reserved_product)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const deleteToolReservedProduct = (id) => {
  return url
    .post('/warehouse/reserved/tool/delete', { id })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const getListOfRelMatReservedProducts = () => {
  return url
    .get('/warehouse/reserved/relmat')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewRelMatReservedProduct = (reserved_product) => {
  return url
    .post('/warehouse/reserved/relmat/add', reserved_product)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const updRelMatReservedProduct = (reserved_product) => {
  return url
    .post('/warehouse/reserved/relmat/upd', reserved_product)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const deleteRelMatReservedProduct = (id) => {
  return url
    .post('/warehouse/reserved/relmat/delete', { id })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const getAutoclaveCalendar = () => {
  return url
    .get('/warehouse/autoclave_calendares')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewAutoclaveCalendar = (autoclave_calendar_data) => {
  return url
    .post('/warehouse/autoclave_calendares/add', autoclave_calendar_data)
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

const getRawMaterialsWarehouse = () => {
  return url
    .get('/rawMaterialsWarehouse')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const updateRawMaterialsWarehouse = (rawMaterialsWarehouse) => {
  return url
    .post('/rawMaterialsWarehouse/update', rawMaterialsWarehouse)
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

function* updateDryMixedWhQuantitysWatcher(action) {
  try {
    const { payload } = action;
    yield call(updateDryMixedWhQuantitys, payload);
  } catch (err) {
    yield put({ type: DRY_MIXES_QUANTITYS_SOCKET, payload: [] });
  }
}

function* updateAnchorWhQuantitysWatcher(action) {
  try {
    const { payload } = action;
    yield call(updateAnchorWhQuantitys, payload);
  } catch (err) {
    yield put({ type: ANCHOR_QUANTITYS_SOCKET, payload: [] });
  }
}

function* updateToolWhQuantitysWatcher(action) {
  try {
    const { payload } = action;
    yield call(updateToolWhQuantitys, payload);
  } catch (err) {
    yield put({ type: TOOL_QUANTITYS_SOCKET, payload: [] });
  }
}

function* updateRelMatWhQuantitysWatcher(action) {
  try {
    const { payload } = action;
    yield call(updateRelMatWhQuantitys, payload);
  } catch (err) {
    yield put({ type: REL_MAT_QUANTITYS_SOCKET, payload: [] });
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

function* addNewReservedProductWatcher(action) {
  try {
    yield call(addNewReservedProduct, action.payload);
  } catch (err) {
    yield put({ type: NEW_PRODUCT_FROM_RESERVED_LIST_SOCKET, payload: [] });
  }
}

function* updReservedProductWatcher(action) {
  try {
    yield call(updReservedProduct, action.payload);
  } catch (err) {
    yield put({ type: UPD_RESERVED_PRODUCT, payload: [] });
  }
}

function* deleteReservedProductWatcher(action) {
  try {
    const { payload } = action;
    yield call(deleteReservedProduct, payload);
  } catch (err) {
    yield put({ type: DELETE_PRODUCT_FROM_RESERVED_LIST_SOCKET, payload: [] });
  }
}

function* getListOfDryMixedReservedProductsWatcher() {
  try {
    const listOfReservedDryMixedProducts = yield call(
      getListOfDryMixedReservedProducts
    );

    yield put({
      type: LIST_OF_DRY_MIXED_RESERVED_PRODUCTS,
      payload: listOfReservedDryMixedProducts,
    });
  } catch (err) {
    yield put({ type: LIST_OF_DRY_MIXED_RESERVED_PRODUCTS, payload: [] });
  }
}

function* addNewDryMixedReservedProductWatcher(action) {
  try {
    yield call(addNewDryMixedReservedProduct, action.payload);
  } catch (err) {
    yield put({
      type: NEW_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET,
      payload: [],
    });
  }
}

function* updDryMixedReservedProductWatcher(action) {
  try {
    yield call(updDryMixedReservedProduct, action.payload);
  } catch (err) {
    yield put({
      type: UPDATE_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET,
      payload: [],
    });
  }
}

function* deleteDryMixedReservedProductWatcher(action) {
  try {
    const { payload } = action;
    yield call(deleteDryMixedReservedProduct, payload);
  } catch (err) {
    yield put({
      type: DELETE_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET,
      payload: [],
    });
  }
}

function* getListOfAnchorReservedProductsWatcher() {
  try {
    const listOfReservedProducts = yield call(getListOfAnchorReservedProducts);

    yield put({
      type: LIST_OF_ANCHOR_RESERVED_PRODUCTS,
      payload: listOfReservedProducts,
    });
  } catch (err) {
    yield put({ type: LIST_OF_ANCHOR_RESERVED_PRODUCTS, payload: [] });
  }
}

function* addNewAnchorReservedProductWatcher(action) {
  try {
    yield call(addNewAnchorReservedProduct, action.payload);
  } catch (err) {
    yield put({ type: NEW_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET, payload: [] });
  }
}

function* updAnchorReservedProductWatcher(action) {
  try {
    yield call(updAnchorReservedProduct, action.payload);
  } catch (err) {
    yield put({
      type: UPDATE_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET,
      payload: [],
    });
  }
}

function* deleteAnchorReservedProductWatcher(action) {
  try {
    const { payload } = action;
    yield call(deleteAnchorReservedProduct, payload);
  } catch (err) {
    yield put({
      type: DELETE_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET,
      payload: [],
    });
  }
}

function* getListOfToolReservedProductsWatcher() {
  try {
    const listOfReservedProducts = yield call(getListOfToolReservedProducts);

    yield put({
      type: LIST_OF_TOOL_RESERVED_PRODUCTS,
      payload: listOfReservedProducts,
    });
  } catch (err) {
    yield put({ type: LIST_OF_TOOL_RESERVED_PRODUCTS, payload: [] });
  }
}

function* addNewToolReservedProductWatcher(action) {
  try {
    yield call(addNewToolReservedProduct, action.payload);
  } catch (err) {
    yield put({ type: NEW_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET, payload: [] });
  }
}

function* updToolReservedProductWatcher(action) {
  try {
    yield call(updToolReservedProduct, action.payload);
  } catch (err) {
    yield put({ type: UPDATE_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET, payload: [] });
  }
}

function* deleteToolReservedProductWatcher(action) {
  try {
    const { payload } = action;
    yield call(deleteToolReservedProduct, payload);
  } catch (err) {
    yield put({ type: DELETE_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET, payload: [] });
  }
}

function* getListOfRelMatReservedProductsWatcher() {
  try {
    const listOfReservedProducts = yield call(getListOfRelMatReservedProducts);

    yield put({ type: LIST_OF_REL_MAT_PRODUCTS, payload: listOfReservedProducts });
  } catch (err) {
    yield put({ type: LIST_OF_REL_MAT_PRODUCTS, payload: [] });
  }
}

function* addNewRelMatReservedProductWatcher(action) {
  try {
    yield call(addNewRelMatReservedProduct, action.payload);
  } catch (err) {
    yield put({ type: NEW_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET, payload: [] });
  }
}

function* updRelMatReservedProductWatcher(action) {
  try {
    yield call(updRelMatReservedProduct, action.payload);
  } catch (err) {
    yield put({
      type: UPDATE_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET,
      payload: [],
    });
  }
}

function* deleteRelMatReservedProductWatcher(action) {
  try {
    const { payload } = action;
    yield call(deleteRelMatReservedProduct, payload);
  } catch (err) {
    yield put({
      type: DELETE_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET,
      payload: [],
    });
  }
}

function* getAutoclaveCalendarWatcher() {
  try {
    const autoclave_calendar = yield call(getAutoclaveCalendar);

    yield put({ type: AUTOCLAVE_CALENDAR, payload: autoclave_calendar });
  } catch (err) {
    yield put({ type: AUTOCLAVE_CALENDAR, payload: [] });
  }
}

function* addNewAutoclaveCalendarWatcher(action) {
  try {
    const rows = Array.isArray(action.payload) ? action.payload : [];
    if (rows.length === 0) throw new Error('No data to save');

    const new_autoclave_calendar = yield call(
      addNewAutoclaveCalendar,
      action.payload
    );

    yield put({ type: NEW_AUTOCLAVE_CALENDAR, payload: new_autoclave_calendar });
  } catch (err) {
    yield put({ type: NEW_AUTOCLAVE_CALENDAR, payload: [] });
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
    yield call(addNewListOfOrderedProduction, action.payload);
  } catch (err) {
    yield put({ type: NEW_LIST_OF_ORDERED_PRODUCTION_SOCKET, payload: [] });
  }
}

function* updListOfOrderedProductionWorker(action) {
  try {
    yield call(updListOfOrderedProduction, action.payload);
  } catch (err) {
    yield put({ type: UPDATE_LIST_OF_ORDERED_PRODUCTION_SOCKET, payload: [] });
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
    yield call(addNewListOfOrderedProductionOEM, action.payload);
  } catch (err) {
    yield put({ type: NEW_LIST_OF_ORDERED_PRODUCTION_OEM_SOCKET, payload: [] });
  }
}

function* updListOfOrderedProductionOEMWorker(action) {
  try {
    yield call(updListOfOrderedProductionOEM, action.payload);
  } catch (err) {
    yield put({ type: UPDATE_LIST_OF_ORDERED_PRODUCTION_OEM_SOCKET, payload: [] });
  }
}

function* getRawMaterialsWarehouseWorker() {
  try {
    const { rawMaterialsWarehouse } = yield call(getRawMaterialsWarehouse);

    yield put({
      type: RAW_MATERIALS_WAREHOUSE,
      payload: rawMaterialsWarehouse,
    });
  } catch (err) {
    yield put({ type: RAW_MATERIALS_WAREHOUSE, payload: [] });
  }
}

function* updateNewRawMaterialsWarehouseWorker(action) {
  try {
    const { rawMaterialsWarehouse } = yield call(
      updateRawMaterialsWarehouse,
      action.payload
    );

    yield put({
      type: UPDATE_RAW_MATERIALS_WAREHOUSE,
      payload: rawMaterialsWarehouse,
    });
  } catch (err) {
    yield put({ type: UPDATE_RAW_MATERIALS_WAREHOUSE, payload: [] });
  }
}

function* warehouseWatcher() {
  yield takeLatest(GET_ALL_WAREHOUSE, getAllWarehouseWatcher);
  yield takeLatest(ADD_NEW_WAREHOUSE, addNewWarehouseWatcher);

  yield takeLatest(UPDATE_REMAINING_STOCK, updRemainingStockWatcher);
  yield takeLatest(UPDATE_WAREHOSE_QUANTITYS, updateWhQuantitysWatcher);
  yield takeLatest(
    UPDATE_DRY_MIXED_WAREHOSE_QUANTITYS,
    updateDryMixedWhQuantitysWatcher
  );
  yield takeLatest(UPDATE_ANCHOR_WAREHOSE_QUANTITYS, updateAnchorWhQuantitysWatcher);
  yield takeLatest(UPDATE_TOOL_WAREHOSE_QUANTITYS, updateToolWhQuantitysWatcher);
  yield takeLatest(
    UPDATE_REL_MAT_WAREHOSE_QUANTITYS,
    updateRelMatWhQuantitysWatcher
  );

  yield takeLatest(GET_LIST_OF_RESERVED_PRODUCTS, getListOfReservedProductsWatcher);
  yield takeLatest(ADD_NEW_RESERVED_PRODUCT, addNewReservedProductWatcher);
  yield takeLatest(UPDATE_RESERVED_PRODUCT, updReservedProductWatcher);
  yield takeLatest(
    GET_DELETE_PRODUCT_FROM_RESERVED_LIST,
    deleteReservedProductWatcher
  );

  yield takeLatest(
    GET_LIST_OF_DRY_MIXED_RESERVED_PRODUCTS,
    getListOfDryMixedReservedProductsWatcher
  );
  yield takeLatest(
    ADD_NEW_DRY_MIXED_RESERVED_PRODUCT,
    addNewDryMixedReservedProductWatcher
  );
  yield takeLatest(
    UPDATE_DRY_MIXED_RESERVED_PRODUCT,
    updDryMixedReservedProductWatcher
  );
  yield takeLatest(
    GET_DELETE_PRODUCT_FROM_DRY_MIXED_RESERVED_LIST,
    deleteDryMixedReservedProductWatcher
  );

  yield takeLatest(
    GET_LIST_OF_ANCHOR_RESERVED_PRODUCTS,
    getListOfAnchorReservedProductsWatcher
  );
  yield takeLatest(
    ADD_NEW_ANCHOR_RESERVED_PRODUCT,
    addNewAnchorReservedProductWatcher
  );
  yield takeLatest(UPDATE_ANCHOR_RESERVED_PRODUCT, updAnchorReservedProductWatcher);
  yield takeLatest(
    GET_DELETE_PRODUCT_FROM_ANCHOR_RESERVED_LIST,
    deleteAnchorReservedProductWatcher
  );

  yield takeLatest(
    GET_LIST_OF_TOOL_RESERVED_PRODUCTS,
    getListOfToolReservedProductsWatcher
  );
  yield takeLatest(ADD_NEW_TOOL_RESERVED_PRODUCT, addNewToolReservedProductWatcher);
  yield takeLatest(UPDATE_TOOL_RESERVED_PRODUCT, updToolReservedProductWatcher);
  yield takeLatest(
    GET_DELETE_PRODUCT_FROM_TOOL_RESERVED_LIST,
    deleteToolReservedProductWatcher
  );

  yield takeLatest(
    GET_LIST_OF_REL_MAT_PRODUCTS,
    getListOfRelMatReservedProductsWatcher
  );
  yield takeLatest(
    ADD_NEW_REL_MAT_RESERVED_PRODUCT,
    addNewRelMatReservedProductWatcher
  );
  yield takeLatest(UPDATE_REL_MAT_PRODUCT, updRelMatReservedProductWatcher);
  yield takeLatest(
    GET_DELETE_PRODUCT_FROM_REL_MAT_LIST,
    deleteRelMatReservedProductWatcher
  );

  yield takeLatest(GET_AUTOCLAVE_CALENDAR, getAutoclaveCalendarWatcher);
  yield takeLatest(ADD_NEW_AUTOCLAVE_CALENDAR, addNewAutoclaveCalendarWatcher);

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
  yield takeLatest(GET_RAW_MATERIALS_WAREHOUSE, getRawMaterialsWarehouseWorker);
  yield takeLatest(
    UPDATE_NEW_RAW_MATERIALS_WAREHOUSE,
    updateNewRawMaterialsWarehouseWorker
  );
}

export default warehouseWatcher;
