import {
  ADD_NEW_ORDER_TO_WAREHOUSE,
  DELETE_ORDER_TO_WAREHOUSE,
  GET_FULL_ORDER_TO_WAREHOUSE,
  UPDATE_NEW_ORDER_TO_WAREHOUSE,
} from '../types/orderToWarehouseTypes';

export const getOrderToWarehouse = () => {
  return {
    type: GET_FULL_ORDER_TO_WAREHOUSE,
  };
};

export const addNewOrderToWarehouse = (orderToWarehouse) => {
  return {
    type: ADD_NEW_ORDER_TO_WAREHOUSE,
    payload: orderToWarehouse,
  };
};

export const updateOrderToWarehouse = (orderToWarehouse) => {
  return {
    type: UPDATE_NEW_ORDER_TO_WAREHOUSE,
    payload: orderToWarehouse,
  };
};

export const deleteOrderToWarehouse = (order_id) => {
  return {
    type: DELETE_ORDER_TO_WAREHOUSE,
    payload: order_id,
  };
};
