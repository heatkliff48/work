import {
  ADD_NEW_PRODUCT,
  GET_ALL_PRODUCTS,
  NEED_UPDATE_PRODUCT,
} from '../types/productsTypes';

export const getAllProducts = () => {
  return {
    type: GET_ALL_PRODUCTS,
  };
};

export const addNewProduct = ({ product }) => {
  let newArticle = `T.${product.form?.toUpperCase()}${product.certificate?.substr(
    0,
    1
  )}${product.density}${product.width}${product.height}${product.lengths}`; // T.NORMALC500200600250  без версии

  product.article = newArticle;
  delete product.id;

  return {
    type: ADD_NEW_PRODUCT,
    payload: { product },
  };
};

export const updateProduct = ({ product }) => {
  delete product.id;

  return {
    type: NEED_UPDATE_PRODUCT,
    payload: { product },
  };
};
