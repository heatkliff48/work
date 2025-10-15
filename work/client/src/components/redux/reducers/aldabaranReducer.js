import { ALL_ALDABARAN } from '../types/aldabaranTypes';
import { NEW_ALDABARAN_SOCKET } from '../types/socketTypes/socket';

export const aldabaranReducer = (aldabaran = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case ALL_ALDABARAN: {
      return payload;
    }

    case NEW_ALDABARAN_SOCKET: {
      return [...aldabaran, payload];
    }

    default:
      return aldabaran;
  }
};
