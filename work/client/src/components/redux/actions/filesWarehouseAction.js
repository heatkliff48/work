import {
  ADD_NEW_FILES_WAREHOUSE,
  DELETE_FILES_WAREHOUSE,
  GET_FULL_FILES_WAREHOUSE,
} from '../types/filesWarehouseTypes';

export const getFilesWarehouse = () => {
  return {
    type: GET_FULL_FILES_WAREHOUSE,
  };
};

export const addNewFilesWarehouse = (filesWarehouse) => {
  return {
    type: ADD_NEW_FILES_WAREHOUSE,
    payload: filesWarehouse,
  };
};

export const deleteFilesWarehouse = (warehouse_id) => {
  return {
    type: DELETE_FILES_WAREHOUSE,
    payload: warehouse_id,
  };
};
