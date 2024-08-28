import {
  LIST_OF_ORDERED_PRODUCTION,
  NEW_ORDERED_PRODUCTION,
} from '../types/warehouseTypes';

export const ListOfOrderedProductionReducer = (
  ListOfOrderedProduction = [],
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case LIST_OF_ORDERED_PRODUCTION: {
      return payload;
    }

    case NEW_ORDERED_PRODUCTION: {
      console.log('NEW_ORDERED_PRODUCTION', payload);
      return payload;
    }

    // case DELETE_PRODUCT_FROM_RESERVED_LIST: {
    //   const newReservedProducts = ListOfOrderedProduction.filter((el) => el.id !== payload);

    //   return newReservedProducts;
    // }

    default:
      return ListOfOrderedProduction;
  }
};
