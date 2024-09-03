import {
  LIST_OF_ORDERED_PRODUCTION_OEM,
  NEW_ORDERED_PRODUCTION_OEM,
} from '../types/warehouseTypes';

export const listOfOrderedProductionOEMReducer = (
  listOfOrderedProductionOEM = [],
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case LIST_OF_ORDERED_PRODUCTION_OEM: {
      return payload;
    }

    case NEW_ORDERED_PRODUCTION_OEM: {
      return payload;
    }

    // case DELETE_PRODUCT_FROM_RESERVED_LIST: {
    //   const newReservedProducts = listOfOrderedProduction.filter((el) => el.id !== payload);
    //   return newReservedProducts;
    // }

    default:
      return listOfOrderedProductionOEM;
  }
};
