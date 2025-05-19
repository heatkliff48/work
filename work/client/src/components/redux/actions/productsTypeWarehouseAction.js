import {
  ADD_NEW_ANCHORS_WAREHOUSE,
  ADD_NEW_DRY_MIXES_WAREHOUSE,
  ADD_NEW_RELATED_MATERIALS_WAREHOUSE,
  ADD_NEW_TOOLS_WAREHOUSE,
  GET_FULL_ANCHORS_WAREHOUSE,
  GET_FULL_DRY_MIXES_WAREHOUSE,
  GET_FULL_RELATED_MATERIALS_WAREHOUSE,
  GET_FULL_TOOLS_WAREHOUSE,
  UPDATE_NEW_ANCHORS_WAREHOUSE,
  UPDATE_NEW_DRY_MIXES_WAREHOUSE,
  UPDATE_NEW_RELATED_MATERIALS_WAREHOUSE,
  UPDATE_NEW_TOOLS_WAREHOUSE,
} from '../types/productsTypeWarehouseTypes';

export const getDryMixesWarehouse = () => {
  return {
    type: GET_FULL_DRY_MIXES_WAREHOUSE,
  };
};

export const addNewDryMixesWarehouse = (dryMixesWarehouse) => {
  return {
    type: ADD_NEW_DRY_MIXES_WAREHOUSE,
    payload: dryMixesWarehouse,
  };
};

export const updateDryMixesWarehouse = (dryMixesWarehouse) => {
  return {
    type: UPDATE_NEW_DRY_MIXES_WAREHOUSE,
    payload: dryMixesWarehouse,
  };
};

export const getRelatedMaterialsWarehouse = () => {
  return {
    type: GET_FULL_RELATED_MATERIALS_WAREHOUSE,
  };
};

export const addNewRelatedMaterialsWarehouse = (relatedMaterialsWarehouse) => {
  return {
    type: ADD_NEW_RELATED_MATERIALS_WAREHOUSE,
    payload: relatedMaterialsWarehouse,
  };
};

export const updateRelatedMaterialsWarehouse = (relatedMaterialsWarehouse) => {
  return {
    type: UPDATE_NEW_RELATED_MATERIALS_WAREHOUSE,
    payload: relatedMaterialsWarehouse,
  };
};

export const getAnchorsWarehouse = () => {
  return {
    type: GET_FULL_ANCHORS_WAREHOUSE,
  };
};

export const addNewAnchorsWarehouse = (anchorsWarehouse) => {
  return {
    type: ADD_NEW_ANCHORS_WAREHOUSE,
    payload: anchorsWarehouse,
  };
};

export const updateAnchorsWarehouse = (anchorsWarehouse) => {
  return {
    type: UPDATE_NEW_ANCHORS_WAREHOUSE,
    payload: anchorsWarehouse,
  };
};

export const getToolsWarehouse = () => {
  return {
    type: GET_FULL_TOOLS_WAREHOUSE,
  };
};

export const addNewToolsWarehouse = (toolsWarehouse) => {
  return {
    type: ADD_NEW_TOOLS_WAREHOUSE,
    payload: toolsWarehouse,
  };
};

export const updateToolsWarehouse = (toolsWarehouse) => {
  return {
    type: UPDATE_NEW_TOOLS_WAREHOUSE,
    payload: toolsWarehouse,
  };
};
