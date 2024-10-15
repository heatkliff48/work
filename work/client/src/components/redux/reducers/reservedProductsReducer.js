import { DELETE_PRODUCT_FROM_RESERVED_LIST_SOCKET } from '../types/socketTypes/socket';
import {
  LIST_OF_RESERVED_PRODUCTS,
  NEW_RESERVED_PRODUCT,
} from '../types/warehouseTypes';

export const reservedProductsReducer = (reservedProducts = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case LIST_OF_RESERVED_PRODUCTS: {
      return payload;
    }

    case NEW_RESERVED_PRODUCT: {
      return payload;
    }

    case DELETE_PRODUCT_FROM_RESERVED_LIST_SOCKET: {
      const newReservedProducts = reservedProducts.filter(
        (el) => el.id !== payload.id
      );

      return newReservedProducts;
    }

    default:
      return reservedProducts;
  }
};
