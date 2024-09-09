import {
  NEW_PRODUCT_SOCKET,
  UPD_PRODUCT_SOCKET,
} from '#components/redux/types/socketTypes/socket.js';

export const addNewProductSocket = (products) => {
  return {
    type: NEW_PRODUCT_SOCKET,
    payload: products,
  };
};

export const updateProductSocket = (products) => {
  return {
    type: UPD_PRODUCT_SOCKET,
    payload: products,
  };
};
