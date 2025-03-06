import {
  ADD_ACCOUTING_DATA_LIST,
  DELETE_ACCOUTING_DATA_LIST,
  UPD_ACCOUTING_DATA_LIST,
  CLEAR_ACCOUTING_DATA_LIST,
} from '../types/ordersTypes';

export const accountingReducer = (accountingDataList = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case CLEAR_ACCOUTING_DATA_LIST: {
      return [];
    }
    case ADD_ACCOUTING_DATA_LIST: {
      return [...accountingDataList, payload];
    }

    case UPD_ACCOUTING_DATA_LIST: {
      const { orders_article, aproved } = payload;
      return accountingDataList.map((el) => {
        if (el.orders_article === orders_article) {
          return { ...el, aproved };
        }
        return el;
      });
    }

    case DELETE_ACCOUTING_DATA_LIST: {
      return accountingDataList.filter((el) => el.orders_article !== payload);
    }

    default:
      return accountingDataList;
  }
};
