import {
  addDatashipOrderSocket,
  addNewFilesOrderSocket,
  addNewFilesProductSocket,
  addNewFilesWarehouseSocket,
  addNewOrderSocket,
  addNewProductSocket,
  addNewRecipeSocket,
  addNewStockBalanceSocket,
  addNewWarehouseSocket,
  deeleteProductOfOrderSocket,
  deleteFilesOrderSocket,
  deleteFilesProductSocket,
  deleteFilesWarehouseSocket,
  deleteMaterialPlanSocket,
  deleteRecipeSocket,
  deleteReservedProductSocket,
  saveMaterialPlanSocket,
  updateProductSocket,
  updateRemainingStockSocket,
  updateRolesActiveSocket,
  updateRolesSocket,
  updInChargeOrderSocket,
  updProductOfOrderSocket,
  updStatusOfOrderSocket,
} from '#components/redux/actions/socketActions/socketAction.js';

import {
  addNewClientSocket,
  updateClientSocket,
  addNewLegalAddressSocket,
  updateLegalAddressSocket,
  addNewDeliveryAddressSocket,
  addNewContactInfoSocket,
} from '#components/redux/actions/socketActions/clientsActionSocket.js';
import {
  addNewBatchOutsideSocket,
  deleteBatchOutsideSocket,
  updateBatchOutsideSocket,
} from '#components/redux/actions/socketActions/batchOutsideActionSocket.js';
import {
  ADD_CLIENTS_LEGAL_ADDRESS_SOCKET,
  ADD_CONTACT_INFO_SOCKET,
  ADD_DATASHIP_ORDER_SOCKET,
  ADD_DELIVERY_ADDRESSES_SOCKET,
  ADD_NEW_BATCH_OUTSIDE_SOCKET,
  ADD_NEW_CLIENT_SOCKET,
  ADD_NEW_ORDER_SOCKET,
  ADD_NEW_PRODUCT_SOCKET,
  UPDATE_BATCH_OUTSIDE_SOCKET,
  UPDATE_CLIENT_SOCKET,
  UPDATE_LEGAL_ADDRESS_SOCKET,
  GET_DELETE_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_DELETE_PRODUCT_OF_ORDER_SOCKET,
  UPDATE_PRODUCT_OF_ORDER_SOCKET,
  UPDATE_PRODUCT_SOCKET,
  UPDATE_REMAINING_STOCK_SOCKET,
  UPDATE_ROLE_ACTIVE_SOCKET,
  UPDATE_ROLE_SOCKET,
  UPDATE_STATUS_OF_ORDER_SOCKET,
  ADD_NEW_WAREHOUSE_SOCKET,
  DELETE_BATCH_OUTSIDE_SOCKET,
  ADD_NEW_RECIPE_SOCKET,
  DELETE_RECIPE_SOCKET,
  ADD_NEW_FILES_WAREHOUSE_SOCKET,
  DELETE_FILES_WAREHOUSE_SOCKET,
  ADD_NEW_FILES_ORDER_SOCKET,
  DELETE_FILES_ORDER_SOCKET,
  SAVE_MATERIAL_PLAN_SOCKET,
  DELETE_MATERIAL_PLAN_SOCKET,
  ADD_NEW_FILES_PRODUCT_SOCKET,
  DELETE_FILES_PRODUCT_SOCKET,
  UPDATE_PERSON_IN_CHARGE_OF_ORDER_SOCKET,
  ADD_NEW_STOCK_BALANCE_SOCKET,
} from '#components/redux/types/socketTypes/socket.js';

export const createSocketOnMessage = (dispatch) => (event) => {
  const parsedData = JSON.parse(event.data);
  const { type, payload } = parsedData;
  console.log('createSocketOnMessage, parsedData', parsedData);

  switch (type) {
    case ADD_NEW_PRODUCT_SOCKET:
      dispatch(addNewProductSocket(payload));
      break;

    case UPDATE_PRODUCT_SOCKET:
      dispatch(updateProductSocket(payload));
      break;

    case UPDATE_ROLE_SOCKET:
      dispatch(updateRolesSocket(payload));
      break;

    case UPDATE_ROLE_ACTIVE_SOCKET:
      dispatch(updateRolesActiveSocket(payload));
      break;

    case ADD_NEW_ORDER_SOCKET:
      dispatch(addNewOrderSocket(payload));
      break;

    case UPDATE_PRODUCT_OF_ORDER_SOCKET:
      dispatch(updProductOfOrderSocket(payload));
      break;

    case GET_DELETE_PRODUCT_OF_ORDER_SOCKET:
      dispatch(deeleteProductOfOrderSocket(payload));
      break;

    case ADD_DATASHIP_ORDER_SOCKET:
      dispatch(addDatashipOrderSocket(payload));
      break;

    case UPDATE_STATUS_OF_ORDER_SOCKET:
      dispatch(updStatusOfOrderSocket(payload));
      break;

    case UPDATE_PERSON_IN_CHARGE_OF_ORDER_SOCKET:
      dispatch(updInChargeOrderSocket(payload));
      break;

    case ADD_NEW_WAREHOUSE_SOCKET:
      dispatch(addNewWarehouseSocket(payload));
      break;

    case ADD_NEW_CLIENT_SOCKET:
      dispatch(addNewClientSocket(payload));
      break;

    case UPDATE_CLIENT_SOCKET:
      dispatch(updateClientSocket(payload));
      break;

    case ADD_CLIENTS_LEGAL_ADDRESS_SOCKET:
      dispatch(addNewLegalAddressSocket(payload));
      break;

    case UPDATE_LEGAL_ADDRESS_SOCKET:
      dispatch(updateLegalAddressSocket(payload));
      break;

    case ADD_CONTACT_INFO_SOCKET:
      dispatch(addNewContactInfoSocket(payload));
      break;

    case ADD_DELIVERY_ADDRESSES_SOCKET:
      dispatch(addNewDeliveryAddressSocket(payload));
      break;

    case ADD_NEW_BATCH_OUTSIDE_SOCKET:
      dispatch(addNewBatchOutsideSocket(payload));
      break;

    case UPDATE_BATCH_OUTSIDE_SOCKET:
      dispatch(updateBatchOutsideSocket(payload));
      break;

    case DELETE_BATCH_OUTSIDE_SOCKET:
      dispatch(deleteBatchOutsideSocket(payload));
      break;

    case GET_DELETE_PRODUCT_FROM_RESERVED_LIST_SOCKET:
      dispatch(deleteReservedProductSocket(payload));
      break;

    case UPDATE_REMAINING_STOCK_SOCKET:
      dispatch(updateRemainingStockSocket(payload));
      break;

    case ADD_NEW_RECIPE_SOCKET:
      dispatch(addNewRecipeSocket(payload));
      break;

    case DELETE_RECIPE_SOCKET:
      dispatch(deleteRecipeSocket(payload));
      break;

    case ADD_NEW_FILES_WAREHOUSE_SOCKET:
      dispatch(addNewFilesWarehouseSocket(payload));
      break;

    case DELETE_FILES_WAREHOUSE_SOCKET:
      dispatch(deleteFilesWarehouseSocket(payload));
      break;

    case ADD_NEW_FILES_ORDER_SOCKET:
      dispatch(addNewFilesOrderSocket(payload));
      break;

    case DELETE_FILES_ORDER_SOCKET:
      dispatch(deleteFilesOrderSocket(payload));
      break;

    case ADD_NEW_FILES_PRODUCT_SOCKET:
      dispatch(addNewFilesProductSocket(payload));
      break;

    case DELETE_FILES_PRODUCT_SOCKET:
      dispatch(deleteFilesProductSocket(payload));
      break;

    case SAVE_MATERIAL_PLAN_SOCKET:
      dispatch(saveMaterialPlanSocket(payload));
      break;

    case DELETE_MATERIAL_PLAN_SOCKET:
      dispatch(deleteMaterialPlanSocket(payload));
      break;

    case ADD_NEW_STOCK_BALANCE_SOCKET:
      dispatch(addNewStockBalanceSocket(payload));
      break;

    default:
      break;
  }
};
