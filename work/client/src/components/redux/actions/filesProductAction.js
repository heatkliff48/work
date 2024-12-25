import {
  ADD_NEW_FILES_PRODUCT,
  DELETE_FILES_PRODUCT,
  GET_FULL_FILES_PRODUCT,
} from '../types/filesProductTypes';

export const getFilesProduct = () => {
  return {
    type: GET_FULL_FILES_PRODUCT,
  };
};

export const addNewFilesProduct = (filesProduct) => {
  return {
    type: ADD_NEW_FILES_PRODUCT,
    payload: filesProduct,
  };
};

export const deleteFilesProduct = (product_id) => {
  return {
    type: DELETE_FILES_PRODUCT,
    payload: product_id,
  };
};
