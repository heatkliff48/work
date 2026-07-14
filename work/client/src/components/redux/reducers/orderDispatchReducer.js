import {
  ADD_NEW_WAREHOUSE_MANAGER_TRAILER_SOCKET,
  NEEF_DELETE_WAREHOUSE_MANAGER_TRAILER_SOCKET,
  NEW_STATUS_WAREHOUSE_MANAGER_TRAILER_SOCKET,
} from '../types/socketTypes/socket';
import { ALL_WAREHOUSE_MANAGER_TRAILER } from '../types/warehouseTypes';

export const orderDispatchReducer = (orderDispatch = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case ALL_WAREHOUSE_MANAGER_TRAILER: {
      return payload ?? orderDispatch;
    }

    case ADD_NEW_WAREHOUSE_MANAGER_TRAILER_SOCKET: {
      return [...orderDispatch, ...payload];
    }

    case NEW_STATUS_WAREHOUSE_MANAGER_TRAILER_SOCKET: {
      const updatedById = new Map(payload?.map((item) => [item.id, item]));

      return orderDispatch.map((item) => {
        const updatedItem = updatedById.get(item.id);

        return updatedItem ? { ...item, ...updatedItem } : item;
      });
    }

    case NEEF_DELETE_WAREHOUSE_MANAGER_TRAILER_SOCKET: {
      const arr = orderDispatch.filter((el) => el.orderId != payload);
      return arr;
    }

    default:
      return orderDispatch;
  }
};
