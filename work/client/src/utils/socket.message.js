import {
  addDatashipOrderSocket,
  addNewDryMixesJournalSocket,
  addNewFilesOrderSocket,
  addNewFilesProductSocket,
  addNewFilesWarehouseSocket,
  addNewOrderSocket,
  addNewProductSocket,
  addNewRelatedMaterialsJournalSocket,
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
  updateDryMixesJournalSocket,
  updateProductSocket,
  repairProductSocket,
  updateRelatedMaterialsJournalSocket,
  updateRemainingStockSocket,
  updateRolesActiveSocket,
  updateRolesSocket,
  updInChargeOrderSocket,
  updProductOfOrderSocket,
  updStatusOfOrderSocket,
  addNewAnchorSocket,
  updateAnchorSocket,
  addNewToolSocket,
  updateToolSocket,
  updDryMixedProductOfOrderSocket,
  updAnchorProductOfOrderSocket,
  updToolProductOfOrderSocket,
  addNewQualityManagementSocket,
  updateQualityManagementSocket,
  deleteQualityManagementSocket,
  deleteDryMixedProductOfOrderSocket,
  deleteAnchorProductOfOrderSocket,
  deleteToolProductOfOrderSocket,
  addNewDryMixesWarehouseSocket,
  updateDryMixesWarehouseSocket,
  addNewRelatedMaterialsWarehouseSocket,
  updateRelatedMaterialsWarehouseSocket,
  addNewAnchorsWarehouseSocket,
  updateAnchorsWarehouseSocket,
  addNewToolsWarehouseSocket,
  updateToolsWarehouseSocket,
  addNewRelatedMaterialsBackorderSocket,
  updateRelatedMaterialsBackorderSocket,
  addDescOrderSocket,
  addSecondaryContactSocket,
  addNewAldabaranSocket,
  updRelMatProductOfOrderSocket,
  deleteSecondaryContactSocket,
  addNewDeliveryPriceSocket,
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
  ADD_DESCRIPTIOM_ORDER_SOCKET,
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
  ADD_NEW_DRY_MIXES_JOURNAL_SOCKET,
  ADD_NEW_RELATED_MATERIALS_JOURNAL_SOCKET,
  UPDATE_RELATED_MATERIALS_JOURNAL_SOCKET,
  UPDATE_DRY_MIXES_JOURNAL_SOCKET,
  ADD_NEW_ANCHOR_SOCKET,
  UPDATE_ANCHOR_SOCKET,
  ADD_NEW_TOOL_SOCKET,
  UPDATE_TOOL_SOCKET,
  UPDATE_DRY_MIXED_PRODUCT_OF_ORDER_SOCKET,
  UPDATE_ANCHOR_PRODUCT_OF_ORDER_SOCKET,
  UPDATE_TOOL_PRODUCT_OF_ORDER_SOCKET,
  ADD_NEW_QUALITY_MANAGEMENT_DATA_SOCKET,
  UPDATE_QUALITY_MANAGEMENT_DATA_SOCKET,
  DELETE_QUALITY_MANAGEMENT_DATA_SOCKET,
  GET_DELETE_TOOL_PRODUCT_OF_ORDER_SOCKET,
  GET_DELETE_DRY_MIXED_PRODUCT_OF_ORDER_SOCKET,
  GET_DELETE_ANCHOR_PRODUCT_OF_ORDER_SOCKET,
  REPAIR_PRODUCT_SOCKET,
  ADD_SECONDARY_CONTACT_ORDER_SOCKET,
  ADD_NEW_DRY_MIXES_WAREHOUSE_SOCKET,
  UPDATE_DRY_MIXES_WAREHOUSE_SOCKET,
  ADD_NEW_RELATED_MATERIALS_WAREHOUSE_SOCKET,
  UPDATE_RELATED_MATERIALS_WAREHOUSE_SOCKET,
  ADD_NEW_ANCHORS_WAREHOUSE_SOCKET,
  UPDATE_ANCHORS_WAREHOUSE_SOCKET,
  ADD_NEW_TOOLS_WAREHOUSE_SOCKET,
  UPDATE_TOOLS_WAREHOUSE_SOCKET,
  ADD_NEW_RELATED_MATERIALS_BACKORDER_SOCKET,
  UPDATE_RELATED_MATERIALS_BACKORDER_SOCKET,
  ADD_NEW_ALDABARAN_SOCKET,
  UPDATE_REL_MAT_PRODUCT_OF_ORDER_SOCKET,
  DELETE_SECONDARY_CONTACT_ORDER_SOCKET,
  ADD_NEW_DELIVERY_PRICE_SOCKET,
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

    case REPAIR_PRODUCT_SOCKET:
      dispatch(repairProductSocket(payload));
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

    case ADD_NEW_DELIVERY_PRICE_SOCKET:
      dispatch(addNewDeliveryPriceSocket(payload));
      break;

    case UPDATE_PRODUCT_OF_ORDER_SOCKET:
      dispatch(updProductOfOrderSocket(payload));
      break;

    case UPDATE_DRY_MIXED_PRODUCT_OF_ORDER_SOCKET:
      dispatch(updDryMixedProductOfOrderSocket(payload));
      break;

    case UPDATE_ANCHOR_PRODUCT_OF_ORDER_SOCKET:
      dispatch(updAnchorProductOfOrderSocket(payload));
      break;

    case UPDATE_TOOL_PRODUCT_OF_ORDER_SOCKET:
      dispatch(updToolProductOfOrderSocket(payload));
      break;

    case UPDATE_REL_MAT_PRODUCT_OF_ORDER_SOCKET:
      dispatch(updRelMatProductOfOrderSocket(payload));
      break;

    case GET_DELETE_PRODUCT_OF_ORDER_SOCKET:
      dispatch(deeleteProductOfOrderSocket(payload));
      break;

    case GET_DELETE_DRY_MIXED_PRODUCT_OF_ORDER_SOCKET:
      dispatch(deleteDryMixedProductOfOrderSocket(payload));
      break;

    case GET_DELETE_ANCHOR_PRODUCT_OF_ORDER_SOCKET:
      dispatch(deleteAnchorProductOfOrderSocket(payload));
      break;

    case GET_DELETE_TOOL_PRODUCT_OF_ORDER_SOCKET:
      dispatch(deleteToolProductOfOrderSocket(payload));
      break;

    case ADD_DATASHIP_ORDER_SOCKET:
      dispatch(addDatashipOrderSocket(payload));
      break;

    case ADD_DESCRIPTIOM_ORDER_SOCKET:
      dispatch(addDescOrderSocket(payload));
      break;

    case ADD_SECONDARY_CONTACT_ORDER_SOCKET:
      dispatch(addSecondaryContactSocket(payload));
      break;

    case DELETE_SECONDARY_CONTACT_ORDER_SOCKET:
      dispatch(deleteSecondaryContactSocket(payload));
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

    case ADD_NEW_DRY_MIXES_JOURNAL_SOCKET:
      dispatch(addNewDryMixesJournalSocket(payload));
      break;

    case UPDATE_DRY_MIXES_JOURNAL_SOCKET:
      dispatch(updateDryMixesJournalSocket(payload));
      break;

    case ADD_NEW_RELATED_MATERIALS_JOURNAL_SOCKET:
      dispatch(addNewRelatedMaterialsJournalSocket(payload));
      break;

    case UPDATE_RELATED_MATERIALS_JOURNAL_SOCKET:
      dispatch(updateRelatedMaterialsJournalSocket(payload));
      break;

    case ADD_NEW_ANCHOR_SOCKET:
      dispatch(addNewAnchorSocket(payload));
      break;

    case UPDATE_ANCHOR_SOCKET:
      dispatch(updateAnchorSocket(payload));
      break;

    case ADD_NEW_TOOL_SOCKET:
      dispatch(addNewToolSocket(payload));
      break;

    case UPDATE_TOOL_SOCKET:
      dispatch(updateToolSocket(payload));
      break;

    case ADD_NEW_DRY_MIXES_WAREHOUSE_SOCKET:
      dispatch(addNewDryMixesWarehouseSocket(payload));
      break;

    case UPDATE_DRY_MIXES_WAREHOUSE_SOCKET:
      dispatch(updateDryMixesWarehouseSocket(payload));
      break;

    case ADD_NEW_RELATED_MATERIALS_WAREHOUSE_SOCKET:
      dispatch(addNewRelatedMaterialsWarehouseSocket(payload));
      break;

    case UPDATE_RELATED_MATERIALS_WAREHOUSE_SOCKET:
      dispatch(updateRelatedMaterialsWarehouseSocket(payload));
      break;

    case ADD_NEW_ANCHORS_WAREHOUSE_SOCKET:
      dispatch(addNewAnchorsWarehouseSocket(payload));
      break;

    case UPDATE_ANCHORS_WAREHOUSE_SOCKET:
      dispatch(updateAnchorsWarehouseSocket(payload));
      break;

    case ADD_NEW_TOOLS_WAREHOUSE_SOCKET:
      dispatch(addNewToolsWarehouseSocket(payload));
      break;

    case UPDATE_TOOLS_WAREHOUSE_SOCKET:
      dispatch(updateToolsWarehouseSocket(payload));
      break;

    case ADD_NEW_QUALITY_MANAGEMENT_DATA_SOCKET:
      dispatch(addNewQualityManagementSocket(payload));
      break;

    case UPDATE_QUALITY_MANAGEMENT_DATA_SOCKET:
      dispatch(updateQualityManagementSocket(payload));
      break;

    case DELETE_QUALITY_MANAGEMENT_DATA_SOCKET:
      dispatch(deleteQualityManagementSocket(payload));
      break;

    case ADD_NEW_RELATED_MATERIALS_BACKORDER_SOCKET:
      dispatch(addNewRelatedMaterialsBackorderSocket(payload));
      break;

    case UPDATE_RELATED_MATERIALS_BACKORDER_SOCKET:
      dispatch(updateRelatedMaterialsBackorderSocket(payload));
      break;

    case ADD_NEW_ALDABARAN_SOCKET:
      dispatch(addNewAldabaranSocket(payload));
      break;

    default:
      break;
  }
};
