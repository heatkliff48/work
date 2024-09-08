import { ADD_NEW_PRODUCT_SOCKET } from '#components/redux/types/constants/socket.js';

export const addNewProductSocket = (products) => {
  return {
    type: ADD_NEW_PRODUCT_SOCKET,
    payload: products,
  };
};
