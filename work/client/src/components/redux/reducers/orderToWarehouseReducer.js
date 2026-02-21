import { FULL_ORDER_TO_WAREHOUSE } from '../types/orderToWarehouseTypes';
import {
  NEED_DELETE_ORDER_TO_WAREHOUSE_SOCKET,
  NEED_UPDATE_ORDER_TO_WAREHOUSE_SOCKET,
  NEW_ORDER_TO_WAREHOUSE_SOCKET,
} from '../types/socketTypes/socket';

export const orderToWarehouseReducer = (orderToWarehouse = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_ORDER_TO_WAREHOUSE: {
      const result = payload.filter((el) => el.quantity_pallets !== 0);
      return result;
    }
    case NEW_ORDER_TO_WAREHOUSE_SOCKET: {
      return [...orderToWarehouse, payload];
    }
    case NEED_DELETE_ORDER_TO_WAREHOUSE_SOCKET: {
      const result = orderToWarehouse.filter((el) => el.id !== payload);
      return result;
    }
    case NEED_UPDATE_ORDER_TO_WAREHOUSE_SOCKET: {
      const result = orderToWarehouse.map((el) => {
        if (el.id === payload[1].id) return payload[1];
        return el;
      });
      return result;
    }
    default:
      return orderToWarehouse;
  }
};
