import {
  AUTOCLAVE_CALENDAR,
  LIST_OF_ORDERED_PRODUCTION,
  NEW_AUTOCLAVE_CALENDAR,
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
      return [...listOfOrderedProduction, ...payload];
    }

    // case DELETE_PRODUCT_FROM_RESERVED_LIST: {
    //   const newReservedProducts = listOfOrderedProduction.filter((el) => el.id !== payload);

    //   return newReservedProducts;
    // }

    default:
      return listOfOrderedProduction;
  }
};

export const autoclaveCalendarReducer = (autoclave_calendar = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case AUTOCLAVE_CALENDAR: {
      return payload;
    }

    case NEW_AUTOCLAVE_CALENDAR: {
      return [...autoclave_calendar, ...payload];
    }

    // case DELETE_PRODUCT_FROM_RESERVED_LIST: {
    //   const newReservedProducts = listOfOrderedProduction.filter((el) => el.id !== payload);

    //   return newReservedProducts;
    // }

    default:
      return autoclave_calendar;
  }
};
