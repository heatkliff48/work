import {
  ADD_CLIENT_PRODUCT_PRICE,
  UPDATE_CLIENT_PRODUCT_PRICE,
  DELETE_CLIENT_PRODUCT_PRICE,
  GET_CLIENT_PRODUCT_PRICES,
} from '../types/clientProductPricesTypes';

export const getClientProductPrices = () => ({
  type: GET_CLIENT_PRODUCT_PRICES,
});

export const addClientProductPrice = (row) => ({
  type: ADD_CLIENT_PRODUCT_PRICE,
  payload: row,
});

export const updateClientProductPrice = ({ id, price }) => ({
  type: UPDATE_CLIENT_PRODUCT_PRICE,
  payload: { id, price },
});

export const deleteClientProductPrice = (id) => ({
  type: DELETE_CLIENT_PRODUCT_PRICE,
  payload: id,
});
