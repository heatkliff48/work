import { FULL_LOTES_LIST, FULL_LOTES_LIST_CAKES } from '../types/lotesListTypes';
import {
  DELETE_LAST_LOTES_LIST_CAKES_SOCKET,
  NEW_LOTES_LIST_CAKES_SOCKET,
  NEW_LOTES_LIST_SOCKET,
  UPD_LOTES_LIST_CAKES_BOOLEAN_SOCKET,
  UPD_LOTES_LIST_CAKES_SOCKET,
  UPD_LOTES_LIST_NOTE_SOCKET,
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
      return payload;
    }

    case NEW_LOTES_LIST_CAKES_SOCKET: {
      return [...lotesListCakes, ...payload];
    }

    case DELETE_LAST_LOTES_LIST_CAKES_SOCKET: {
      return payload;
    }

    case UPD_LOTES_LIST_CAKES_BOOLEAN_SOCKET:
    case UPD_LOTES_LIST_CAKES_SOCKET: {
      const updates = Array.isArray(payload) ? payload : [payload];

      const updatesById = new Map(
        updates.filter((x) => x && x.id != null).map((x) => [x.id, x]),
      );

      const result = lotesListCakes.map((el) => updatesById.get(el.id) ?? el);

      return result;
    }

    case UPD_LOTES_LIST_NOTE_SOCKET: {
      const { id, note } = payload;
      const updatedLotesList = lotesListCakes.map((el) => {
        if (el.id === id) return { ...el, note };
        return el;
      });
      return updatedLotesList;
    }

    default:
      return lotesListCakes;
  }
};
