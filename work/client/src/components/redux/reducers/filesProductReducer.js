import { FULL_FILES_PRODUCT } from '../types/filesProductTypes';
import {
  NEED_DELETE_FILES_PRODUCT_SOCKET,
  NEW_FILES_PRODUCT_SOCKET,
} from '../types/socketTypes/socket';

export const filesProductReducer = (filesProduct = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_FILES_PRODUCT: {
      return payload;
    }
    case NEW_FILES_PRODUCT_SOCKET: {
      return [...filesProduct, payload];
    }
    case NEED_DELETE_FILES_PRODUCT_SOCKET: {
      const result = filesProduct.filter((el) => el.id !== payload);
      return result;
    }

    default:
      return filesProduct;
  }
};
