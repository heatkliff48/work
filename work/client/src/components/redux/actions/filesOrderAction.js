import {
  ADD_NEW_FILES_ORDER,
  DELETE_FILES_ORDER,
  GET_FULL_FILES_ORDER,
} from '../types/filesOrderTypes';

export const getFilesOrder = () => {
  return {
    type: GET_FULL_FILES_ORDER,
  };
};

export const addNewFilesOrder = (filesOrder) => {
  return {
    type: ADD_NEW_FILES_ORDER,
    payload: filesOrder,
  };
};

export const deleteFilesOrder = (order_id) => {
  return {
    type: DELETE_FILES_ORDER,
    payload: order_id,
  };
};
