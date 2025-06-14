import {
  ADD_DATA_SHIP_ORDER,
  ADD_NEW_ORDER,
  GET_DELETE_ORDER,
  GET_DELETE_PRODUCT_OF_ORDER,
  GET_ORDERS_LIST,
  GET_CURRENT_PRODUCTS_OF_ORDER,
  GET_UPDATE_PRODUCT_INFO_OF_ORDER,
  GET_UPDATE_PRODUCTS_OF_ORDER,
  UPDATE_CONTACT_OF_ORDER,
  UPDATE_DELIVERY_OF_ORDER,
  UPDATE_STATUS_OF_ORDER,
  GET_PRODUCTS_OF_ORDER,
  UPDATE_PERSON_IN_CHARGE_OF_ORDER,
  UPD_ACCOUTING_DATA_LIST,
  ADD_ACCOUTING_DATA_LIST,
  DELETE_ACCOUTING_DATA_LIST,
  CLEAR_ACCOUTING_DATA_LIST,
  GET_DRY_MIXED_PRODUCTS_OF_ORDER,
  GET_ANCHOR_PRODUCTS_OF_ORDER,
  GET_TOOL_PRODUCTS_OF_ORDER,
  GET_UPDATE_TOOL_PRODUCTS_OF_ORDER,
  GET_UPDATE_DRY_MIXED_PRODUCTS_OF_ORDER,
  GET_UPDATE_ANCHOR_PRODUCTS_OF_ORDER,
  GET_DELETE_DRY_MIXED_OF_ORDER,
  GET_DELETE_ANCHOR_OF_ORDER,
  GET_DELETE_TOOL_OF_ORDER,
  ADD_ORDER_DESCRIPTION,
  ADD_SECONDARY_CONTACT,
  GET_REL_MAT_PRODUCTS_OF_ORDER,
  GET_UPDATE_REL_MAT_PRODUCTS_OF_ORDER,
  GET_DELETE_REL_MAT_OF_ORDER,
  DELETE_SECONDARY_CONTACT,
} from '../types/ordersTypes';

export const getOrders = () => {
  return {
    type: GET_ORDERS_LIST,
  };
};

export const addNewOrder = (order) => {
  return {
    type: ADD_NEW_ORDER,
    payload: order,
  };
};

export const addDataShipOrder = (date) => {
  return {
    type: ADD_DATA_SHIP_ORDER,
    payload: date,
  };
};

export const addDescription = (desc) => {
  return {
    type: ADD_ORDER_DESCRIPTION,
    payload: desc,
  };
};

export const addSecondaryContact = (sec_cnt) => {
  return {
    type: ADD_SECONDARY_CONTACT,
    payload: sec_cnt,
  };
};

export const delSecondaryContact = (sec_cnt) => {
  return {
    type: DELETE_SECONDARY_CONTACT,
    payload: sec_cnt,
  };
};

export const getProductsOfOrders = () => {
  return {
    type: GET_PRODUCTS_OF_ORDER,
  };
};

export const getCurrentProductsOfOrders = (order_id) => {
  return {
    type: GET_CURRENT_PRODUCTS_OF_ORDER,
    payload: order_id,
  };
};

export const getUpdateProductOfOrders = (newProductsOfOrder) => {
  return {
    type: GET_UPDATE_PRODUCTS_OF_ORDER,
    payload: newProductsOfOrder,
  };
};

export const getUpdateProductInfoOfOrders = (productOfOrder) => {
  return {
    type: GET_UPDATE_PRODUCT_INFO_OF_ORDER,
    payload: productOfOrder,
  };
};

export const getDeleteProductOfOrder = (product_id) => {
  return {
    type: GET_DELETE_PRODUCT_OF_ORDER,
    payload: product_id,
  };
};

export const getDryMixedProductsOfOrders = () => {
  return {
    type: GET_DRY_MIXED_PRODUCTS_OF_ORDER,
  };
};

export const getUpdateDryMixedProductOfOrders = (newDryMixedProductsOfOrder) => {
  return {
    type: GET_UPDATE_DRY_MIXED_PRODUCTS_OF_ORDER,
    payload: newDryMixedProductsOfOrder,
  };
};

export const getDeleteDryMixedProductOfOrder = (product_id) => {
  return {
    type: GET_DELETE_DRY_MIXED_OF_ORDER,
    payload: product_id,
  };
};

export const getAnchorProductsOfOrders = () => {
  return {
    type: GET_ANCHOR_PRODUCTS_OF_ORDER,
  };
};

export const getUpdateAnchorProductOfOrders = (newAnchorProductsOfOrder) => {
  return {
    type: GET_UPDATE_ANCHOR_PRODUCTS_OF_ORDER,
    payload: newAnchorProductsOfOrder,
  };
};

export const getDeleteAnchorProductOfOrder = (product_id) => {
  return {
    type: GET_DELETE_ANCHOR_OF_ORDER,
    payload: product_id,
  };
};

export const getToolProductsOfOrders = () => {
  return {
    type: GET_TOOL_PRODUCTS_OF_ORDER,
  };
};

export const getUpdateToolProductOfOrders = (newToolProductsOfOrder) => {
  return {
    type: GET_UPDATE_TOOL_PRODUCTS_OF_ORDER,
    payload: newToolProductsOfOrder,
  };
};

export const getDeleteToolProductOfOrder = (product_id) => {
  return {
    type: GET_DELETE_TOOL_OF_ORDER,
    payload: product_id,
  };
};

export const getRelMatProductsOfOrders = () => {
  return {
    type: GET_REL_MAT_PRODUCTS_OF_ORDER,
  };
};

export const getUpdateRelMatProductOfOrders = (newRelMatProductsOfOrder) => {
  return {
    type: GET_UPDATE_REL_MAT_PRODUCTS_OF_ORDER,
    payload: newRelMatProductsOfOrder,
  };
};

export const getDeleteRelMatProductOfOrder = (product_id) => {
  return {
    type: GET_DELETE_REL_MAT_OF_ORDER,
    payload: product_id,
  };
};

export const deleteOrder = (order_id) => {
  return {
    type: GET_DELETE_ORDER,
    payload: order_id,
  };
};

export const updateContactOfOrder = (newContactOfOrder) => {
  return {
    type: UPDATE_CONTACT_OF_ORDER,
    payload: newContactOfOrder,
  };
};

export const updateDeliveryOfOrder = (newDeliveryOfOrder) => {
  return {
    type: UPDATE_DELIVERY_OF_ORDER,
    payload: newDeliveryOfOrder,
  };
};

export const updateOrderStatus = (orderStatus) => {
  return {
    type: UPDATE_STATUS_OF_ORDER,
    payload: orderStatus,
  };
};

export const updateOrderInCharge = (orderInCharge) => {
  return {
    type: UPDATE_PERSON_IN_CHARGE_OF_ORDER,
    payload: orderInCharge,
  };
};

export const clearAccountingDataList = () => {
  return {
    type: CLEAR_ACCOUTING_DATA_LIST,
  };
};

export const addAccountingDataList = (accountingDataList) => {
  return {
    type: ADD_ACCOUTING_DATA_LIST,
    payload: accountingDataList,
  };
};

export const updAccountingDataList = (article) => {
  return {
    type: UPD_ACCOUTING_DATA_LIST,
    payload: article,
  };
};

export const deleteAccountingData = (article) => {
  return {
    type: DELETE_ACCOUTING_DATA_LIST,
    payload: article,
  };
};
