import {
  ADD_BATCH_STATE,
  UPDATE_BATCH_BUTTON_STATUS,
  UPDATE_BATCH_STATE,
} from '../types/productionBatchLogTypes';

export const unlockButton = (status) => {
  return {
    type: UPDATE_BATCH_BUTTON_STATUS,
    payload: status,
  };
};

export const addBatchState = (batchData) => {
  return {
    type: ADD_BATCH_STATE,
    payload: batchData,
  };
};

export const updateBatchState = (batchData) => {
  return {
    type: UPDATE_BATCH_STATE,
    payload: batchData,
  };
};
