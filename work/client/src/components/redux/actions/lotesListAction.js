import {
  ADD_NEW_LOTES_LIST,
  ADD_NEW_LOTES_LIST_CAKES,
  GET_FULL_LOTES_LIST,
  GET_FULL_LOTES_LIST_CAKES,
  UPDATE_LOTES_LIST,
  UPDATE_LOTES_LIST_CAKES,
  UPDATE_LOTES_LIST_CAKES_BOOLEAN,
} from '../types/lotesListTypes';

export const getLotesList = () => {
  return {
    type: GET_FULL_LOTES_LIST,
  };
};

export const addNewLotesList = (lotesListBatches) => {
  return {
    type: ADD_NEW_LOTES_LIST,
    payload: lotesListBatches,
  };
};

export const updateLotesListRecipe = (lotesListBatches) => {
  return {
    type: UPDATE_LOTES_LIST,
    payload: lotesListBatches,
  };
};
//--------------Lotes List Cakes------------------LotesListsCakes
export const getLotesListCakes = () => {
  return {
    type: GET_FULL_LOTES_LIST_CAKES,
  };
};

export const addNewLotesListCakes = (lotesListBatches) => {
  return {
    type: ADD_NEW_LOTES_LIST_CAKES,
    payload: lotesListBatches,
  };
};

export const updateLotesListCakesRecipe = (lotesListBatches) => {
  return {
    type: UPDATE_LOTES_LIST_CAKES,
    payload: lotesListBatches,
  };
};

export const updateLotesListCakesBooleanRecipe = (lotesListBatches) => {
  return {
    type: UPDATE_LOTES_LIST_CAKES_BOOLEAN,
    payload: lotesListBatches,
  };
};
