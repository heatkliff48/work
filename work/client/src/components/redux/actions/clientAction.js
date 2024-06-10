import { ADD_NEW_CLIENTS, GET_ALL_CLIENTS } from '../types/clientsTypes';

export const getAllClients = (user) => {
  return {
    type: GET_ALL_CLIENTS,
    payload: user,
  };
};
export const addClient = ({ client, user }) => {
  return {
    type: ADD_NEW_CLIENTS,
    payload: { client, user },
  };
};
