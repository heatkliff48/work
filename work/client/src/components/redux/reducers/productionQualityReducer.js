import {
  ALL_COMPRESSIONS_QUALITY,
  ALL_DIMENSIONS_QUALITY,
  ALL_PRODUCTION_QUALITY,
} from '../types/productionQualityTypes';
import {
  NEW_COMPRESSIONS_QUALITY_SOCKET,
  NEW_DIMENSIONS_QUALITY_SOCKET,
  NEW_PRODUCTION_QUALITY_SOCKET,
  UPD_COMPRESSIONS_QUALITY_SOCKET,
  UPD_DIMENSIONS_QUALITY_SOCKET,
  UPDATE_PRODUCTION_QUALITY_SOCKET,
} from '../types/socketTypes/socket';

//PRODUCTION QUALITY
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

//DIMENSION QUALITY
export const dimensionsQualityReducer = (qualityDimensions = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case ALL_DIMENSIONS_QUALITY: {
      return payload;
    }
    case NEW_DIMENSIONS_QUALITY_SOCKET: {
      const result = [...qualityDimensions];
      payload.forEach((el) => result.push(el));

      return result;
    }
    case UPD_DIMENSIONS_QUALITY_SOCKET: {
      const updateQualityCompressions = qualityDimensions.map((el) => {
        const { batch_id, sub_lote_id } = el;
        for (const updData of payload) {
          if (updData.batch_id == batch_id && updData.sub_lote_id == sub_lote_id) {
            return updData;
          }
        }
        return el;
      });

      return updateQualityCompressions;
    }

    default:
      return qualityDimensions;
  }
};

//COMPRESSIONS QUALITY
export const compressionsQualityReducer = (qualityCompressions = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case ALL_COMPRESSIONS_QUALITY: {
      return payload;
    }
    case NEW_COMPRESSIONS_QUALITY_SOCKET: {
      const result = [...qualityCompressions];
      payload.forEach((el) => result.push(el));

      return result;
    }
    case UPD_COMPRESSIONS_QUALITY_SOCKET: {
      const updateQualityCompressions = qualityCompressions.map((el) => {
        const { batch_id, sub_lote_id, dimension_id } = el;
        for (const updData of payload) {
          if (
            updData.batch_id == batch_id &&
            updData.sub_lote_id == sub_lote_id &&
            dimension_id == updData.dimension_id
          ) {
            return updData;
          }
        }
        return el;
      });

      return updateQualityCompressions;
    }

    default:
      return qualityCompressions;
  }
};
