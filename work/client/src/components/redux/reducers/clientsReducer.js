import { ALL_CLIENTS, NEW_CLIENTS, UPDATE_CLIENT,
  ONE_LEGAL_ADDRESS, NEW_LEGAL_ADDRESS, UPDATE_LEGAL_ADDRESS,
  ALL_DELIVERY_ADDRESSES, NEW_DELIVERY_ADDRESSES,
  ALL_CONTACT_INFO, NEW_CONTACT_INFO
 } from '../types/clientsTypes';

export const clientsReducer = (clients = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case ALL_CLIENTS: {
      return payload;
    }
    case NEW_CLIENTS: {
      return [...clients, payload];
    }
    case UPDATE_CLIENT: {
      return [...clients, payload];
    }
    default:
      return clients;
  }
};

export const legalAddressReducer = (legalAddress = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case ONE_LEGAL_ADDRESS: {
      return payload;
    }
    // case NEW_LEGAL_ADDRESS: {
    //   console.log('LEGAL ADDRESS REDUCER', payload)
    //   return [...legalAddress, payload];
    // }
    // case UPDATE_LEGAL_ADDRESS: {
    //   return [...legalAddress, payload];
    // }
    default:
      return legalAddress;
  }
};

export const deliveryAddressesReducer = (deliveryAddresses = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case ALL_DELIVERY_ADDRESSES: {
      return payload;
    }
    case NEW_DELIVERY_ADDRESSES: {
      return [...deliveryAddresses, payload];
    }
    default:
      return deliveryAddresses;
  }
};

export const contactInfoReducer = (contactInfo = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case ALL_CONTACT_INFO: {
      return payload;
    }
    case NEW_CONTACT_INFO: {
      return [...contactInfo, payload];
    }
    default:
      return contactInfo;
  }
};