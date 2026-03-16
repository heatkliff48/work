import {
  ADD_NEW_COMPRESSIONS_QUALITY,
  ADD_NEW_DIMENSIONS_QUALITY,
  ADD_NEW_PRODUCTION_QUALITY,
  GET_ALL_COMPRESSIONS_QUALITY,
  GET_ALL_DIMENSIONS_QUALITY,
  GET_ALL_PRODUCTION_QUALITY,
  UPDATE_COMPRESSIONS_QUALITY,
  UPDATE_DIMENSIONS_QUALITY,
} from '../types/productionQualityTypes';

//PRODUCTION QUALITY
export const getProductionQuality = () => {
  return {
    type: GET_ALL_PRODUCTION_QUALITY,
  };
};

export const addNewProductionQuality = (data) => {
  return {
    type: ADD_NEW_PRODUCTION_QUALITY,
    payload: data,
  };
};

//DIMENSION QUALITY
export const getDimensionsQuality = () => {
  return {
    type: GET_ALL_DIMENSIONS_QUALITY,
  };
};

export const addNewDimensionsQuality = (data) => {
  return {
    type: ADD_NEW_DIMENSIONS_QUALITY,
    payload: data,
  };
};

export const updateDimensionsQuality = (data) => {
  return {
    type: UPDATE_DIMENSIONS_QUALITY,
    payload: data,
  };
};

//COMPRESSIONS QUALITY
export const getCompressionsQuality = () => {
  return {
    type: GET_ALL_COMPRESSIONS_QUALITY,
  };
};

export const addNewCompressionsQuality = (data) => {
  return {
    type: ADD_NEW_COMPRESSIONS_QUALITY,
    payload: data,
  };
};

export const updateCompressionsQuality = (data) => {
  return {
    type: UPDATE_COMPRESSIONS_QUALITY,
    payload: data,
  };
};
