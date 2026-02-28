import {
  ADD_NEW_PRODUCTION_QUALITY,
  GET_ALL_PRODUCTION_QUALITY,
} from '../types/productionQualityTypes';

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
