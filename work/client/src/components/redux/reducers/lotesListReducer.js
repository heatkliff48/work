import { FULL_LOTES_LIST, FULL_LOTES_LIST_CAKES } from '../types/lotesListTypes';
import {
  NEW_LOTES_LIST_CAKES_SOCKET,
  NEW_LOTES_LIST_SOCKET,
  UPD_LOTES_LIST_CAKES_SOCKET,
  UPD_LOTES_LIST_SOCKET,
} from '../types/socketTypes/socket';

export const lotesListBatchesReducer = (lotesListBatches = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_LOTES_LIST: {
      return payload;
    }

    case NEW_LOTES_LIST_SOCKET: {
      return [...lotesListBatches, payload];
    }

    case UPD_LOTES_LIST_SOCKET: {
      console.log('UPD_LOTES_LIST_SOCKET payload', payload);
      const { id } = payload;
      const updatedLotesList = lotesListBatches.map((el) => {
        if (el.id === id) return payload;
        return el;
      });
      return updatedLotesList;
    }

    default:
      return lotesListBatches;
  }
};

export const lotesListCakesReducer = (lotesListCakes = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_LOTES_LIST_CAKES: {
      console.log('payload', payload);
      return payload;
    }

    case NEW_LOTES_LIST_CAKES_SOCKET: {
      return [...lotesListCakes, ...payload];
    }

    case UPD_LOTES_LIST_CAKES_SOCKET: {
      console.log('UPD_LOTES_LIST_CAKES_SOCKET payload', payload);
      const { id } = payload;
      const updatedLotesList = lotesListCakes.map((el) => {
        if (el.id === id) return payload;
        return el;
      });
      return updatedLotesList;
    }

    default:
      return lotesListCakes;
  }
};
