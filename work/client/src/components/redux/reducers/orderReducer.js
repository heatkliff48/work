import { NEW_ORDER, ORDERS_LIST } from '../types/ordersTypes';

export const ordersReducer = (orders = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case ORDERS_LIST: {
      return payload;
    }
    case NEW_ORDER: {

      return [...orders, payload];
    }
    default:
      return orders;
  }
};
