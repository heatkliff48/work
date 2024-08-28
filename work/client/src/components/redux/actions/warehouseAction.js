import {
  ADD_NEW_RESERVED_PRODUCT,
  ADD_NEW_WAREHOUSE,
  GET_DELETE_PRODUCT_FROM_RESERVED_LIST,
  GET_ALL_WAREHOUSE,
  GET_LIST_OF_RESERVED_PRODUCTS,
  UPDATE_REMAINING_STOCK,
} from '../types/warehouseTypes';

export const getAllWarehouse = () => {
  return {
    type: GET_ALL_WAREHOUSE,
  };
};

export const getListOfReservedProducts = () => {
  return {
    type: GET_LIST_OF_RESERVED_PRODUCTS,
  };
};

export const addNewWarehouse = (warehouse) => {
  return {
    type: ADD_NEW_WAREHOUSE,
    payload: warehouse,
  };
};

export const updateRemainingStock = (upd_rem_srock) => {
  return {
    type: UPDATE_REMAINING_STOCK,
    payload: upd_rem_srock,
  };
};

export const addNewReservedProducts = (reserved_product) => {
  return {
    type: ADD_NEW_RESERVED_PRODUCT,
    payload: reserved_product,
  };
};

export const deleteReservedProducts = (id) => {
  return {
    type: GET_DELETE_PRODUCT_FROM_RESERVED_LIST,
    payload: id,
  };
};
