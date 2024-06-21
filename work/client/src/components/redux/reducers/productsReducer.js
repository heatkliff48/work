import { ALL_PRODUCTS, NEW_PRODUCT, UPDATE_PRODUCT } from '../types/productsTypes';

export const productsReducer = (products = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case ALL_PRODUCTS: {
      const productsArr = [];
      if (payload.length === 0) return [];

      for (let i = 0; i < payload.length; i++) {
        if (!payload[i]?.version) {
          productsArr.push({ ...payload[i], version: 1 });
        } else {
          productsArr.push(payload[i]);
        }
      }
      return productsArr;
    }
    case UPDATE_PRODUCT: {
      // const updateProducts = products.map((el) => {
      //   if (el.id === payload.id) return payload;
      //   return el;
      // });

      // return updateProducts;
      return [...products, payload];
    }
    case NEW_PRODUCT: {
      return [...products, payload];
    }
    default:
      return products;
  }
};
