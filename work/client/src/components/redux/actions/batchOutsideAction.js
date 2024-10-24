import {
  ADD_NEW_BATCH_OUTSIDE,
  DELETE_BATCH_OUTSIDE,
  GET_FULL_BATCH_OUTSIDE,
  UPDATE_NEW_BATCH_OUTSIDE,
} from '../types/batchOutsideTypes';

export const getBatchOutside = () => {
  return {
    type: GET_FULL_BATCH_OUTSIDE,
  };
};

export const addNewBatchOutside = (batchOutside) => {
  return {
    type: ADD_NEW_BATCH_OUTSIDE,
    payload: batchOutside,
  };
};

export const updateBatchOutside = (batchOutside) => {
  return {
    type: UPDATE_NEW_BATCH_OUTSIDE,
    payload: batchOutside,
  };
};

export const deleteBatchOutside = (batch_id) => {
  return {
    type: DELETE_BATCH_OUTSIDE,
    payload: batch_id,
  };
};
