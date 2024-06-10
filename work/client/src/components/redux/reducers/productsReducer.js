import { ALL_PRODUCTS, NEW_PRODUCT, UPDATE_PRODUCT } from '../types/productsTypes';

export const productsReducer = (products = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case ALL_PRODUCTS: {
      const products = [];
      for (let i = 0; i < payload?.length; i++) {
        if (!payload[i].version) {
          products.push({ ...payload[i], version: 1 });
        } else {
          products.push(payload[i]);
        }
      }

      products.sort(function (a, b) {
        if (a.id > b.id) {
          return 1;
        }
        if (a.id < b.id) {
          return -1;
        }
        return 0;
      });

      return products;
    }
    case UPDATE_PRODUCT: {
      const updateProducts = products.map((el) => {
        if (el.id === payload.id) return payload;
        return el;
      });

      return updateProducts;
    }
    case NEW_PRODUCT: {
      return [...products, payload];
    }
    default:
      return products;
  }
};
