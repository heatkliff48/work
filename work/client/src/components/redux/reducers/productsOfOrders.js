import { PRODUCTS_OF_ORDER } from '../types/ordersTypes';

export const productsOfOrdersReducer = (productsOfOrders = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case PRODUCTS_OF_ORDER: {
      return payload;
    }
    default:
      return productsOfOrders;
  }
};
