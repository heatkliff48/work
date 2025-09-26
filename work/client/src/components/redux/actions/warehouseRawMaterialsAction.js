import {
  ADD_NEW_WAREHOUSE_SAND,
  DELETE_WAREHOUSE_SAND,
  GET_FULL_WAREHOUSE_SAND,
  UPDATE_NEW_WAREHOUSE_SAND,
} from '../types/warehouseRawMaterialsTypes';

export const getWarehouseSand = () => {
  return {
    type: GET_FULL_WAREHOUSE_SAND,
  };
};

export const addNewWarehouseSand = (warehouseSand) => {
  return {
    type: ADD_NEW_WAREHOUSE_SAND,
    payload: warehouseSand,
  };
};

export const updateWarehouseSand = (warehouseSand) => {
  return {
    type: UPDATE_NEW_WAREHOUSE_SAND,
    payload: warehouseSand,
  };
};

export const deleteWarehouseSand = (sand_warehouse_id) => {
  return {
    type: DELETE_WAREHOUSE_SAND,
    payload: sand_warehouse_id,
  };
};
