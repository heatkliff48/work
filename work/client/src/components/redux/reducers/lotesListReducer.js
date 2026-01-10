import { FULL_LOTES_LIST } from '../types/lotesListTypes';
import { NEW_LOTES_LIST_SOCKET, UPD_LOTES_LIST_SOCKET } from '../types/socketTypes/socket';

export const lotesListReducer = (lotesList = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_LOTES_LIST: {
      return payload;
    }

    case NEW_LOTES_LIST_SOCKET: {
      return [...lotesList, payload];
    }

    case UPD_LOTES_LIST_SOCKET: {
      console.log('UPD_LOTES_LIST_SOCKET payload', payload);
      const { id } = payload;
      const updatedLotesList = lotesList.map((el) => {
        if (el.id === id) return payload;
        return el;
      });
      return updatedLotesList;
    }

    default:
      return lotesList;
  }
};
