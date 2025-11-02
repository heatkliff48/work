import {
  ADD_NEW_LOTES_LIST,
  GET_FULL_LOTES_LIST,
} from "../types/lotesListTypes";

export const getLotesList = () => {
  return {
    type: GET_FULL_LOTES_LIST,
  };
};

export const addNewLotesList = (lotesList) => {
  return {
    type: ADD_NEW_LOTES_LIST,
    payload: lotesList,
  };
};
