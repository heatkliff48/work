import { ALL_CLIENTS, NEW_CLIENTS } from '../types/clientsTypes';

export const clientsReducer = (clients = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case ALL_CLIENTS: {
      return payload;
    }
    case NEW_CLIENTS: {
      return [...clients, payload];
    }
    default:
      return clients;
  }
};
