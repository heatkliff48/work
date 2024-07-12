import { ADD_NEW_ORDER, GET_ORDERS_LIST } from '../types/ordersTypes';

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
