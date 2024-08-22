import {
  ALL_PRODUCTION_BATCH_LOGS,
  NEW_PRODUCTION_BATCH_LOG,
  UPDATE_PRODUCTION_BATCH_LOG,
} from '../types/productionBatchLogTypes';

export const productionBatchLogReducer = (productionBatchLog = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case ALL_PRODUCTION_BATCH_LOGS: {
      return payload;
    }
    case NEW_PRODUCTION_BATCH_LOG: {
      console.log('productionBatchLog', productionBatchLog);
      return [...productionBatchLog, payload];
    }
    case UPDATE_PRODUCTION_BATCH_LOG: {
      const updateProductionBatchLog = productionBatchLog.map((el) => {
        if (el.id === payload[1].id) return payload[1];
        return el;
      });
      return updateProductionBatchLog;
    }
    default:
      return productionBatchLog;
  }
};
