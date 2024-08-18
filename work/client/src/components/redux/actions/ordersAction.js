import {
  ADD_DATA_SHIP_ORDER,
  ADD_NEW_ORDER,
  GET_DELETE_ORDER,
  GET_DELETE_PRODUCT_OF_ORDER,
  GET_ORDERS_LIST,
  GET_PRODUCTS_OF_ORDER,
  GET_UPDATE_PRODUCT_INFO_OF_ORDER,
  GET_UPDATE_PRODUCTS_OF_ORDER,
  UPDATE_CONTACT_OF_ORDER,
  UPDATE_DELIVERY_OF_ORDER,
  UPDATE_STATUS_OF_ORDER,
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

export const addDataShipOrder = (date) => {
  return {
    type: ADD_DATA_SHIP_ORDER,
    payload: date,
  };
};

export const getProductsOfOrders = (order_id) => {
  return {
    type: GET_PRODUCTS_OF_ORDER,
    payload: order_id,
  };
};

export const getUpdateProductOfOrders = (newProductsOfOrder) => {
  return {
    type: GET_UPDATE_PRODUCTS_OF_ORDER,
    payload: newProductsOfOrder,
  };
};

export const getUpdateProductInfoOfOrders = (productOfOrder) => {
  return {
    type: GET_UPDATE_PRODUCT_INFO_OF_ORDER,
    payload: productOfOrder,
  };
};

export const getDeleteProductOfOrder = (product_id) => {
  return {
    type: GET_DELETE_PRODUCT_OF_ORDER,
    payload: product_id,
  };
};

export const deleteOrder = (order_id) => {
  return {
    type: GET_DELETE_ORDER,
    payload: order_id,
  };
};

export const updateContactOfOrder = (newContactOfOrder) => {
  return {
    type: UPDATE_CONTACT_OF_ORDER,
    payload: newContactOfOrder,
  };
};

export const updateDeliveryOfOrder = (newDeliveryOfOrder) => {
  return {
    type: UPDATE_DELIVERY_OF_ORDER,
    payload: newDeliveryOfOrder,
  };
};

export const updateOrderStatus = (orderStatus) => {
  return {
    type: UPDATE_STATUS_OF_ORDER,
    payload: orderStatus,
  };
};
