import {
  ADD_NEW_PRODUCT,
  GET_ALL_PRODUCTS,
  NEED_UPDATE_PRODUCT,
} from '../types/productsTypes';

export const getAllProducts = (user) => {
  return {
    type: GET_ALL_PRODUCTS,
    payload: user,
  };
};

export const addNewProduct = ({ product, user }) => {
  let newArticle = `T.${product.form?.toUpperCase()}${product.certificate?.substr(
    1,
    1
  )}${product.density}${product.width}${product.height}${product.lengths}`; // T.NORMALC500200600250  без версии

  product.article = newArticle;

  return {
    type: ADD_NEW_PRODUCT,
    payload: { product, user },
  };
};

export const updateProduct = ({ product, user }) => {
  let newArticle = `T.${product.form?.toUpperCase()}${product.certificate?.substr(
    1,
    1
  )}${product.density}${product.width}${product.height}${product.lengths}`; // T.NORMALC500200600250  без версии

  product.article = newArticle;
  delete product.id;

  return {
    type: NEED_UPDATE_PRODUCT,
    payload: { product, user },
  };
};
