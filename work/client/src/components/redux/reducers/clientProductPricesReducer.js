import { ALL_CLIENT_PRODUCT_PRICES } from '../types/clientProductPricesTypes';
import {
  ADD_CLIENT_PRODUCT_PRICE_SOCKET,
  UPDATE_CLIENT_PRODUCT_PRICE_SOCKET,
  DELETE_CLIENT_PRODUCT_PRICE_SOCKET,
} from '../types/socketTypes/socket';

export const clientProductPricesReducer = (rows = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case ALL_CLIENT_PRODUCT_PRICES:
      return Array.isArray(payload) ? payload : [];
    case ADD_CLIENT_PRODUCT_PRICE_SOCKET: {
      if (!payload?.id) return rows;
      if (rows.some((row) => row.id === payload.id)) {
        return rows.map((row) => (row.id === payload.id ? payload : row));
      }
      return [...rows, payload];
    }
    case UPDATE_CLIENT_PRODUCT_PRICE_SOCKET: {
      if (!payload?.id) return rows;
      return rows.map((row) => (row.id === payload.id ? { ...row, ...payload } : row));
    }
    case DELETE_CLIENT_PRODUCT_PRICE_SOCKET:
      return rows.filter((row) => row.id !== payload && row.id !== Number(payload));
    default:
      return rows;
  }
};
