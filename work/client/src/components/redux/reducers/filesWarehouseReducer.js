import { FULL_FILES_WAREHOUSE } from '../types/filesWarehouseTypes';
import {
  NEED_DELETE_FILES_WAREHOUSE_SOCKET,
  NEW_FILES_WAREHOUSE_SOCKET,
} from '../types/socketTypes/socket';

export const filesWarehouseReducer = (filesWarehouse = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_FILES_WAREHOUSE: {
      return payload;
    }
    case NEW_FILES_WAREHOUSE_SOCKET: {
      return [...filesWarehouse, payload];
    }
    case NEED_DELETE_FILES_WAREHOUSE_SOCKET: {
      const result = filesWarehouse.filter((el) => el.id !== payload);
      return result;
    }

    default:
      return filesWarehouse;
  }
};
