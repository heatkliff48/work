import {
  NEED_UPDATE_CLIENT_SOCKET,
  NEED_UPDATE_CONTACT_INFO_SOCKET,
  NEED_UPDATE_DELIVERY_ADDRESSES_SOCKET,
  NEW_CLIENT_SOCKET,
  NEW_CONTACT_INFO_SOCKET,
  NEW_DELIVERY_ADDRESSES_SOCKET,
  ONE_LEGAL_ADDRESS_SOCKET,
  UPD_CONTACT_PRICE_INFO_SOCKET,
} from "#components/redux/types/socketTypes/socket.js";

export const addNewClientSocket = (client) => {
  return {
    type: NEW_CLIENT_SOCKET,
    payload: client,
  };
};

export const updateClientSocket = (client) => {
  return {
    type: NEED_UPDATE_CLIENT_SOCKET,
    payload: client,
  };
};

export const addNewLegalAddressSocket = (legalAddress) => {
  return {
    type: ONE_LEGAL_ADDRESS_SOCKET,
    payload: legalAddress,
  };
};

export const updateLegalAddressSocket = (legalAddress) => {
  return {
    type: ONE_LEGAL_ADDRESS_SOCKET,
    payload: legalAddress,
  };
};

export const addNewContactInfoSocket = (contactInfo) => {
  return {
    type: NEW_CONTACT_INFO_SOCKET,
    payload: contactInfo,
  };
};

export const updateContactInfoSocket = (contactInfo) => {
  return {
    type: NEED_UPDATE_CONTACT_INFO_SOCKET,
    payload: contactInfo,
  };
};

export const updContactPriceInfoSocket = (updClient) => {
  return {
    type: UPD_CONTACT_PRICE_INFO_SOCKET,
    payload: updClient,
  };
};

export const addNewDeliveryAddressSocket = (deliveryAddress) => {
  return {
    type: NEW_DELIVERY_ADDRESSES_SOCKET,
    payload: deliveryAddress,
  };
};

export const updateDeliveryAddressSocket = (deliveryAddress) => {
  return {
    type: NEED_UPDATE_DELIVERY_ADDRESSES_SOCKET,
    payload: deliveryAddress,
  };
};
