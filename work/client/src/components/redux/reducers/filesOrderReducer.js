import { FULL_FILES_ORDER } from '../types/filesOrderTypes';
import {
  NEED_DELETE_FILES_ORDER_SOCKET,
  NEW_FILES_ORDER_SOCKET,
} from '../types/socketTypes/socket';

export const filesOrderReducer = (filesOrder = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_FILES_ORDER: {
      return payload;
    }
    case NEW_FILES_ORDER_SOCKET: {
      return [...filesOrder, payload];
    }
    case NEED_DELETE_FILES_ORDER_SOCKET: {
      const result = filesOrder.filter((el) => el.id !== payload);
      return result;
    }

    default:
      return filesOrder;
  }
};
