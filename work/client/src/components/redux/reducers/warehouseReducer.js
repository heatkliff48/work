import {
  NEED_UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET,
  NEW_WAREHOUSE_SOCKET,
  REMAINING_STOCK_SOCKET,
} from '../types/socketTypes/socket';
import {
  ALL_WAREHOUSE,
  RAW_MATERIALS_WAREHOUSE,
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

    case REMAINING_STOCK: {
      return payload;
    }

    case WAREHOSE_QUANTITYS: {
      return payload;
    }

    case REMAINING_STOCK_SOCKET: {
      return payload;
    }

    default:
      return warehouse;
  }
};

export const rawMaterialsWarehouseReducer = (rawMaterialsWarehouse = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case RAW_MATERIALS_WAREHOUSE: {
      return payload;
    }

    case NEED_UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET: {
      const result = rawMaterialsWarehouse.map((el) => {
        if (el.id === payload.id) return payload;
        return el;
      });
      return result;
    }

    default:
      return rawMaterialsWarehouse;
  }
};
