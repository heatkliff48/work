import {
  NEW_LIST_OF_ORDERED_PRODUCTION_OEM_SOCKET,
  UPDATE_LIST_OF_ORDERED_PRODUCTION_OEM_SOCKET,
} from '../types/socketTypes/socket';
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

    case NEW_ORDERED_PRODUCTION_OEM:
    case NEW_LIST_OF_ORDERED_PRODUCTION_OEM_SOCKET: {
      return [...listOfOrderedProductionOEM, payload];
    }

    case UPDATE_LIST_OF_ORDERED_PRODUCTION_OEM_SOCKET: {
      const { id, status } = payload;
      const result = listOfOrderedProductionOEM.map((el) => {
        if (el.id === id) {
          return { ...el, status };
        }

        return el;
      });
      return result;
    }

    default:
      return listOfOrderedProductionOEM;
  }
};
