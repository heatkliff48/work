import { FULL_FILES_LOTES_LIST } from '../types/filesLotesListTypes';
import {
  NEED_DELETE_FILES_LOTES_LIST_SOCKET,
  NEW_FILES_LOTES_LIST_SOCKET,
} from '../types/socketTypes/socket';

export const filesLotesListReducer = (filesLotesList = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_FILES_LOTES_LIST: {
      return payload;
    }
    case NEW_FILES_LOTES_LIST_SOCKET: {
      return [...filesLotesList, payload];
    }
    case NEED_DELETE_FILES_LOTES_LIST_SOCKET: {
      const result = filesLotesList.filter((el) => el.id !== payload);
      return result;
    }

    default:
      return filesLotesList;
  }
};
