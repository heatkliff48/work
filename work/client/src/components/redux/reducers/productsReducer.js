import { ALL_PRODUCTS } from "../types/productsTypes";

export const productsReducer = (products = null, action) => {
  const { type, payload } = action;
  switch (type) {
    case ALL_PRODUCTS: {
      return payload;
    }
    default:
      return products;
  }
};
