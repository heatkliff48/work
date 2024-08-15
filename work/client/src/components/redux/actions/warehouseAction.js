import { ADD_NEW_WAREHOUSE, GET_ALL_WAREHOUSE } from '../types/warehouseTypes';

export const getAllWarehouse = () => {
  return {
    type: GET_ALL_WAREHOUSE,
  };
};
export const addNewWarehouse = (warehouse) => {
  return {
    type: ADD_NEW_WAREHOUSE,
    payload: warehouse,
  };
};
