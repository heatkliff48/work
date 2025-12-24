import {
  ADD_NEW_CLIENT,
  GET_ALL_CLIENTS,
  NEED_UPDATE_CLIENT,
  ADD_CLIENTS_LEGAL_ADDRESS,
  GET_CLIENTS_LEGAL_ADDRESS,
  NEED_UPDATE_LEGAL_ADDRESS,
  GET_ALL_DELIVERY_ADDRESSES,
  ADD_DELIVERY_ADDRESSES,
  GET_ALL_CONTACT_INFO,
  ADD_CONTACT_INFO,
  GET_CLIENT_PRICE_INFO,
  NEED_UPDATE_CLIENT_PRICE_INFO,
  NEED_UPDATE_DELIVERY_ADDRESSES,
  NEED_UPDATE_CONTACT_INFO,
} from "../types/clientsTypes";

export const getAllClients = () => {
  return {
    type: GET_ALL_CLIENTS,
  };
};

export const addNewClient = ({ client }) => {
  return {
    type: ADD_NEW_CLIENT,
    payload: { client },
  };
};

export const updateClient = ({ client }) => {
  return {
    type: NEED_UPDATE_CLIENT,
    payload: { client },
  };
};

export const getLegalAddress = (currentClientID) => {
  return {
    type: GET_CLIENTS_LEGAL_ADDRESS,
    payload: currentClientID,
  };
};
export const addNewLegalAddress = ({ legalAddress }) => {
  return {
    type: ADD_CLIENTS_LEGAL_ADDRESS,
    payload: { legalAddress },
  };
};

export const updateLegalAddress = ({ legalAddress }) => {
  //delete client.id;

  return {
    type: NEED_UPDATE_LEGAL_ADDRESS,
    payload: { legalAddress },
  };
};

export const getAllDeliveryAddresses = () => {
  return {
    type: GET_ALL_DELIVERY_ADDRESSES,
  };
};

export const addNewDeliveryAddress = ({ deliveryAddress }) => {
  return {
    type: ADD_DELIVERY_ADDRESSES,
    payload: { deliveryAddress },
  };
};

export const updateDeliveryAddress = ({ deliveryAddress }) => {
  return {
    type: NEED_UPDATE_DELIVERY_ADDRESSES,
    payload: { deliveryAddress },
  };
};

export const getAllContactInfo = () => {
  return {
    type: GET_ALL_CONTACT_INFO,
  };
};

// OLD VERSION

// export const getAllContactInfo = (currentClientID) => {
//   return {
//     type: GET_ALL_CONTACT_INFO,
//     payload: currentClientID,
//   };
// };

export const addNewContactInfo = ({ contactInfo }) => {
  return {
    type: ADD_CONTACT_INFO,
    payload: { contactInfo },
  };
};

export const updateContactInfo = ({ contactInfo }) => {
  return {
    type: NEED_UPDATE_CONTACT_INFO,
    payload: { contactInfo },
  };
};

export const getClientPriceInfo = () => {
  return {
    type: GET_CLIENT_PRICE_INFO,
  };
};

export const updClientPriceInfo = (cpi) => {
  return {
    type: NEED_UPDATE_CLIENT_PRICE_INFO,
    payload: cpi,
  };
};
