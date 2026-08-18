import {
  ADD_NEW_RESERVED_PRODUCT,
  ADD_NEW_WAREHOUSE,
  GET_DELETE_PRODUCT_FROM_RESERVED_LIST,
  GET_ALL_WAREHOUSE,
  GET_LIST_OF_RESERVED_PRODUCTS,
  UPDATE_REMAINING_STOCK,
  GET_LIST_OF_ORDERED_PRODUCTION,
  ADD_NEW_ORDERED_PRODUCTION,
  GET_LIST_OF_ORDERED_PRODUCTION_OEM,
  ADD_NEW_ORDERED_PRODUCTION_OEM,
  UPDATE_ORDERED_PRODUCTION_OEM,
  UPDATE_ORDERED_PRODUCTION,
  UPDATE_RESERVED_PRODUCT,
  UPDATE_WAREHOSE_QUANTITYS,
  GET_LIST_OF_DRY_MIXED_RESERVED_PRODUCTS,
  ADD_NEW_DRY_MIXED_RESERVED_PRODUCT,
  UPDATE_DRY_MIXED_RESERVED_PRODUCT,
  GET_DELETE_PRODUCT_FROM_DRY_MIXED_RESERVED_LIST,
  GET_LIST_OF_ANCHOR_RESERVED_PRODUCTS,
  ADD_NEW_ANCHOR_RESERVED_PRODUCT,
  UPDATE_ANCHOR_RESERVED_PRODUCT,
  GET_DELETE_PRODUCT_FROM_ANCHOR_RESERVED_LIST,
  GET_LIST_OF_TOOL_RESERVED_PRODUCTS,
  ADD_NEW_TOOL_RESERVED_PRODUCT,
  UPDATE_TOOL_RESERVED_PRODUCT,
  GET_DELETE_PRODUCT_FROM_TOOL_RESERVED_LIST,
  GET_LIST_OF_REL_MAT_PRODUCTS,
  ADD_NEW_REL_MAT_RESERVED_PRODUCT,
  UPDATE_REL_MAT_PRODUCT,
  GET_DELETE_PRODUCT_FROM_REL_MAT_LIST,
  UPDATE_DRY_MIXED_WAREHOSE_QUANTITYS,
  UPDATE_ANCHOR_WAREHOSE_QUANTITYS,
  UPDATE_TOOL_WAREHOSE_QUANTITYS,
  UPDATE_REL_MAT_WAREHOSE_QUANTITYS,
  GET_AUTOCLAVE_CALENDAR,
  ADD_NEW_AUTOCLAVE_CALENDAR,
  GET_RAW_MATERIALS_WAREHOUSE,
  UPDATE_NEW_RAW_MATERIALS_WAREHOUSE,
  UPDATE_NEW_RAW_MATERIALS_CONSUMPTION_RAW_MATERIALS_WAREHOUSE,
  GET_ALL_WAREHOUSE_MANAGER_TRAILER,
  ADD_NEW_WAREHOUSE_MANAGER_TRAILER,
  DELETE_WAREHOUSE_MANAGER_TRAILER,
  CHANGE_STATUS_WAREHOUSE_MANAGER_TRAILER,
} from '../types/warehouseTypes';

export const getAllWarehouse = () => {
  return {
    type: GET_ALL_WAREHOUSE,
  };
};

export const addNewWarehouse = (warehouse) => {
  return {
    type: ADD_NEW_WAREHOUSE,
    payload: warehouse,
  };
};

export const updateRemainingStock = (upd_rem_srock) => {
  return {
    type: UPDATE_REMAINING_STOCK,
    payload: upd_rem_srock,
  };
};

export const updateWarehouseQuantitys = (upd_rem_srock) => {
  return {
    type: UPDATE_WAREHOSE_QUANTITYS,
    payload: upd_rem_srock,
  };
};

export const updateDryMixedWarehouseQuantitys = (upd_rem_srock) => {
  return {
    type: UPDATE_DRY_MIXED_WAREHOSE_QUANTITYS,
    payload: upd_rem_srock,
  };
};

export const updateAnchorWarehouseQuantitys = (upd_rem_srock) => {
  return {
    type: UPDATE_ANCHOR_WAREHOSE_QUANTITYS,
    payload: upd_rem_srock,
  };
};

export const updateToolWarehouseQuantitys = (upd_rem_srock) => {
  return {
    type: UPDATE_TOOL_WAREHOSE_QUANTITYS,
    payload: upd_rem_srock,
  };
};

export const updateRelMatWarehouseQuantitys = (upd_rem_srock) => {
  return {
    type: UPDATE_REL_MAT_WAREHOSE_QUANTITYS,
    payload: upd_rem_srock,
  };
};

export const getListOfReservedProducts = () => {
  return {
    type: GET_LIST_OF_RESERVED_PRODUCTS,
  };
};

export const addNewReservedProducts = (reserved_product) => {
  return {
    type: ADD_NEW_RESERVED_PRODUCT,
    payload: reserved_product,
  };
};

export const updReservedProducts = (reserved_product) => {
  return {
    type: UPDATE_RESERVED_PRODUCT,
    payload: reserved_product,
  };
};

export const deleteReservedProducts = (id) => {
  return {
    type: GET_DELETE_PRODUCT_FROM_RESERVED_LIST,
    payload: id,
  };
};

export const getListOfDryMixedReservedProducts = () => {
  return {
    type: GET_LIST_OF_DRY_MIXED_RESERVED_PRODUCTS,
  };
};

export const addNewDryMixedReservedProducts = (reserved_product) => {
  return {
    type: ADD_NEW_DRY_MIXED_RESERVED_PRODUCT,
    payload: reserved_product,
  };
};

export const updDryMixedReservedProducts = (reserved_product) => {
  return {
    type: UPDATE_DRY_MIXED_RESERVED_PRODUCT,
    payload: reserved_product,
  };
};

export const deleteDryMixedReservedProducts = (id) => {
  return {
    type: GET_DELETE_PRODUCT_FROM_DRY_MIXED_RESERVED_LIST,
    payload: id,
  };
};

export const getListOfAnchorReservedProducts = () => {
  return {
    type: GET_LIST_OF_ANCHOR_RESERVED_PRODUCTS,
  };
};

export const addNewAnchorReservedProducts = (reserved_product) => {
  return {
    type: ADD_NEW_ANCHOR_RESERVED_PRODUCT,
    payload: reserved_product,
  };
};

export const updAnchorReservedProducts = (reserved_product) => {
  return {
    type: UPDATE_ANCHOR_RESERVED_PRODUCT,
    payload: reserved_product,
  };
};

export const deleteAnchorReservedProducts = (id) => {
  return {
    type: GET_DELETE_PRODUCT_FROM_ANCHOR_RESERVED_LIST,
    payload: id,
  };
};

export const getListOfToolReservedProducts = () => {
  return {
    type: GET_LIST_OF_TOOL_RESERVED_PRODUCTS,
  };
};

export const addNewToolReservedProducts = (reserved_product) => {
  return {
    type: ADD_NEW_TOOL_RESERVED_PRODUCT,
    payload: reserved_product,
  };
};

export const updToolReservedProducts = (reserved_product) => {
  return {
    type: UPDATE_TOOL_RESERVED_PRODUCT,
    payload: reserved_product,
  };
};

export const deleteToolReservedProducts = (id) => {
  return {
    type: GET_DELETE_PRODUCT_FROM_TOOL_RESERVED_LIST,
    payload: id,
  };
};

export const getListOfRelMatReservedProducts = () => {
  return {
    type: GET_LIST_OF_REL_MAT_PRODUCTS,
  };
};

export const addNewRelMatReservedProducts = (reserved_product) => {
  return {
    type: ADD_NEW_REL_MAT_RESERVED_PRODUCT,
    payload: reserved_product,
  };
};

export const updRelMatReservedProducts = (reserved_product) => {
  return {
    type: UPDATE_REL_MAT_PRODUCT,
    payload: reserved_product,
  };
};

export const deleteRelMatReservedProducts = (id) => {
  return {
    type: GET_DELETE_PRODUCT_FROM_REL_MAT_LIST,
    payload: id,
  };
};

export const getAutoclaveCalendar = () => {
  return {
    type: GET_AUTOCLAVE_CALENDAR,
  };
};

export const addNewAutoclaveCalendar = (autoclave_calendar_data) => {
  return {
    type: ADD_NEW_AUTOCLAVE_CALENDAR,
    payload: autoclave_calendar_data,
  };
};

export const getListOfOrderedProduction = () => {
  return {
    type: GET_LIST_OF_ORDERED_PRODUCTION,
  };
};

export const getListOfOrderedProductionOEM = () => {
  return {
    type: GET_LIST_OF_ORDERED_PRODUCTION_OEM,
  };
};

export const addNewListOfOrderedProduction = (ordered_production) => {
  return {
    type: ADD_NEW_ORDERED_PRODUCTION,
    payload: ordered_production,
  };
};

export const updListOfOrderedProduction = (ordered_production) => {
  return {
    type: UPDATE_ORDERED_PRODUCTION,
    payload: ordered_production,
  };
};

export const addNewListOfOrderedProductionOEM = (ordered_production_oem) => {
  return {
    type: ADD_NEW_ORDERED_PRODUCTION_OEM,
    payload: ordered_production_oem,
  };
};

export const updListOfOrderedProductionOEM = (ordered_production_oem) => {
  return {
    type: UPDATE_ORDERED_PRODUCTION_OEM,
    payload: ordered_production_oem,
  };
};

export const getRawMaterialsWarehouse = () => {
  return {
    type: GET_RAW_MATERIALS_WAREHOUSE,
  };
};

export const updateRawMaterialsWarehouse = (rawMaterialsWarehouse) => {
  return {
    type: UPDATE_NEW_RAW_MATERIALS_WAREHOUSE,
    payload: rawMaterialsWarehouse,
  };
};

export const updateRawMaterialConsumptionRawMaterialsWarehouse = (
  rawMaterialsWarehouse,
  requestId = null,
) => {
  return {
    type: UPDATE_NEW_RAW_MATERIALS_CONSUMPTION_RAW_MATERIALS_WAREHOUSE,
    payload: rawMaterialsWarehouse,
    ...(requestId ? { meta: { requestId } } : {}),
  };
};

const pendingRawMaterialConsumptionRequests = new Map();
let rawMaterialConsumptionRequestSequence = 0;

export const createRawMaterialConsumptionRequest = (rawMaterialsWarehouse) => {
  rawMaterialConsumptionRequestSequence += 1;

  const requestId =
    `raw-material-consumption-${Date.now()}-` +
    rawMaterialConsumptionRequestSequence;

  let resolveRequest;
  let rejectRequest;

  const promise = new Promise((resolve, reject) => {
    resolveRequest = resolve;
    rejectRequest = reject;
  });

  pendingRawMaterialConsumptionRequests.set(requestId, {
    resolve: resolveRequest,
    reject: rejectRequest,
  });

  return {
    action: updateRawMaterialConsumptionRawMaterialsWarehouse(
      rawMaterialsWarehouse,
      requestId,
    ),
    promise,
  };
};

export const resolveRawMaterialConsumptionRequest = (requestId, result) => {
  const pendingRequest = pendingRawMaterialConsumptionRequests.get(requestId);
  if (!pendingRequest) return;

  pendingRawMaterialConsumptionRequests.delete(requestId);
  pendingRequest.resolve(result);
};

export const rejectRawMaterialConsumptionRequest = (requestId, error) => {
  const pendingRequest = pendingRawMaterialConsumptionRequests.get(requestId);
  if (!pendingRequest) return;

  pendingRawMaterialConsumptionRequests.delete(requestId);
  pendingRequest.reject(error);
};

//WAREHOUSE MANAGER TRAILER
export const getWarehouseManagerTrailer = () => {
  return {
    type: GET_ALL_WAREHOUSE_MANAGER_TRAILER,
  };
};

export const addNewWarehouseManagerTrailer = (new_wh_trailer) => {
  return {
    type: ADD_NEW_WAREHOUSE_MANAGER_TRAILER,
    payload: new_wh_trailer,
  };
};

export const changeStatusWarehouseManagerTrailer = (new_status_trailer) => {
  return {
    type: CHANGE_STATUS_WAREHOUSE_MANAGER_TRAILER,
    payload: new_status_trailer,
  };
};

export const deleteWarehouseManagerTrailer = (wh_trailer_id) => {
  return {
    type: DELETE_WAREHOUSE_MANAGER_TRAILER,
    payload: wh_trailer_id,
  };
};
