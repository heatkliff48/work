import {
  NEW_LIST_OF_ORDERED_PRODUCTION_SOCKET,
  UPDATE_AUTOCLAVE_CALENDAR_SOCKET,
  UPDATE_LIST_OF_ORDERED_PRODUCTION_SOCKET,
} from '../types/socketTypes/socket';
import {
  AUTOCLAVE_CALENDAR,
  LIST_OF_ORDERED_PRODUCTION,
  NEW_AUTOCLAVE_CALENDAR,
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

    case NEW_LIST_OF_ORDERED_PRODUCTION_SOCKET:
      {
        return [...listOfOrderedProduction, payload];
      }

    case UPDATE_LIST_OF_ORDERED_PRODUCTION_SOCKET: {
      const { id, quantity_in_warehouse } = payload;
      const result = listOfOrderedProduction.map((el) => {
        if (el.id === id) {
          return { ...el, quantity_in_warehouse };
        }

        return el;
      });
      return result;
    }

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

    case UPDATE_AUTOCLAVE_CALENDAR_SOCKET: {
      return value;
    }

    default:
      return autoclave_calendar;
  }
};
