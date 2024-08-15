import { ALL_WAREHOUSE, NEW_WAREHOUSE } from '../types/warehouseTypes';

export const warehouseReducer = (warehouse = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case ALL_WAREHOUSE: {
      return payload;
    }

    case NEW_WAREHOUSE: {
      return [...warehouse, payload];
    }
    default:
      return warehouse;
  }
};
