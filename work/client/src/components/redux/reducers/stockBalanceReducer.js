import { ALL_STOCK_BALANCE, NEW_STOCK_BALANCE } from '../types/StockBalanceTypes';
import { NEW_STOCK_BALANCE_SOCKET } from '../types/socketTypes/socket';

export const stockBalanceReducer = (stockBalance = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case ALL_STOCK_BALANCE: {
      return payload;
    }

    case NEW_STOCK_BALANCE: {
      if (stockBalance.find((order) => order.id === payload.id)) return stockBalance;
      return [...stockBalance, payload];
    }

    case NEW_STOCK_BALANCE_SOCKET: {
      if (stockBalance.find((order) => order.id === payload.id)) return stockBalance;

      return [...stockBalance, payload];
    }

    default:
      return stockBalance;
  }
};
