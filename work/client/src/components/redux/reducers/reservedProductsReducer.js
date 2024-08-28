import {
  DELETE_PRODUCT_FROM_RESERVED_LIST,
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
      return [...reservedProducts, payload];
    }

    case DELETE_PRODUCT_FROM_RESERVED_LIST: {
      const newReservedProducts = reservedProducts.filter((el) => el.id !== payload);

      return newReservedProducts;
    }

    default:
      return reservedProducts;
  }
};
