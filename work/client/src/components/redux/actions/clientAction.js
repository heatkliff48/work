import { ADD_NEW_CLIENTS, GET_ALL_CLIENTS } from '../types/clientsTypes';

export const getAllClients = () => {
  return {
    type: GET_ALL_CLIENTS,
  };
};
export const addClient = ({ client }) => {
  return {
    type: ADD_NEW_CLIENTS,
    payload: { client },
  };
};
