import {
  ADD_NEW_PRODUCT,
  GET_ALL_PRODUCTS,
  NEED_UPDATE_PRODUCT,
  REPAIR_PRODUCT,
} from '../types/productsTypes';

export const getAllProducts = () => {
  return {
    type: GET_ALL_PRODUCTS,
  };
};

export const addNewProduct = (product) => {
  delete product.id;
  return {
    type: ADD_NEW_PRODUCT,
    payload: product,
  };
};

export const updateProduct = () => {
  return {
    type: NEED_UPDATE_PRODUCT,
  };
};

// export const updateProduct = (product) => {
//   delete product.id;

//   return {
//     type: NEED_UPDATE_PRODUCT,
//     payload: product,
//   };
// };

export const repProduct = (repProduct) => {
  return {
    type: REPAIR_PRODUCT,
    payload: repProduct,
  };
};
