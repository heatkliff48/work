import { FULL_BATCH_OUTSIDE } from '../types/batchOutsideTypes';
import {
  NEED_DELETE_BATCH_OUTSIDE_SOCKET,
  NEED_UPDATE_BATCH_OUTSIDE_SOCKET,
  NEW_BATCH_OUTSIDE_SOCKET,
} from '../types/socketTypes/socket';

export const batchOutsideReducer = (batchOutside = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_BATCH_OUTSIDE: {
      return payload;
    }
    case NEW_BATCH_OUTSIDE_SOCKET: {
      return [...batchOutside, payload];
    }
    case NEED_DELETE_BATCH_OUTSIDE_SOCKET: {
      const result = batchOutside.filter((el) => el.id !== payload);
      return result;
    }
    case NEED_UPDATE_BATCH_OUTSIDE_SOCKET: {
      const result = batchOutside.map((el) => {
        if (el.id === payload[1].id) return payload[1];
        return el;
      });
      return result;
      // return [...clients, payload];
    }
    default:
      return batchOutside;
  }
};
