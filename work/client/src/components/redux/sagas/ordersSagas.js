import { put, call, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import showErrorMessage from '../../Utils/showErrorMessage';
import { setToken } from '../actions/jwtAction';
import {
  ADD_NEW_ORDER,
  GET_ORDERS_LIST,
  GET_PRODUCTS_OF_ORDER,
  NEW_ORDER,
  ORDERS_LIST,
  PRODUCTS_OF_ORDER,
} from '../types/ordersTypes';

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

const getPrroductsOfOrder = (order_id) => {
  return url
    .post('/orders/products', { order_id })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

function* getOrdersListWatcher() {
  try {
    accessTokenFront = yield select((state) => state.jwt);
    const { orders, accessToken, accessTokenExpiration } = yield call(getAllOrders);

    window.localStorage.setItem('jwt', accessToken);

    yield put({ type: ORDERS_LIST, payload: orders });
    yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    console.error('Error in getAllProductsWatcher:', err);
    yield put({ type: ORDERS_LIST, payload: [] });
  }
}

function* addNewOrderWatcher(action) {
  try {
    accessTokenFront = yield select((state) => state.jwt);

    const { newOrder, accessToken, accessTokenExpiration } = yield call(
      addNewOrder,
      action.payload
    );

    console.log('Orders FROM BACK', newOrder);
    window.localStorage.setItem('jwt', accessToken);

    yield put({ type: NEW_ORDER, payload: newOrder });
    yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    console.error(err);
    yield put({ type: NEW_ORDER, payload: [] });
  }
}

function* getPrroductsOfOrderWatcher(action) {
  try {
    accessTokenFront = yield select((state) => state.jwt);

    const { product_list, accessToken, accessTokenExpiration } = yield call(
      getPrroductsOfOrder,
      action.payload
    );

    window.localStorage.setItem('jwt', accessToken);

    yield put({ type: PRODUCTS_OF_ORDER, payload: product_list });
    yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    console.error(err);
    yield put({ type: PRODUCTS_OF_ORDER, payload: [] });
  }
}

function* ordersWatcher() {
  yield takeLatest(GET_ORDERS_LIST, getOrdersListWatcher);
  yield takeLatest(ADD_NEW_ORDER, addNewOrderWatcher);
  yield takeLatest(GET_PRODUCTS_OF_ORDER, getPrroductsOfOrderWatcher);
}

export default ordersWatcher;
