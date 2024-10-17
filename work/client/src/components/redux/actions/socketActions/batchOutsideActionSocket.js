import {
  NEED_UPDATE_BATCH_OUTSIDE_SOCKET,
  NEW_BATCH_OUTSIDE_SOCKET,
} from '#components/redux/types/socketTypes/socket.js';

export const addNewBatchOutsideSocket = (batchOutside) => {
  return {
    type: NEW_BATCH_OUTSIDE_SOCKET,
    payload: batchOutside,
  };
};

export const updateBatchOutsideSocket = (batchOutside) => {
  return {
    type: NEED_UPDATE_BATCH_OUTSIDE_SOCKET,
    payload: batchOutside,
  };
};
