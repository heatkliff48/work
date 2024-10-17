import {
  ALL_CLIENTS,
  NEW_CLIENTS,
  UPDATE_CLIENT,
  ONE_LEGAL_ADDRESS,
  NEW_LEGAL_ADDRESS,
  UPDATE_LEGAL_ADDRESS,
  ALL_DELIVERY_ADDRESSES,
  NEW_DELIVERY_ADDRESSES,
  ALL_CONTACT_INFO,
  NEW_CONTACT_INFO,
} from '../types/clientsTypes';
import {
  NEED_UPDATE_CLIENT_SOCKET,
  NEW_CLIENT_SOCKET,
  NEW_CONTACT_INFO_SOCKET,
  NEW_DELIVERY_ADDRESSES_SOCKET,
  ONE_LEGAL_ADDRESS_SOCKET,
} from '../types/socketTypes/socket';

export const clientsReducer = (clients = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case ALL_CLIENTS: {
      return payload;
    }
    case NEW_CLIENT_SOCKET: {
      return [...clients, payload];
    }
    case NEED_UPDATE_CLIENT_SOCKET: {
      const updateClient = clients.map((el) => {
        if (el.id === payload[1].id) return payload[1];
        return el;
      });
      return updateClient;
      // return [...clients, payload];
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
    case ONE_LEGAL_ADDRESS_SOCKET: {
      return payload;
    }

    // case NEW_LEGAL_ADDRESS: {
    //   return [...legalAddress, payload];
    // }
    // case UPDATE_LEGAL_ADDRESS: {
    //   const updateLegalAddress = legalAddress.map((el) => {
    //     if (el.id === payload.id) return payload;
    //     return el;
    //   });
    //   return updateLegalAddress;
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
    case NEW_DELIVERY_ADDRESSES_SOCKET: {
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
    case NEW_CONTACT_INFO_SOCKET: {
      return [...contactInfo, payload];
    }
    default:
      return contactInfo;
  }
};
