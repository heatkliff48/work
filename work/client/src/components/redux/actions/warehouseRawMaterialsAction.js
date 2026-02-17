import {
  ADD_NEW_WAREHOUSE_SAND,
  DELETE_WAREHOUSE_SAND,
  GET_FULL_WAREHOUSE_SAND,
  UPDATE_NEW_WAREHOUSE_SAND,
  ADD_NEW_WAREHOUSE_LIME,
  DELETE_WAREHOUSE_LIME,
  GET_FULL_WAREHOUSE_LIME,
  UPDATE_NEW_WAREHOUSE_LIME,
  ADD_NEW_WAREHOUSE_CEMENT,
  DELETE_WAREHOUSE_CEMENT,
  GET_FULL_WAREHOUSE_CEMENT,
  UPDATE_NEW_WAREHOUSE_CEMENT,
  ADD_NEW_WAREHOUSE_GYPSUM,
  DELETE_WAREHOUSE_GYPSUM,
  GET_FULL_WAREHOUSE_GYPSUM,
  UPDATE_NEW_WAREHOUSE_GYPSUM,
  ADD_NEW_WAREHOUSE_GYPSUM_STONE,
  DELETE_WAREHOUSE_GYPSUM_STONE,
  GET_FULL_WAREHOUSE_GYPSUM_STONE,
  UPDATE_NEW_WAREHOUSE_GYPSUM_STONE,
  ADD_NEW_WAREHOUSE_ALUMINUM1,
  DELETE_WAREHOUSE_ALUMINUM1,
  GET_FULL_WAREHOUSE_ALUMINUM1,
  UPDATE_NEW_WAREHOUSE_ALUMINUM1,
  ADD_NEW_WAREHOUSE_ALUMINUM2,
  DELETE_WAREHOUSE_ALUMINUM2,
  GET_FULL_WAREHOUSE_ALUMINUM2,
  UPDATE_NEW_WAREHOUSE_ALUMINUM2,
  ADD_NEW_WAREHOUSE_GRINDING_BALLS,
  DELETE_WAREHOUSE_GRINDING_BALLS,
  GET_FULL_WAREHOUSE_GRINDING_BALLS,
  UPDATE_NEW_WAREHOUSE_GRINDING_BALLS,
  ADD_NEW_WAREHOUSE_AAC,
  DELETE_WAREHOUSE_AAC,
  GET_FULL_WAREHOUSE_AAC,
  UPDATE_NEW_WAREHOUSE_AAC,
  GET_FULL_WAREHOUSE_SAND_SLURRY,
  ADD_NEW_WAREHOUSE_SAND_SLURRY,
} from '../types/warehouseRawMaterialsTypes';

// Sand
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

// Lime
export const getWarehouseLime = () => {
  return {
    type: GET_FULL_WAREHOUSE_LIME,
  };
};

export const addNewWarehouseLime = (warehouseLime) => {
  return {
    type: ADD_NEW_WAREHOUSE_LIME,
    payload: warehouseLime,
  };
};

export const updateWarehouseLime = (warehouseLime) => {
  return {
    type: UPDATE_NEW_WAREHOUSE_LIME,
    payload: warehouseLime,
  };
};

export const deleteWarehouseLime = (lime_warehouse_id) => {
  return {
    type: DELETE_WAREHOUSE_LIME,
    payload: lime_warehouse_id,
  };
};

// Cement
export const getWarehouseCement = () => {
  return {
    type: GET_FULL_WAREHOUSE_CEMENT,
  };
};

export const addNewWarehouseCement = (warehouseCement) => {
  return {
    type: ADD_NEW_WAREHOUSE_CEMENT,
    payload: warehouseCement,
  };
};

export const updateWarehouseCement = (warehouseCement) => {
  return {
    type: UPDATE_NEW_WAREHOUSE_CEMENT,
    payload: warehouseCement,
  };
};

export const deleteWarehouseCement = (cement_warehouse_id) => {
  return {
    type: DELETE_WAREHOUSE_CEMENT,
    payload: cement_warehouse_id,
  };
};

// Gypsum
export const getWarehouseGypsum = () => {
  return {
    type: GET_FULL_WAREHOUSE_GYPSUM,
  };
};

export const addNewWarehouseGypsum = (warehouseGypsum) => {
  return {
    type: ADD_NEW_WAREHOUSE_GYPSUM,
    payload: warehouseGypsum,
  };
};

export const updateWarehouseGypsum = (warehouseGypsum) => {
  return {
    type: UPDATE_NEW_WAREHOUSE_GYPSUM,
    payload: warehouseGypsum,
  };
};

export const deleteWarehouseGypsum = (gypsum_warehouse_id) => {
  return {
    type: DELETE_WAREHOUSE_GYPSUM,
    payload: gypsum_warehouse_id,
  };
};

// Gypsum stone
export const getWarehouseGypsumStone = () => {
  return {
    type: GET_FULL_WAREHOUSE_GYPSUM_STONE,
  };
};

export const addNewWarehouseGypsumStone = (warehouseGypsumStone) => {
  return {
    type: ADD_NEW_WAREHOUSE_GYPSUM_STONE,
    payload: warehouseGypsumStone,
  };
};

export const updateWarehouseGypsumStone = (warehouseGypsumStone) => {
  return {
    type: UPDATE_NEW_WAREHOUSE_GYPSUM_STONE,
    payload: warehouseGypsumStone,
  };
};

export const deleteWarehouseGypsumStone = (gypsum_stone_warehouse_id) => {
  return {
    type: DELETE_WAREHOUSE_GYPSUM_STONE,
    payload: gypsum_stone_warehouse_id,
  };
};

// Aluminum1
export const getWarehouseAluminum1 = () => {
  return {
    type: GET_FULL_WAREHOUSE_ALUMINUM1,
  };
};

export const addNewWarehouseAluminum1 = (warehouseAluminum1) => {
  return {
    type: ADD_NEW_WAREHOUSE_ALUMINUM1,
    payload: warehouseAluminum1,
  };
};

export const updateWarehouseAluminum1 = (warehouseAluminum1) => {
  return {
    type: UPDATE_NEW_WAREHOUSE_ALUMINUM1,
    payload: warehouseAluminum1,
  };
};

export const deleteWarehouseAluminum1 = (aluminum1_warehouse_id) => {
  return {
    type: DELETE_WAREHOUSE_ALUMINUM1,
    payload: aluminum1_warehouse_id,
  };
};

// Aluminum2
export const getWarehouseAluminum2 = () => {
  return {
    type: GET_FULL_WAREHOUSE_ALUMINUM2,
  };
};

export const addNewWarehouseAluminum2 = (warehouseAluminum2) => {
  return {
    type: ADD_NEW_WAREHOUSE_ALUMINUM2,
    payload: warehouseAluminum2,
  };
};

export const updateWarehouseAluminum2 = (warehouseAluminum2) => {
  return {
    type: UPDATE_NEW_WAREHOUSE_ALUMINUM2,
    payload: warehouseAluminum2,
  };
};

export const deleteWarehouseAluminum2 = (aluminum2_warehouse_id) => {
  return {
    type: DELETE_WAREHOUSE_ALUMINUM2,
    payload: aluminum2_warehouse_id,
  };
};

// Grinding Balls
export const getWarehouseGrindingBalls = () => {
  return {
    type: GET_FULL_WAREHOUSE_GRINDING_BALLS,
  };
};

export const addNewWarehouseGrindingBalls = (warehouseGrindingBalls) => {
  return {
    type: ADD_NEW_WAREHOUSE_GRINDING_BALLS,
    payload: warehouseGrindingBalls,
  };
};

export const updateWarehouseGrindingBalls = (warehouseGrindingBalls) => {
  return {
    type: UPDATE_NEW_WAREHOUSE_GRINDING_BALLS,
    payload: warehouseGrindingBalls,
  };
};

export const deleteWarehouseGrindingBalls = (grinding_balls_warehouse_id) => {
  return {
    type: DELETE_WAREHOUSE_GRINDING_BALLS,
    payload: grinding_balls_warehouse_id,
  };
};

// AAC
export const getWarehouseAAC = () => {
  return {
    type: GET_FULL_WAREHOUSE_AAC,
  };
};

export const addNewWarehouseAAC = (warehouseAAC) => {
  return {
    type: ADD_NEW_WAREHOUSE_AAC,
    payload: warehouseAAC,
  };
};

export const updateWarehouseAAC = (warehouseAAC) => {
  return {
    type: UPDATE_NEW_WAREHOUSE_AAC,
    payload: warehouseAAC,
  };
};

export const deleteWarehouseAAC = (aac_warehouse_id) => {
  return {
    type: DELETE_WAREHOUSE_AAC,
    payload: aac_warehouse_id,
  };
};

// Sand Slurry
export const getWarehouseSandSlurry = () => {
  return {
    type: GET_FULL_WAREHOUSE_SAND_SLURRY,
  };
};

export const addNewWarehouseSandSlurry = (warehouseSandSlurry) => {
  return {
    type: ADD_NEW_WAREHOUSE_SAND_SLURRY,
    payload: warehouseSandSlurry,
  };
};
