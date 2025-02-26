import { NEW_WAREHOUSE_SOCKET, REMAINING_STOCK_SOCKET } from '../types/socketTypes/socket';
import {
  ALL_WAREHOUSE,
  REMAINING_STOCK,
} from '../types/warehouseTypes';

export const warehouseReducer = (warehouse = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case ALL_WAREHOUSE: {
      return payload;
    }

    case NEW_WAREHOUSE_SOCKET: {

      return [...warehouse, payload];
    }

    case REMAINING_STOCK: {
      return payload;
    }

    case REMAINING_STOCK_SOCKET: {
      return payload;
    }

    default:
      return warehouse;
  }
};
