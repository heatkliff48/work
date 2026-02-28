import { ALL_PRODUCTION_QUALITY } from '../types/productionQualityTypes';
import {
  NEW_PRODUCTION_QUALITY_SOCKET,
  UPDATE_PRODUCTION_QUALITY_SOCKET,
} from '../types/socketTypes/socket';

export const productionQualityReducer = (productionQuality = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case ALL_PRODUCTION_QUALITY: {
      return payload;
    }
    case NEW_PRODUCTION_QUALITY_SOCKET: {
      return [...productionQuality, payload];
    }
    case UPDATE_PRODUCTION_QUALITY_SOCKET: {
      const updateProductionQuality = productionQuality.map((el) => {
        if (el.id === payload[1].id) return payload[1];
        return el;
      });

      return updateProductionQuality;
    }

    default:
      return productionQuality;
  }
};
