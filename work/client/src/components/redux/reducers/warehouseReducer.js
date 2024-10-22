import { NEW_WAREHOUSE_SOCKET, REMAINING_STOCK_SOCKET } from '../types/socketTypes/socket';
import {
  ALL_WAREHOUSE,
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

    case REMAINING_STOCK_SOCKET: {
      const { warehouse_id, new_remaining_stock } = payload;
      const result = warehouse.map((el) => {
        if (el.id === warehouse_id) {
          return { ...el, remaining_stock: new_remaining_stock };
        }

        return el;
      });

      return result;
    }

    default:
      return warehouse;
  }
};
