import {
  DATASHIP_ORDER_SOCKET,
  DELETE_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  DELETE_PRODUCT_OF_ORDER_SOCKET,
  NEW_ORDER_SOCKET,
  NEW_PRODUCT_SOCKET,
  NEW_RECIPE_SOCKET,
  NEW_WAREHOUSE_SOCKET,
  REMAINING_STOCK_SOCKET,
  STATUS_OF_ORDER_SOCKET,
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

export const updStatusOfOrderSocket = (order) => {
  return {
    type: STATUS_OF_ORDER_SOCKET,
    payload: order,
  };
};

export const deleteReservedProductSocket = (reserved_products_id) => {
  return {
    type: DELETE_PRODUCT_FROM_RESERVED_LIST_SOCKET,
    payload: reserved_products_id,
  };
};

export const updateRemainingStockSocket = (upd_rem_srock) => {
  return {
    type: REMAINING_STOCK_SOCKET,
    payload: upd_rem_srock,
  };
};

export const addNewWarehouseSocket = (new_warehouse) => {
  return {
    type: NEW_WAREHOUSE_SOCKET,
    payload: new_warehouse,
  };
};

export const addNewRecipeSocket = (recipe) => {
  return {
    type: NEW_RECIPE_SOCKET,
    payload: recipe,
  };
};
