import { GET_ALL_PRODUCTS } from '../types/productsTypes';

export const getAllProducts = (user) => {
  return {
    type: GET_ALL_PRODUCTS,
    payload: user,
  };
};
