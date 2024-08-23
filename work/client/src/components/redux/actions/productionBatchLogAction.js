import {
  ADD_NEW_PRODUCTION_BATCH_LOG,
  GET_ALL_PRODUCTION_BATCH_LOGS,
  NEED_UPDATE_PRODUCTION_BATCH_LOG,
} from '../types/productionBatchLogTypes';

export const getAllProductionBatchLogs = () => {
  return {
    type: GET_ALL_PRODUCTION_BATCH_LOGS,
  };
};

export const addNewProductionBatchLog = ({ productionBatchLog }) => {
  return {
    type: ADD_NEW_PRODUCTION_BATCH_LOG,
    payload: { productionBatchLog },
  };
};

export const updateProductionBatchLog = ({ productionBatchLog }) => {
  return {
    type: NEED_UPDATE_PRODUCTION_BATCH_LOG,
    payload: { productionBatchLog },
  };
};
