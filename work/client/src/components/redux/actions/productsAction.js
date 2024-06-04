import { ADD_NEW_PRODUCT, GET_ALL_PRODUCTS, NEW_PRODUCT } from '../types/productsTypes';

export const getAllProducts = () => {
  return {
    type: GET_ALL_PRODUCTS,
  };
};
export const addNewProduct = (product) => {
  return {
    type: NEW_PRODUCT,
    payload: product,
  };
};
