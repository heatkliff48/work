import { FULL_WAREHOUSE_SAND } from '../types/warehouseRawMaterialsTypes';
import {
  NEED_DELETE_WAREHOUSE_SAND_SOCKET,
  NEED_UPDATE_WAREHOUSE_SAND_SOCKET,
  NEW_WAREHOUSE_SAND_SOCKET,
} from '../types/socketTypes/socket';

export const warehouseSandReducer = (warehouseSand = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_WAREHOUSE_SAND: {
      return payload;
    }
    case NEW_WAREHOUSE_SAND_SOCKET: {
      return [...warehouseSand, payload];
    }
    case NEED_DELETE_WAREHOUSE_SAND_SOCKET: {
      const result = warehouseSand.filter((el) => el.id !== payload);
      return result;
    }
    case NEED_UPDATE_WAREHOUSE_SAND_SOCKET: {
      const result = warehouseSand.map((el) => {
        if (el.id === payload[1].id) return payload[1];
        return el;
      });
      return result;
    }
    default:
      return warehouseSand;
  }
};
