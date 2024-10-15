import {
  DELETE_PRODUCT_OF_ORDER,
  CURRENT_PRODUCTS_OF_ORDER,
  UPDATE_PRODUCT_INFO_OF_ORDER,
  UPDATE_PRODUCTS_OF_ORDER,
  PRODUCTS_OF_ORDER,
} from '../types/ordersTypes';
import {
  DELETE_PRODUCT_OF_ORDER_SOCKET,
  UPDATE_PRODUCT_OF_ORDER_REDUCER_SOCKET,
} from '../types/socketTypes/socket';

export const productsOfOrdersReducer = (productsOfOrders = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case CURRENT_PRODUCTS_OF_ORDER: {
      return payload;
    }

    case PRODUCTS_OF_ORDER: {
      return payload;
    }

    case UPDATE_PRODUCT_OF_ORDER_REDUCER_SOCKET: {
      return [...productsOfOrders, payload];
    }

    case UPDATE_PRODUCT_INFO_OF_ORDER: {
      const result = productsOfOrders.map((el) => {
        if (el.id === payload.id) {
          return { ...payload };
        }

        return el;
      });

      return result;
    }

    case DELETE_PRODUCT_OF_ORDER_SOCKET: {
      const result = productsOfOrders.filter((el) => el.id !== payload);
      return result;
    }

    default:
      return productsOfOrders;
  }
};
