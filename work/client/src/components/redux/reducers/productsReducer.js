import { ALL_PRODUCTS, NEW_PRODUCT } from '../types/productsTypes';

export const productsReducer = (products = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case ALL_PRODUCTS: {
      console.log('PRODUCTREDUCER', payload);
      return payload;
    }
    case NEW_PRODUCT: {
      return [...products, payload];
    }
    default:
      return products;
  }
};
