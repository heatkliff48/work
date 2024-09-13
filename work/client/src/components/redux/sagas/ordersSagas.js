import { put, call, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import showErrorMessage from '../../Utils/showErrorMessage';
import { setToken } from '../actions/jwtAction';
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
} from '../types/ordersTypes';

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

const addDataShipOrder = (date) => {
  return url
    .post('/orders/date', date)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const getProductsOfOrder = () => {
  return url
    .get('/orders/products', {})
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

const getUpdateProductInfoOfOrder = (productOfOrder) => {
  return url
    .post('/orders/product/update/info', productOfOrder)
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

function* getOrdersListWatcher() {
  try {
    const { orders } = yield call(getAllOrders);
    yield put({ type: ORDERS_LIST, payload: orders });

    // accessTokenFront = yield select((state) => state.jwt);
    // const { orders, accessToken, accessTokenExpiration } = yield call(getAllOrders);
    // window.localStorage.setItem('jwt', accessToken);
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    console.error('Error:', err);
    yield put({ type: ORDERS_LIST, payload: [] });
  }
}

function* addNewOrderWatcher(action) {
  try {
    yield call(addNewOrder, action.payload);

    // accessTokenFront = yield select((state) => state.jwt);
    // const { newOrder, accessToken, accessTokenExpiration } = yield call(addNewOrder, action.payload);
    // window.localStorage.setItem('jwt', accessToken);
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    console.error(err);
    yield put({ type: NEW_ORDER, payload: [] });
  }
}

function* addDataShipOrderWatcher(action) {
  try {
    const { payload } = action;
    yield call(addDataShipOrder, payload);

    // accessTokenFront = yield select((state) => state.jwt);
    // const { accessToken, accessTokenExpiration } = yield call(
    // window.localStorage.setItem('jwt', accessToken);
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    console.error(err);
    yield put({ type: DATA_SHIP_ORDER, payload: [] });
  }
}

function* getProductsOfOrderWatcher(action) {
  try {
    // accessTokenFront = yield select((state) => state.jwt);

    // const { product_list, accessToken, accessTokenExpiration } = yield call(
    const { product_list } = yield call(getProductsOfOrder);

    // window.localStorage.setItem('jwt', accessToken);

    yield put({ type: PRODUCTS_OF_ORDER, payload: product_list });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    console.error(err);
    yield put({ type: PRODUCTS_OF_ORDER, payload: [] });
  }
}

function* getCurrentProductsOfOrderWatcher(action) {
  try {
    // accessTokenFront = yield select((state) => state.jwt);

    // const { product_list, accessToken, accessTokenExpiration } = yield call(
    const { product_list } = yield call(getCurrentProductsOfOrder, action.payload);

    // window.localStorage.setItem('jwt', accessToken);

    yield put({ type: CURRENT_PRODUCTS_OF_ORDER, payload: product_list });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    console.error(err);
    yield put({ type: CURRENT_PRODUCTS_OF_ORDER, payload: [] });
  }
}

function* getUpdateProductInfoOfOrderWatcher(action) {
  try {
    // accessTokenFront = yield select((state) => state.jwt);
    const { payload } = action;

    // const { accessToken, accessTokenExpiration } = yield call(
    yield call(getUpdateProductInfoOfOrder, payload);

    // window.localStorage.setItem('jwt', accessToken);

    yield put({
      type: UPDATE_PRODUCT_INFO_OF_ORDER,
      payload: payload,
    });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    console.error(err);
    yield put({ type: UPDATE_PRODUCT_INFO_OF_ORDER, payload: [] });
  }
}

function* getUpdateProductsOfOrderWatcher(action) {
  try {
    // accessTokenFront = yield select((state) => state.jwt);
    const { payload } = action;

    // const { accessToken, accessTokenExpiration } = yield call(
    yield call(getUpdateProductsOfOrder, payload);

    // window.localStorage.setItem('jwt', accessToken);

    yield put({
      type: UPDATE_PRODUCTS_OF_ORDER,
      payload: payload.newProductsOfOrder,
    });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    console.error(err);
    yield put({ type: UPDATE_PRODUCTS_OF_ORDER, payload: [] });
  }
}

function* getDeleteProductOfOrderWatcher(action) {
  try {
    // accessTokenFront = yield select((state) => state.jwt);
    const { payload } = action;

    // const { accessToken, accessTokenExpiration } = yield call(
    yield call(getDeleteProductOfOrder, payload);

    // window.localStorage.setItem('jwt', accessToken);

    yield put({ type: DELETE_PRODUCT_OF_ORDER, payload });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    console.error(err);
    yield put({ type: DELETE_PRODUCT_OF_ORDER, payload: [] });
  }
}

function* getDeleteOrderWatcher(action) {
  try {
    // accessTokenFront = yield select((state) => state.jwt);

    const { payload } = action;

    // const { accessToken, accessTokenExpiration } = yield call(
    yield call(getDeleteOrder, payload);

    // window.localStorage.setItem('jwt', accessToken);

    yield put({ type: DELETE_ORDER, payload });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    console.error(err);
    yield put({ type: DELETE_ORDER, payload: [] });
  }
}

function* updateContactOfOrderWorker(action) {
  try {
    // accessTokenFront = yield select((state) => state.jwt);
    const { payload } = action;

    // const { accessToken, accessTokenExpiration } = yield call(
    yield call(updateContactOfOrder, payload);
    // window.localStorage.setItem('jwt', accessToken);

    yield put({ type: NEW_CONTACT_OF_ORDER, payload });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: NEW_CONTACT_OF_ORDER, payload: [] });
  }
}

function* updateDeliveryOfOrderWorker(action) {
  try {
    // accessTokenFront = yield select((state) => state.jwt);
    const { payload } = action;

    // const { accessToken, accessTokenExpiration } = yield call(
    yield call(updateDeliveryOfOrder, payload);
    // window.localStorage.setItem('jwt', accessToken);

    yield put({ type: NEW_DELIVERY_OF_ORDER, payload });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: NEW_DELIVERY_OF_ORDER, payload: [] });
  }
}

function* updateStatusOfOrderWorker(action) {
  try {
    // accessTokenFront = yield select((state) => state.jwt);
    const { payload } = action;

    // const { accessToken, accessTokenExpiration } = yield call(
    yield call(updateStatusOfOrder, payload);
    // window.localStorage.setItem('jwt', accessToken);

    yield put({ type: STATUS_OF_ORDER, payload });
    // yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: STATUS_OF_ORDER, payload: [] });
  }
}

function* ordersWatcher() {
  yield takeLatest(GET_ORDERS_LIST, getOrdersListWatcher);
  yield takeLatest(ADD_NEW_ORDER, addNewOrderWatcher);
  yield takeLatest(ADD_DATA_SHIP_ORDER, addDataShipOrderWatcher);
  yield takeLatest(GET_CURRENT_PRODUCTS_OF_ORDER, getCurrentProductsOfOrderWatcher);
  yield takeLatest(GET_PRODUCTS_OF_ORDER, getProductsOfOrderWatcher);
  yield takeLatest(GET_UPDATE_PRODUCTS_OF_ORDER, getUpdateProductsOfOrderWatcher);
  yield takeLatest(
    GET_UPDATE_PRODUCT_INFO_OF_ORDER,
    getUpdateProductInfoOfOrderWatcher
  );
  yield takeLatest(GET_DELETE_PRODUCT_OF_ORDER, getDeleteProductOfOrderWatcher);
  yield takeLatest(GET_DELETE_ORDER, getDeleteOrderWatcher);
  yield takeLatest(UPDATE_CONTACT_OF_ORDER, updateContactOfOrderWorker);
  yield takeLatest(UPDATE_DELIVERY_OF_ORDER, updateDeliveryOfOrderWorker);
  yield takeLatest(UPDATE_STATUS_OF_ORDER, updateStatusOfOrderWorker);
}

export default ordersWatcher;
