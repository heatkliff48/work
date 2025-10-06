import {
  NEW_WAREHOUSE_SOCKET,
  REMAINING_STOCK_SOCKET,
  WAREHOUSE_QUANTITYS_SOCKET,
} from '../types/socketTypes/socket';
import {
  ALL_WAREHOUSE,
  REMAINING_STOCK,
  WAREHOSE_QUANTITYS,
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

    case WAREHOSE_QUANTITYS:
    case WAREHOUSE_QUANTITYS_SOCKET: {
      const { warehouse_id, total_quantity, ordered_quantity } = payload;

      const result = warehouse.map((el) => {
        if (el.id === warehouse_id) {
          return { ...el, total_quantity, ordered_quantity };
        }

        return el;
      });
      return result;
    }

    case REMAINING_STOCK:
    case REMAINING_STOCK_SOCKET: {
      const { warehouse_id, free_quantity_remaining, ordered_quantity } = payload;

      const result = warehouse.map((el) => {
        if (el.id === warehouse_id) {
          return { ...el, free_quantity_remaining, ordered_quantity };
        }

        return el;
      });
      return result;
    }

    default:
      return warehouse;
  }
};
