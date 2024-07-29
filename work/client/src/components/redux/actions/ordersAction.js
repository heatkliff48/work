import {
  ADD_NEW_ORDER,
  GET_ORDERS_LIST,
  GET_PRODUCTS_OF_ORDER,
} from '../types/ordersTypes';

export const getOrders = () => {
  return {
    type: GET_ORDERS_LIST,
  };
};

export const addNewOrder = (order) => {
  return {
    type: ADD_NEW_ORDER,
    payload: order,
  };
};

export const getProductsOfOrders = (order_id) => {
  return {
    type: GET_PRODUCTS_OF_ORDER,
    payload: order_id,
  };
};
