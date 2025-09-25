import {
  AUTOCLAVE_CALENDAR,
  LIST_OF_ORDERED_PRODUCTION,
  UPDATE_LIST_OF_ORDERED_PRODUCTION,
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

    case UPDATE_LIST_OF_ORDERED_PRODUCTION: {
      const result = listOfOrderedProduction.map((el) => {
        if (el.id === payload.id) {
          return payload;
        }

        return el;
      });
      return result;
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

  const value = Array.isArray(payload) ? payload : [];

  switch (type) {
    case AUTOCLAVE_CALENDAR: {
      return value;
    }

    case NEW_AUTOCLAVE_CALENDAR: {
      return value;
    }

    default:
      return autoclave_calendar;
  }
};
