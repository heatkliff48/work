import {
  DATASHIP_ORDER_SOCKET,
  DELETE_PRODUCT_OF_ORDER_SOCKET,
  NEW_ORDER_SOCKET,
  NEW_PRODUCT_SOCKET,
  UPD_PRODUCT_SOCKET,
  UPDATE_PRODUCT_OF_ORDER_REDUCER_SOCKET,
  UPDATE_ROLE_ACTIVE_SOCKET,
  UPDATE_ROLE_SOCKET,
} from '#components/redux/types/socketTypes/socket.js';

export const updateRolesSocket = (updRoleData) => {
  return {
    type: UPDATE_ROLE_SOCKET,
    payload: updRoleData,
  };
};

export const updateRolesActiveSocket = (updActiveRoleData) => {
  return {
    type: UPDATE_ROLE_ACTIVE_SOCKET,
    payload: updActiveRoleData,
  };
};

export const addNewProductSocket = (products) => {
  return {
    type: NEW_PRODUCT_SOCKET,
    payload: products,
  };
};

export const updateProductSocket = (products) => {
  return {
    type: UPD_PRODUCT_SOCKET,
    payload: products,
  };
};

export const addNewOrderSocket = (newOrder) => {
  return {
    type: NEW_ORDER_SOCKET,
    payload: newOrder,
  };
};

export const updProductOfOrderSocket = (product_of_order) => {
  return {
    type: UPDATE_PRODUCT_OF_ORDER_REDUCER_SOCKET,
    payload: product_of_order,
  };
};

export const deeleteProductOfOrderSocket = (product_id) => {
  return {
    type: DELETE_PRODUCT_OF_ORDER_SOCKET,
    payload: product_id,
  };
};

export const addDatashipOrderSocket = (date) => {
  return {
    type: DATASHIP_ORDER_SOCKET,
    payload: date,
  };
};
