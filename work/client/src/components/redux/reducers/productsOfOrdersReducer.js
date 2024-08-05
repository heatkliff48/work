import {
  DELETE_PRODUCT_OF_ORDER,
  PRODUCTS_OF_ORDER,
  UPDATE_PRODUCTS_OF_ORDER,
} from '../types/ordersTypes';

export const productsOfOrdersReducer = (productsOfOrders = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case PRODUCTS_OF_ORDER: {
      return payload;
    }
    case UPDATE_PRODUCTS_OF_ORDER: {
      return [...productsOfOrders, payload.newProductsOfOrder.productList];
    }
    case DELETE_PRODUCT_OF_ORDER: {
      const result = productsOfOrders.filter((el) => el.id !== payload);
      return result;
    }
    default:
      return productsOfOrders;
  }
};
