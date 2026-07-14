import { ADD_NEW_WAREHOUSE_MANAGER_TRAILER_SOCKET } from '../types/socketTypes/socket';
import { ALL_WAREHOUSE_MANAGER_TRAILER } from '../types/warehouseTypes';

export const orderDispatchReducer = (orderDispatch = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case ALL_WAREHOUSE_MANAGER_TRAILER: {
      return payload ?? orderDispatch;
    }

    case ADD_NEW_WAREHOUSE_MANAGER_TRAILER_SOCKET: {
      return payload ?? orderDispatch;
    }

    default:
      return orderDispatch;
  }
};
