import { FULL_BATCH_OUTSIDE } from '../types/batchOutsideTypes';
import { NEW_BATCH_OUTSIDE_SOCKET } from '../types/socketTypes/socket';

export const batchOutsideReducer = (batchOutside = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_BATCH_OUTSIDE: {
      return payload;
    }
    case NEW_BATCH_OUTSIDE_SOCKET: {
      return [...batchOutside, payload];
    }
    default:
      return batchOutside;
  }
};
