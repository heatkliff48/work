import {
  LIST_OF_ORDERED_PRODUCTION,
  NEW_ORDERED_PRODUCTION,
} from '../types/warehouseTypes';

export const listOfOrderedProductionReducer = (
  listOfOrderedProduction = [],
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case LIST_OF_ORDERED_PRODUCTION: {
      return payload;
    }

    case NEW_ORDERED_PRODUCTION: {
      return payload;
    }

    default:
      return listOfOrderedProduction;
  }
};
