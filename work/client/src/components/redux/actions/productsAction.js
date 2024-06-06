import { ADD_NEW_PRODUCT, GET_ALL_PRODUCTS } from '../types/productsTypes';

export const getAllProducts = (user) => {
  return {
    type: GET_ALL_PRODUCTS,
    payload: user,
  };
};
export const addNewProduct = ({ product, user }) => {
  return {
    type: ADD_NEW_PRODUCT,
    payload: { product, user },
  };
};
