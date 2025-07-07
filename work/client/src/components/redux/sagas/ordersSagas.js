import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import showErrorMessage from '../../Utils/showErrorMessage';

import {
  ADD_NEW_ORDER,
  DELETE_ORDER,
  DELETE_PRODUCT_OF_ORDER,
  GET_DELETE_ORDER,
  GET_DELETE_PRODUCT_OF_ORDER,
  GET_ORDERS_LIST,
  GET_CURRENT_PRODUCTS_OF_ORDER,
  GET_UPDATE_PRODUCTS_OF_ORDER,
  NEW_ORDER,
  ORDERS_LIST,
  CURRENT_PRODUCTS_OF_ORDER,
  UPDATE_PRODUCTS_OF_ORDER,
  UPDATE_CONTACT_OF_ORDER,
  NEW_CONTACT_OF_ORDER,
  UPDATE_DELIVERY_OF_ORDER,
  NEW_DELIVERY_OF_ORDER,
  UPDATE_STATUS_OF_ORDER,
  STATUS_OF_ORDER,
  GET_UPDATE_PRODUCT_INFO_OF_ORDER,
  UPDATE_PRODUCT_INFO_OF_ORDER,
  DATA_SHIP_ORDER,
  ADD_DATA_SHIP_ORDER,
  PRODUCTS_OF_ORDER,
  GET_PRODUCTS_OF_ORDER,
  UPDATE_PERSON_IN_CHARGE_OF_ORDER,
  PERSON_IN_CHARGE_OF_ORDER,
  GET_DRY_MIXED_PRODUCTS_OF_ORDER,
  DRY_MIXED_PRODUCTS_OF_ORDER,
  ANCHOR_PRODUCTS_OF_ORDER,
  TOOL_PRODUCTS_OF_ORDER,
  GET_ANCHOR_PRODUCTS_OF_ORDER,
  GET_TOOL_PRODUCTS_OF_ORDER,
  UPDATE_DRY_MIXED_PRODUCTS_OF_ORDER,
  GET_UPDATE_DRY_MIXED_PRODUCTS_OF_ORDER,
  UPDATE_ANCHOR_PRODUCTS_OF_ORDER,
  UPDATE_TOOL_PRODUCTS_OF_ORDER,
  GET_UPDATE_ANCHOR_PRODUCTS_OF_ORDER,
  GET_UPDATE_TOOL_PRODUCTS_OF_ORDER,
  DELETE_TOOL_OF_ORDER,
  DELETE_ANCHOR_OF_ORDER,
  DELETE_DRY_MIXED_OF_ORDER,
  GET_DELETE_ANCHOR_OF_ORDER,
  GET_DELETE_DRY_MIXED_OF_ORDER,
  GET_DELETE_TOOL_OF_ORDER,
  ORDER_DESCRIPTION,
  ADD_ORDER_DESCRIPTION,
  ADD_SECONDARY_CONTACT,
  SECONDARY_CONTACT,
  REL_MAT_PRODUCTS_OF_ORDER,
  UPDATE_REL_MAT_PRODUCTS_OF_ORDER,
  DELETE_REL_MAT_OF_ORDER,
  GET_REL_MAT_PRODUCTS_OF_ORDER,
  GET_UPDATE_REL_MAT_PRODUCTS_OF_ORDER,
  GET_DELETE_REL_MAT_OF_ORDER,
  REMOVE_SECONDARY_CONTACT,
  DELETE_SECONDARY_CONTACT,
  NEW_DELIVERY_PRICE,
  ADD_NEW_DELIVERY_PRICE,
  GET_UPDATE_DRY_MIXED_PRODUCT_INFO_OF_ORDER,
  GET_UPDATE_ANCHOR_PRODUCT_INFO_OF_ORDER,
  GET_UPDATE_TOOL_PRODUCT_INFO_OF_ORDER,
  GET_UPDATE_REL_MAT_PRODUCT_INFO_OF_ORDER,
  UPDATE_DRY_MIXED_PRODUCT_INFO_OF_ORDER,
  UPDATE_ANCHOR_PRODUCT_INFO_OF_ORDER,
  UPDATE_TOOL_PRODUCT_INFO_OF_ORDER,
  UPDATE_REL_MAT_PRODUCT_INFO_OF_ORDER,
} from '../types/ordersTypes';

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

const getAllOrders = () => {
  return url
    .get('/orders')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewOrder = (order) => {
  return url
    .post('/orders/add', { order })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewDeliveryPrice = (order) => {
  return url
    .post('/orders/delivery', order)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addDataShipOrder = (date) => {
  return url
    .post('/orders/date', date)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addDescriptionOrder = (desc) => {
  return url
    .post('/orders/desc', desc)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addSecondaryContact = (sec_cnt) => {
  return url
    .post('/orders/sec_cnt', sec_cnt)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const deleteSecondaryContact = (sec_cnt) => {
  return url
    .post('/orders/delete/sec_cnt', { order_id: sec_cnt })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const getProductsOfOrder = () => {
  return url
    .get('/orders/products')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const getDryMixedProductsOfOrder = () => {
  return url
    .get('/orders/dry_mixed_products', {})
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const getAnchorProductsOfOrder = () => {
  return url
    .get('/orders/anchor_products', {})
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const getToolProductsOfOrder = () => {
  return url
    .get('/orders/tool_products', {})
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const getRelMatProductsOfOrder = () => {
  return url
    .get('/orders/rel_mat_products', {})
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const getCurrentProductsOfOrder = (order_id) => {
  return url
    .post('/orders/current/products', { order_id })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const getUpdateProductsOfOrder = (newProductsOfOrder) => {
  return url
    .post('/orders/products/add', newProductsOfOrder)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const getUpdateDryMixedProductsOfOrder = (newDryMixedProductsOfOrder) => {
  return url
    .post('/orders/dry_mixed_products/add', newDryMixedProductsOfOrder)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const getUpdateAnchorProductsOfOrder = (newAnchorProductsOfOrder) => {
  return url
    .post('/orders/anchor_products/add', newAnchorProductsOfOrder)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const getUpdateToolProductsOfOrder = (newToolProductsOfOrder) => {
  return url
    .post('/orders/tool_products/add', newToolProductsOfOrder)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const getUpdateRelMatProductsOfOrder = (newRelMatProductsOfOrder) => {
  return url
    .post('/orders/rel_mat_products/add', newRelMatProductsOfOrder)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const getUpdateProductInfoOfOrder = (productOfOrder) => {
  return url
    .post('/orders/product/update/info', productOfOrder)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const getUpdateDryMixedProductsInfoOfOrder = (productOfOrder) => {
  return url
    .post('/orders/dry_mixed_products/update/info', productOfOrder)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const getUpdateAnchorProductsInfoOfOrder = (productOfOrder) => {
  return url
    .post('/orders/anchor_products/update/info', productOfOrder)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const getUpdateToolProductsInfoOfOrder = (productOfOrder) => {
  return url
    .post('/orders/tool_products/update/info', productOfOrder)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const getUpdateRelMatProductsInfoOfOrder = (productOfOrder) => {
  return url
    .post('/orders/rel_mat_products/update/info', productOfOrder)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const getDeleteProductOfOrder = (product_id) => {
  return url
    .post('/orders/delete/product', { product_id })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const getDeleteDryMixedProductOfOrder = (dry_mixed_id) => {
  return url
    .post('/orders/delete/dry_mixed_products', { dry_mixed_id })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const getDeleteAnchorProductOfOrder = (anchor_id) => {
  return url
    .post('/orders/delete/anchor_product', { anchor_id })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const getDeleteToolProductOfOrder = (tool_id) => {
  return url
    .post('/orders/delete/tool_product', { tool_id })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const getDeleteRelMatProductOfOrder = (rel_mat_id) => {
  return url
    .post('/orders/delete/rel_mat_product', { rel_mat_id })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const getDeleteOrder = (order_id) => {
  return url
    .post('/orders/delete', { order_id })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const updateContactOfOrder = (newContactOfOrder) => {
  return url
    .post('/orders/update/contact', newContactOfOrder)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const updateDeliveryOfOrder = (newDeliveryOfOrder) => {
  return url
    .post('/orders/update/delivery_address', newDeliveryOfOrder)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const updateStatusOfOrder = (orderStatus) => {
  return url
    .post('/orders/update/status', orderStatus)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const updateInChargeOfOrder = (orderInCharge) => {
  return url
    .post('/orders/update/in_charge', orderInCharge)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

function* getOrdersListWatcher() {
  try {
    const { orders } = yield call(getAllOrders);
    yield put({ type: ORDERS_LIST, payload: orders });
  } catch (err) {
    console.error('Error:', err);
    yield put({ type: ORDERS_LIST, payload: [] });
  }
}

function* addNewOrderWatcher(action) {
  try {
    const newOrder = yield call(addNewOrder, action.payload);

    yield put({ type: NEW_ORDER, payload: newOrder });
  } catch (err) {
    console.error(err);
    yield put({ type: NEW_ORDER, payload: [] });
  }
}

function* addNewDeliveryPriceWatcher(action) {
  try {
    const newOrder = yield call(addNewDeliveryPrice, action.payload);

    yield put({ type: NEW_DELIVERY_PRICE, payload: newOrder });
  } catch (err) {
    console.error(err);
    yield put({ type: NEW_DELIVERY_PRICE, payload: [] });
  }
}

function* addDataShipOrderWatcher(action) {
  try {
    const { payload } = action;
    yield call(addDataShipOrder, payload);
  } catch (err) {
    console.error(err);
    yield put({ type: DATA_SHIP_ORDER, payload: [] });
  }
}

function* addDescriptionOrderWatcher(action) {
  try {
    const { payload } = action;
    yield call(addDescriptionOrder, payload);
  } catch (err) {
    console.error(err);
    yield put({ type: ORDER_DESCRIPTION, payload: [] });
  }
}

function* addSecondaryContactWatcher(action) {
  try {
    const { payload } = action;
    yield call(addSecondaryContact, payload);
  } catch (err) {
    console.error(err);
    yield put({ type: SECONDARY_CONTACT, payload: [] });
  }
}

function* deleteSecondaryContactWatcher(action) {
  try {
    const { payload } = action;

    yield call(deleteSecondaryContact, payload);
  } catch (err) {
    console.error(err);
    yield put({ type: REMOVE_SECONDARY_CONTACT, payload: [] });
  }
}

function* getProductsOfOrderWatcher(action) {
  try {
    const { product_list } = yield call(getProductsOfOrder);

    yield put({ type: PRODUCTS_OF_ORDER, payload: product_list });
  } catch (err) {
    console.error(err);
    yield put({ type: PRODUCTS_OF_ORDER, payload: [] });
  }
}

function* getDryMixedProductsOfOrderWatcher(action) {
  try {
    const dry_mixed_product_list = yield call(getDryMixedProductsOfOrder);

    yield put({
      type: DRY_MIXED_PRODUCTS_OF_ORDER,
      payload: dry_mixed_product_list,
    });
  } catch (err) {
    console.error(err);
    yield put({ type: DRY_MIXED_PRODUCTS_OF_ORDER, payload: [] });
  }
}

function* getAnchorProductsOfOrderWatcher(action) {
  try {
    const anchor_product_list = yield call(getAnchorProductsOfOrder);

    yield put({ type: ANCHOR_PRODUCTS_OF_ORDER, payload: anchor_product_list });
  } catch (err) {
    console.error(err);
    yield put({ type: ANCHOR_PRODUCTS_OF_ORDER, payload: [] });
  }
}

function* getToolProductsOfOrderWatcher(action) {
  try {
    const tool_product_list = yield call(getToolProductsOfOrder);

    yield put({ type: TOOL_PRODUCTS_OF_ORDER, payload: tool_product_list });
  } catch (err) {
    console.error(err);
    yield put({ type: TOOL_PRODUCTS_OF_ORDER, payload: [] });
  }
}

function* getRelMatProductsOfOrderWatcher(action) {
  try {
    const rel_mat_product_list = yield call(getRelMatProductsOfOrder);

    yield put({ type: REL_MAT_PRODUCTS_OF_ORDER, payload: rel_mat_product_list });
  } catch (err) {
    console.error(err);
    yield put({ type: REL_MAT_PRODUCTS_OF_ORDER, payload: [] });
  }
}

function* getCurrentProductsOfOrderWatcher(action) {
  try {
    const { product_list } = yield call(getCurrentProductsOfOrder, action.payload);

    yield put({ type: CURRENT_PRODUCTS_OF_ORDER, payload: product_list });
  } catch (err) {
    console.error(err);
    yield put({ type: CURRENT_PRODUCTS_OF_ORDER, payload: [] });
  }
}

function* getUpdateProductInfoOfOrderWatcher(action) {
  try {
    const { payload } = action;

    const upd_prod_info = yield call(getUpdateProductInfoOfOrder, payload);

    yield put({
      type: UPDATE_PRODUCT_INFO_OF_ORDER,
      payload: upd_prod_info,
    });
  } catch (err) {
    console.error(err);
    yield put({ type: UPDATE_PRODUCT_INFO_OF_ORDER, payload: [] });
  }
}

function* getUpdateDryMixedProductsInfoOfOrderWatcher(action) {
  try {
    const { payload } = action;

    const upd_prod_info = yield call(getUpdateDryMixedProductsInfoOfOrder, payload);

    yield put({
      type: UPDATE_DRY_MIXED_PRODUCT_INFO_OF_ORDER,
      payload: upd_prod_info,
    });
  } catch (err) {
    console.error(err);
    yield put({ type: UPDATE_DRY_MIXED_PRODUCT_INFO_OF_ORDER, payload: [] });
  }
}

function* getUpdateAnchorProductsInfoOfOrderWatcher(action) {
  try {
    const { payload } = action;

    const upd_prod_info = yield call(getUpdateAnchorProductsInfoOfOrder, payload);

    yield put({
      type: UPDATE_ANCHOR_PRODUCT_INFO_OF_ORDER,
      payload: upd_prod_info,
    });
  } catch (err) {
    console.error(err);
    yield put({ type: UPDATE_ANCHOR_PRODUCT_INFO_OF_ORDER, payload: [] });
  }
}

function* getUpdateToolProductsInfoOfOrderWatcher(action) {
  try {
    const { payload } = action;

    const upd_prod_info = yield call(getUpdateToolProductsInfoOfOrder, payload);

    yield put({
      type: UPDATE_TOOL_PRODUCT_INFO_OF_ORDER,
      payload: upd_prod_info,
    });
  } catch (err) {
    console.error(err);
    yield put({ type: UPDATE_TOOL_PRODUCT_INFO_OF_ORDER, payload: [] });
  }
}

function* getUpdateRelMatProductsInfoOfOrderWatcher(action) {
  try {
    const { payload } = action;

    const upd_prod_info = yield call(getUpdateRelMatProductsInfoOfOrder, payload);

    yield put({
      type: UPDATE_REL_MAT_PRODUCT_INFO_OF_ORDER,
      payload: upd_prod_info,
    });
  } catch (err) {
    console.error(err);
    yield put({ type: UPDATE_REL_MAT_PRODUCT_INFO_OF_ORDER, payload: [] });
  }
}

function* getUpdateProductsOfOrderWatcher(action) {
  try {
    const { payload } = action;

    yield call(getUpdateProductsOfOrder, payload);
  } catch (err) {
    console.error(err);
    yield put({ type: UPDATE_PRODUCTS_OF_ORDER, payload: [] });
  }
}

function* getUpdateDryMixedProductsOfOrderWatcher(action) {
  try {
    const { payload } = action;

    yield call(getUpdateDryMixedProductsOfOrder, payload);
  } catch (err) {
    console.error(err);
    yield put({ type: UPDATE_DRY_MIXED_PRODUCTS_OF_ORDER, payload: [] });
  }
}

function* getUpdateAnchorProductsOfOrderWatcher(action) {
  try {
    const { payload } = action;

    yield call(getUpdateAnchorProductsOfOrder, payload);
  } catch (err) {
    console.error(err);
    yield put({ type: UPDATE_ANCHOR_PRODUCTS_OF_ORDER, payload: [] });
  }
}

function* getUpdateToolProductsOfOrderWatcher(action) {
  try {
    const { payload } = action;

    yield call(getUpdateToolProductsOfOrder, payload);
  } catch (err) {
    console.error(err);
    yield put({ type: UPDATE_TOOL_PRODUCTS_OF_ORDER, payload: [] });
  }
}

function* getUpdateRelMatProductsOfOrderWatcher(action) {
  try {
    const { payload } = action;

    yield call(getUpdateRelMatProductsOfOrder, payload);
  } catch (err) {
    console.error(err);
    yield put({ type: UPDATE_REL_MAT_PRODUCTS_OF_ORDER, payload: [] });
  }
}

function* getDeleteProductOfOrderWatcher(action) {
  try {
    const { payload } = action;

    yield call(getDeleteProductOfOrder, payload);

    yield put({ type: DELETE_PRODUCT_OF_ORDER, payload });
  } catch (err) {
    console.error(err);
    yield put({ type: DELETE_PRODUCT_OF_ORDER, payload: [] });
  }
}

function* getDeleteDryMixedProductOfOrderWatcher(action) {
  try {
    const { payload } = action;

    yield call(getDeleteDryMixedProductOfOrder, payload);

    yield put({ type: DELETE_DRY_MIXED_OF_ORDER, payload });
  } catch (err) {
    console.error(err);
    yield put({ type: DELETE_DRY_MIXED_OF_ORDER, payload: [] });
  }
}

function* getDeleteAnchorProductOfOrderWatcher(action) {
  try {
    const { payload } = action;

    yield call(getDeleteAnchorProductOfOrder, payload);

    yield put({ type: DELETE_ANCHOR_OF_ORDER, payload });
  } catch (err) {
    console.error(err);
    yield put({ type: DELETE_ANCHOR_OF_ORDER, payload: [] });
  }
}

function* getDeleteToolProductOfOrderWatcher(action) {
  try {
    const { payload } = action;

    yield call(getDeleteToolProductOfOrder, payload);

    yield put({ type: DELETE_TOOL_OF_ORDER, payload });
  } catch (err) {
    console.error(err);
    yield put({ type: DELETE_TOOL_OF_ORDER, payload: [] });
  }
}

function* getDeleteRelMatProductOfOrderWatcher(action) {
  try {
    const { payload } = action;

    yield call(getDeleteRelMatProductOfOrder, payload);

    yield put({ type: DELETE_REL_MAT_OF_ORDER, payload });
  } catch (err) {
    console.error(err);
    yield put({ type: DELETE_REL_MAT_OF_ORDER, payload: [] });
  }
}

function* getDeleteOrderWatcher(action) {
  try {
    const { payload } = action;

    yield call(getDeleteOrder, payload);

    yield put({ type: DELETE_ORDER, payload });
  } catch (err) {
    console.error(err);
    yield put({ type: DELETE_ORDER, payload: [] });
  }
}

function* updateContactOfOrderWorker(action) {
  try {
    const { payload } = action;

    yield call(updateContactOfOrder, payload);

    yield put({ type: NEW_CONTACT_OF_ORDER, payload });
  } catch (err) {
    yield put({ type: NEW_CONTACT_OF_ORDER, payload: [] });
  }
}

function* updateDeliveryOfOrderWorker(action) {
  try {
    const { payload } = action;

    yield call(updateDeliveryOfOrder, payload);

    yield put({ type: NEW_DELIVERY_OF_ORDER, payload });
  } catch (err) {
    yield put({ type: NEW_DELIVERY_OF_ORDER, payload: [] });
  }
}

function* updateStatusOfOrderWorker(action) {
  try {
    const { payload } = action;
    const status = yield call(updateStatusOfOrder, payload);
    yield put({ type: STATUS_OF_ORDER, payload: status });
  } catch (err) {
    yield put({ type: STATUS_OF_ORDER, payload: [] });
  }
}

function* updateInChargeOfOrderWorker(action) {
  try {
    const { payload } = action;
    const status = yield call(updateInChargeOfOrder, payload);
    yield put({ type: PERSON_IN_CHARGE_OF_ORDER, payload: status });
  } catch (err) {
    yield put({ type: PERSON_IN_CHARGE_OF_ORDER, payload: [] });
  }
}

function* ordersWatcher() {
  yield takeLatest(GET_ORDERS_LIST, getOrdersListWatcher);
  yield takeLatest(ADD_NEW_ORDER, addNewOrderWatcher);
  yield takeLatest(ADD_NEW_DELIVERY_PRICE, addNewDeliveryPriceWatcher);
  yield takeLatest(ADD_DATA_SHIP_ORDER, addDataShipOrderWatcher);
  yield takeLatest(ADD_ORDER_DESCRIPTION, addDescriptionOrderWatcher);
  yield takeLatest(ADD_SECONDARY_CONTACT, addSecondaryContactWatcher);
  yield takeLatest(DELETE_SECONDARY_CONTACT, deleteSecondaryContactWatcher);
  yield takeLatest(GET_CURRENT_PRODUCTS_OF_ORDER, getCurrentProductsOfOrderWatcher);
  yield takeLatest(GET_PRODUCTS_OF_ORDER, getProductsOfOrderWatcher);
  yield takeLatest(
    GET_DRY_MIXED_PRODUCTS_OF_ORDER,
    getDryMixedProductsOfOrderWatcher
  );
  yield takeLatest(GET_ANCHOR_PRODUCTS_OF_ORDER, getAnchorProductsOfOrderWatcher);
  yield takeLatest(GET_TOOL_PRODUCTS_OF_ORDER, getToolProductsOfOrderWatcher);
  yield takeLatest(GET_REL_MAT_PRODUCTS_OF_ORDER, getRelMatProductsOfOrderWatcher);
  yield takeLatest(GET_UPDATE_PRODUCTS_OF_ORDER, getUpdateProductsOfOrderWatcher);
  yield takeLatest(
    GET_UPDATE_DRY_MIXED_PRODUCTS_OF_ORDER,
    getUpdateDryMixedProductsOfOrderWatcher
  );
  yield takeLatest(
    GET_UPDATE_ANCHOR_PRODUCTS_OF_ORDER,
    getUpdateAnchorProductsOfOrderWatcher
  );
  yield takeLatest(
    GET_UPDATE_TOOL_PRODUCTS_OF_ORDER,
    getUpdateToolProductsOfOrderWatcher
  );
  yield takeLatest(
    GET_UPDATE_REL_MAT_PRODUCTS_OF_ORDER,
    getUpdateRelMatProductsOfOrderWatcher
  );
  yield takeLatest(
    GET_UPDATE_PRODUCT_INFO_OF_ORDER,
    getUpdateProductInfoOfOrderWatcher
  );
  yield takeLatest(
    GET_UPDATE_DRY_MIXED_PRODUCT_INFO_OF_ORDER,
    getUpdateDryMixedProductsInfoOfOrderWatcher
  );
  yield takeLatest(
    GET_UPDATE_ANCHOR_PRODUCT_INFO_OF_ORDER,
    getUpdateAnchorProductsInfoOfOrderWatcher
  );
  yield takeLatest(
    GET_UPDATE_TOOL_PRODUCT_INFO_OF_ORDER,
    getUpdateToolProductsInfoOfOrderWatcher
  );
  yield takeLatest(
    GET_UPDATE_REL_MAT_PRODUCT_INFO_OF_ORDER,
    getUpdateRelMatProductsInfoOfOrderWatcher
  );
  yield takeLatest(GET_DELETE_PRODUCT_OF_ORDER, getDeleteProductOfOrderWatcher);
  yield takeLatest(
    GET_DELETE_DRY_MIXED_OF_ORDER,
    getDeleteDryMixedProductOfOrderWatcher
  );
  yield takeLatest(GET_DELETE_ANCHOR_OF_ORDER, getDeleteAnchorProductOfOrderWatcher);
  yield takeLatest(GET_DELETE_TOOL_OF_ORDER, getDeleteToolProductOfOrderWatcher);
  yield takeLatest(
    GET_DELETE_REL_MAT_OF_ORDER,
    getDeleteRelMatProductOfOrderWatcher
  );
  yield takeLatest(GET_DELETE_ORDER, getDeleteOrderWatcher);
  yield takeLatest(UPDATE_CONTACT_OF_ORDER, updateContactOfOrderWorker);
  yield takeLatest(UPDATE_DELIVERY_OF_ORDER, updateDeliveryOfOrderWorker);
  yield takeLatest(UPDATE_STATUS_OF_ORDER, updateStatusOfOrderWorker);
  yield takeLatest(UPDATE_PERSON_IN_CHARGE_OF_ORDER, updateInChargeOfOrderWorker);
}

export default ordersWatcher;
