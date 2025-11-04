import { FULL_LOTES_LIST } from "../types/lotesListTypes";
import { NEW_LOTES_LIST_SOCKET } from "../types/socketTypes/socket";

export const lotesListReducer = (lotesList = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_LOTES_LIST: {
      return payload;
    }
    case NEW_LOTES_LIST_SOCKET: {
      return [...lotesList, payload];
    }
    default:
      return lotesList;
  }
};
