import { ADD_NEW_PRODUCT, GET_ALL_PRODUCTS } from '../types/productsTypes';

export const getAllProducts = () => {
  return {
    type: GET_ALL_PRODUCTS,
  };
};
export const addNewProduct = (data) => {
  return {
    type: ADD_NEW_PRODUCT,
    payload: data,
  };
};
