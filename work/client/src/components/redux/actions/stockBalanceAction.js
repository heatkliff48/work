import {
  ADD_NEW_STOCK_BALANCE,
  GET_ALL_STOCK_BALANCE,
} from '../types/StockBalanceTypes';

export const getAllStockBalance = () => {
  return {
    type: GET_ALL_STOCK_BALANCE,
  };
};

export const addNewStockBalance = (stock) => {
  return {
    type: ADD_NEW_STOCK_BALANCE,
    payload: stock,
  };
};
