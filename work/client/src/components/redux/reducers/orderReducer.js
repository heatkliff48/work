import {
  DELETE_ORDER,
  NEW_ORDER,
  ORDERS_LIST,
  NEW_CONTACT_OF_ORDER,
  NEW_DELIVERY_OF_ORDER,
} from '../types/ordersTypes';

export const ordersReducer = (orders = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case ORDERS_LIST: {
      return payload;
    }
    case NEW_ORDER: {
      return [...orders, payload];
    }
    case DELETE_ORDER: {
      const result = orders.filter((el) => el.id !== payload);
      return result;
    }
    case NEW_CONTACT_OF_ORDER: {
      return payload;
    }
    case NEW_DELIVERY_OF_ORDER: {
      return payload;
    }
    default:
      return orders;
  }
};
