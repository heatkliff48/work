import { FULL_QUALITY_MANAGEMENT_DATA } from '../types/qualityManagementTypes';
import {
  NEED_DELETE_QUALITY_MANAGEMENT_DATA_SOCKET,
  NEED_UPDATE_QUALITY_MANAGEMENT_DATA_SOCKET,
  NEW_QUALITY_MANAGEMENT_DATA_SOCKET,
} from '../types/socketTypes/socket';

export const qualityManagementReducer = (qualityManagementData = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_QUALITY_MANAGEMENT_DATA: {
      const result = payload;
      return result;
    }
    case NEW_QUALITY_MANAGEMENT_DATA_SOCKET: {
      return [...qualityManagementData, payload];
    }
    case NEED_DELETE_QUALITY_MANAGEMENT_DATA_SOCKET: {
      const result = qualityManagementData.filter((el) => el.id !== payload);
      return result;
    }
    case NEED_UPDATE_QUALITY_MANAGEMENT_DATA_SOCKET: {
      const result = qualityManagementData.map((el) => {
        if (el.id === payload[1].id) return payload[1];
        return el;
      });

      return result;
    }
    default:
      return qualityManagementData;
  }
};
