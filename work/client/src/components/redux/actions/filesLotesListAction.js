import {
  ADD_NEW_FILES_LOTES_LIST,
  DELETE_FILES_LOTES_LIST,
  GET_FULL_FILES_LOTES_LIST,
} from '../types/filesLotesListTypes';

export const getFilesLotesList = () => {
  return {
    type: GET_FULL_FILES_LOTES_LIST,
  };
};

export const addNewFilesLotesList = (filesLotesList) => {
  return {
    type: ADD_NEW_FILES_LOTES_LIST,
    payload: filesLotesList,
  };
};

export const deleteFilesLotesList = (lotesList_id) => {
  return {
    type: DELETE_FILES_LOTES_LIST,
    payload: lotesList_id,
  };
};
