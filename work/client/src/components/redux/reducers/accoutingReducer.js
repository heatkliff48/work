import {
  ADD_ACCOUTING_DATA_LIST,
  DELETE_ACCOUTING_DATA_LIST,
  CLEAR_ACCOUTING_DATA_LIST,
} from '../types/ordersTypes';
import { ACCOUNTING_APPROVED_SOCKET } from '../types/socketTypes/socket';

export const accountingReducer = (accountingDataList = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case CLEAR_ACCOUTING_DATA_LIST: {
      return [];
    }
    case ADD_ACCOUTING_DATA_LIST: {
      return [...accountingDataList, payload];
    }

    case ACCOUNTING_APPROVED_SOCKET: {
      const { article, accounting_approved } = payload;
      return accountingDataList.map((el) =>
        el.orders_article === article
          ? { ...el, aproved: accounting_approved }
          : el
      );
    }

    case DELETE_ACCOUTING_DATA_LIST: {
      return accountingDataList.filter((el) => el.orders_article !== payload);
    }

    default:
      return accountingDataList;
  }
};
