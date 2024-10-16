import { REMAINING_STOCK_SOCKET } from '../types/socketTypes/socket';
import {
  ALL_WAREHOUSE,
  NEW_WAREHOUSE,
} from '../types/warehouseTypes';

export const warehouseReducer = (warehouse = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case ALL_WAREHOUSE: {
      return payload;
    }

    case NEW_WAREHOUSE: {
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
