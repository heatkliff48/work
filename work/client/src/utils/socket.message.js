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
  addNewReservedProductSocket,
  updateReservedProductSocket,
  addNewDryMixedReservedProductSocket,
  updateDryMixedReservedProductSocket,
  deleteDryMixedReservedProductSocket,
  addNewAnchorReservedProductSocket,
  updateAnchorReservedProductSocket,
  deleteAnchorReservedProductSocket,
  addNewToolReservedProductSocket,
  updateToolReservedProductSocket,
  deleteToolReservedProductSocket,
  addNewRelMatReservedProductSocket,
  updateRelMatReservedProductSocket,
  deleteRelMatReservedProductSocket,
  deleteRelMatProductOfOrderSocket,
  updateProductCodeSocket,
  addOrderRandomProductsSocket,
  updateProductInfoOfOrderSocket,
  updateDryMixedProductInfoOfOrderSocket,
  updateAnchorProductInfoOfOrderSocket,
  updateToolProductInfoOfOrderSocket,
  updateRelMatProductInfoOfOrderSocket,
  updateContactOfOrderSocket,
  updateAdressOfOrderSocket,
  deleteOrderSocket,
  updateAutoclaveCalendarSocket,
  addNewListOfOrderedProductionSocket,
  updateListOfOrderedProductionSocket,
  addNewListOfOrderedProductionOEMSocket,
  updateListOfOrderedProductionOEMSocket,
  updateWarehouseQuantitysSocket,
  updateDryMixesQuantitysSocket,
  updateAnchorQuantitysSocket,
  updateToolQuantitysSocket,
  updateRelMatQuantitysSocket,
  addNewRawMatConsumptionSocket,
  deleteRawMatConsumptionSocket,
  updateRawMaterialsWarehouseSocket,
  addNewWarehouseSandSocket,
  updateWarehouseSandSocket,
  deleteWarehouseSandSocket,
  addNewWarehouseLimeSocket,
  updateWarehouseLimeSocket,
  deleteWarehouseLimeSocket,
  addNewWarehouseCementSocket,
  updateWarehouseCementSocket,
  deleteWarehouseCementSocket,
  addNewWarehouseGypsumSocket,
  updateWarehouseGypsumSocket,
  deleteWarehouseGypsumSocket,
  addNewWarehouseGypsumStoneSocket,
  updateWarehouseGypsumStoneSocket,
  deleteWarehouseGypsumStoneSocket,
  addNewWarehouseAluminum1Socket,
  updateWarehouseAluminum1Socket,
  deleteWarehouseAluminum1Socket,
  addNewWarehouseAluminum2Socket,
  updateWarehouseAluminum2Socket,
  deleteWarehouseAluminum2Socket,
  addNewWarehouseGrindingBallsSocket,
  updateWarehouseGrindingBallsSocket,
  deleteWarehouseGrindingBallsSocket,
  addNewWarehouseAACSocket,
  updateWarehouseAACSocket,
  deleteWarehouseAACSocket,
  addNewLotesListSocket,
  updateLotesListSocket,
  addNewLotesListCakesSocket,
  updateLotesListCakesSocket,
  updateLotesListCakesBooleanSocket,
  addNewFilesLotesListSocket,
  deleteFilesLotesListSocket,
  updateRecipeSocket,
  updateLotesListNoteSocket,
  deleteLotesListSocket,
  updateRawMatConsumptionSocket,
  addNewWarehouseSandSlurrySocket,
  addNewOrderToWarehouseSocket,
  updateOrderToWarehouseSocket,
  deleteOrderToWarehouseSocket,
} from '#components/redux/actions/socketActions/socketAction.js';

import {
  addNewClientSocket,
  updateClientSocket,
  addNewLegalAddressSocket,
  updateLegalAddressSocket,
  addNewDeliveryAddressSocket,
  addNewContactInfoSocket,
  updContactPriceInfoSocket,
  updateContactInfoSocket,
  updateDeliveryAddressSocket,
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
  GET_NEW_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  UPDATE_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  NEW_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  UPDATE_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  DELETE_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  NEW_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  UPDATE_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  DELETE_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  NEW_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  UPDATE_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  DELETE_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  NEW_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  UPDATE_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  DELETE_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_DELETE_REL_MAT_PRODUCT_OF_ORDER_SOCKET,
  UPDATE_PRODUCT_CODE_SOCKET,
  ADD_RANDOM_PRODUCTS_OF_ORDER_SOCKET,
  GET_UPDATE_PRODUCT_INFO_OF_ORDER_SOCKET,
  GET_UPDATE_DRY_MIXED_PRODUCT_INFO_OF_ORDER_SOCKET,
  GET_UPDATE_ANCHOR_PRODUCT_INFO_OF_ORDER_SOCKET,
  GET_UPDATE_TOOL_PRODUCT_INFO_OF_ORDER_SOCKET,
  GET_UPDATE_REL_MAT_PRODUCT_INFO_OF_ORDER_SOCKET,
  GET_UPDATE_CONTACT_OF_ORDER_SOCKET,
  GET_UPDATE_ADRESS_OF_ORDER_SOCKET,
  GET_DELETE_ORDER_SOCKET,
  GET_UPDATE_AUTOCLAVE_CALENDAR_SOCKET,
  ADD_NEW_LIST_OF_ORDERED_PRODUCTION_SOCKET,
  GET_UPDATE_LIST_OF_ORDERED_PRODUCTION_SOCKET,
  ADD_NEW_LIST_OF_ORDERED_PRODUCTION_OEM_SOCKET,
  GET_UPDATE_LIST_OF_ORDERED_PRODUCTION_OEM_SOCKET,
  UPDATE_WAREHOUSE_QUANTITYS_SOCKET,
  UPDATE_DRY_MIXES_QUANTITYS_SOCKET,
  UPDATE_ANCHOR_QUANTITYS_SOCKET,
  UPDATE_TOOL_QUANTITYS_SOCKET,
  UPDATE_REL_MAT_QUANTITYS_SOCKET,
  ADD_NEW_RAW_MAT_CONSUMPTION_SOCKET,
  UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET,
  ADD_NEW_WAREHOUSE_SAND_SOCKET,
  UPDATE_WAREHOUSE_SAND_SOCKET,
  DELETE_WAREHOUSE_SAND_SOCKET,
  ADD_NEW_WAREHOUSE_LIME_SOCKET,
  UPDATE_WAREHOUSE_LIME_SOCKET,
  DELETE_WAREHOUSE_LIME_SOCKET,
  ADD_NEW_WAREHOUSE_CEMENT_SOCKET,
  UPDATE_WAREHOUSE_CEMENT_SOCKET,
  DELETE_WAREHOUSE_CEMENT_SOCKET,
  ADD_NEW_WAREHOUSE_GYPSUM_SOCKET,
  UPDATE_WAREHOUSE_GYPSUM_SOCKET,
  DELETE_WAREHOUSE_GYPSUM_SOCKET,
  ADD_NEW_WAREHOUSE_GYPSUM_STONE_SOCKET,
  UPDATE_WAREHOUSE_GYPSUM_STONE_SOCKET,
  DELETE_WAREHOUSE_GYPSUM_STONE_SOCKET,
  ADD_NEW_WAREHOUSE_ALUMINUM1_SOCKET,
  UPDATE_WAREHOUSE_ALUMINUM1_SOCKET,
  DELETE_WAREHOUSE_ALUMINUM1_SOCKET,
  ADD_NEW_WAREHOUSE_ALUMINUM2_SOCKET,
  UPDATE_WAREHOUSE_ALUMINUM2_SOCKET,
  DELETE_WAREHOUSE_ALUMINUM2_SOCKET,
  ADD_NEW_WAREHOUSE_GRINDING_BALLS_SOCKET,
  UPDATE_WAREHOUSE_GRINDING_BALLS_SOCKET,
  DELETE_WAREHOUSE_GRINDING_BALLS_SOCKET,
  ADD_NEW_WAREHOUSE_AAC_SOCKET,
  UPDATE_WAREHOUSE_AAC_SOCKET,
  DELETE_WAREHOUSE_AAC_SOCKET,
  GET_UPDATE_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_NEW_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_DELETE_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_UPDATE_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_NEW_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_UPDATE_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_DELETE_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_NEW_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_UPDATE_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_DELETE_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_NEW_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_UPDATE_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_DELETE_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  DELETE_OLD_RAW_MAT_CONSUMPTION_SOCKET,
  ADD_NEW_LOTES_LIST_SOCKET,
  NEED_UPD_CONTACT_PRICE_INFO_SOCKET,
  UPDATE_CONTACT_INFO_SOCKET,
  UPDATE_DELIVERY_ADDRESSES_SOCKET,
  UPDATE_LOTES_LIST_SOCKET,
  ADD_NEW_LOTES_LIST_CAKES_SOCKET,
  UPDATE_LOTES_LIST_CAKES_SOCKET,
  UPDATE_LOTES_LIST_CAKES_BOOLEAN_SOCKET,
  ADD_NEW_FILES_LOTES_LIST_SOCKET,
  DELETE_FILES_LOTES_LIST_SOCKET,
  UPDATE_RECIPE_SOCKET,
  UPDATE_LOTES_LIST_NOTE_SOCKET,
  DELETE_LOTES_LIST_CAKES_SOCKET,
  UPDATE_RAW_MAT_CONSUMPTION_SOCKET,
  ADD_NEW_WAREHOUSE_SAND_SLURRY_SOCKET,
  ADD_NEW_ORDER_TO_WAREHOUSE_SOCKET,
  UPDATE_ORDER_TO_WAREHOUSE_SOCKET,
  DELETE_ORDER_TO_WAREHOUSE_SOCKET,
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

    case GET_DELETE_ORDER_SOCKET:
      dispatch(deleteOrderSocket(payload));
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

    case GET_DELETE_REL_MAT_PRODUCT_OF_ORDER_SOCKET:
      dispatch(deleteRelMatProductOfOrderSocket(payload));
      break;

    case GET_UPDATE_PRODUCT_INFO_OF_ORDER_SOCKET:
      dispatch(updateProductInfoOfOrderSocket(payload));
      break;

    case GET_UPDATE_DRY_MIXED_PRODUCT_INFO_OF_ORDER_SOCKET:
      dispatch(updateDryMixedProductInfoOfOrderSocket(payload));
      break;

    case GET_UPDATE_ANCHOR_PRODUCT_INFO_OF_ORDER_SOCKET:
      dispatch(updateAnchorProductInfoOfOrderSocket(payload));
      break;

    case GET_UPDATE_TOOL_PRODUCT_INFO_OF_ORDER_SOCKET:
      dispatch(updateToolProductInfoOfOrderSocket(payload));
      break;

    case GET_UPDATE_REL_MAT_PRODUCT_INFO_OF_ORDER_SOCKET:
      dispatch(updateRelMatProductInfoOfOrderSocket(payload));
      break;

    case GET_UPDATE_CONTACT_OF_ORDER_SOCKET:
      dispatch(updateContactOfOrderSocket(payload));
      break;

    case GET_UPDATE_ADRESS_OF_ORDER_SOCKET:
      dispatch(updateAdressOfOrderSocket(payload));
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

    case UPDATE_CONTACT_INFO_SOCKET:
      dispatch(updateContactInfoSocket(payload));
      break;

    case NEED_UPD_CONTACT_PRICE_INFO_SOCKET:
      dispatch(updContactPriceInfoSocket(payload));
      break;

    case ADD_DELIVERY_ADDRESSES_SOCKET:
      dispatch(addNewDeliveryAddressSocket(payload));
      break;

    case UPDATE_DELIVERY_ADDRESSES_SOCKET:
      dispatch(updateDeliveryAddressSocket(payload));
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

    case GET_NEW_PRODUCT_FROM_RESERVED_LIST_SOCKET:
      dispatch(addNewReservedProductSocket(payload));
      break;

    case GET_UPDATE_PRODUCT_FROM_RESERVED_LIST_SOCKET:
      dispatch(updateReservedProductSocket(payload));
      break;

    case GET_DELETE_PRODUCT_FROM_RESERVED_LIST_SOCKET:
      dispatch(deleteReservedProductSocket(payload));
      break;

    case GET_NEW_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET:
      dispatch(addNewDryMixedReservedProductSocket(payload));
      break;

    case GET_UPDATE_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET:
      dispatch(updateDryMixedReservedProductSocket(payload));
      break;

    case GET_DELETE_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET:
      dispatch(deleteDryMixedReservedProductSocket(payload));
      break;

    case GET_NEW_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET:
      dispatch(addNewAnchorReservedProductSocket(payload));
      break;

    case GET_UPDATE_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET:
      dispatch(updateAnchorReservedProductSocket(payload));
      break;

    case GET_DELETE_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET:
      dispatch(deleteAnchorReservedProductSocket(payload));
      break;

    case GET_NEW_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET:
      dispatch(addNewToolReservedProductSocket(payload));
      break;

    case GET_UPDATE_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET:
      dispatch(updateToolReservedProductSocket(payload));
      break;

    case GET_DELETE_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET:
      dispatch(deleteToolReservedProductSocket(payload));
      break;

    case GET_NEW_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET:
      dispatch(addNewRelMatReservedProductSocket(payload));
      break;

    case GET_UPDATE_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET:
      dispatch(updateRelMatReservedProductSocket(payload));
      break;

    case GET_DELETE_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET:
      dispatch(deleteRelMatReservedProductSocket(payload));
      break;

    case UPDATE_REMAINING_STOCK_SOCKET:
      dispatch(updateRemainingStockSocket(payload));
      break;

    case UPDATE_WAREHOUSE_QUANTITYS_SOCKET:
      dispatch(updateWarehouseQuantitysSocket(payload));
      break;

    case UPDATE_DRY_MIXES_QUANTITYS_SOCKET:
      dispatch(updateDryMixesQuantitysSocket(payload));
      break;

    case UPDATE_ANCHOR_QUANTITYS_SOCKET:
      dispatch(updateAnchorQuantitysSocket(payload));
      break;

    case UPDATE_TOOL_QUANTITYS_SOCKET:
      dispatch(updateToolQuantitysSocket(payload));
      break;

    case UPDATE_REL_MAT_QUANTITYS_SOCKET:
      dispatch(updateRelMatQuantitysSocket(payload));
      break;

    case ADD_NEW_RECIPE_SOCKET:
      dispatch(addNewRecipeSocket(payload));
      break;

    case UPDATE_RECIPE_SOCKET:
      dispatch(updateRecipeSocket(payload));
      break;

    case ADD_NEW_RAW_MAT_CONSUMPTION_SOCKET:
      dispatch(addNewRawMatConsumptionSocket(payload));
      break;

    case UPDATE_RAW_MAT_CONSUMPTION_SOCKET:
      dispatch(updateRawMatConsumptionSocket(payload));
      break;

    case DELETE_OLD_RAW_MAT_CONSUMPTION_SOCKET:
      dispatch(deleteRawMatConsumptionSocket(payload));
      break;

    case DELETE_RECIPE_SOCKET:
      dispatch(deleteRecipeSocket(payload));
      break;

    case ADD_NEW_FILES_LOTES_LIST_SOCKET:
      dispatch(addNewFilesLotesListSocket(payload));
      break;

    case DELETE_FILES_LOTES_LIST_SOCKET:
      dispatch(deleteFilesLotesListSocket(payload));
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

    case UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET:
      dispatch(updateRawMaterialsWarehouseSocket(payload));
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

    case UPDATE_PRODUCT_CODE_SOCKET:
      dispatch(updateProductCodeSocket(payload));
      break;

    case ADD_RANDOM_PRODUCTS_OF_ORDER_SOCKET:
      dispatch(addOrderRandomProductsSocket(payload));
      break;

    case GET_UPDATE_AUTOCLAVE_CALENDAR_SOCKET:
      dispatch(updateAutoclaveCalendarSocket(payload));
      break;

    case ADD_NEW_LIST_OF_ORDERED_PRODUCTION_SOCKET:
      dispatch(addNewListOfOrderedProductionSocket(payload));
      break;

    case GET_UPDATE_LIST_OF_ORDERED_PRODUCTION_SOCKET:
      dispatch(updateListOfOrderedProductionSocket(payload));
      break;

    case ADD_NEW_LIST_OF_ORDERED_PRODUCTION_OEM_SOCKET:
      dispatch(addNewListOfOrderedProductionOEMSocket(payload));
      break;

    case GET_UPDATE_LIST_OF_ORDERED_PRODUCTION_OEM_SOCKET:
      dispatch(updateListOfOrderedProductionOEMSocket(payload));
      break;

    case ADD_NEW_WAREHOUSE_SAND_SOCKET:
      dispatch(addNewWarehouseSandSocket(payload));
      break;

    case UPDATE_WAREHOUSE_SAND_SOCKET:
      dispatch(updateWarehouseSandSocket(payload));
      break;

    case DELETE_WAREHOUSE_SAND_SOCKET:
      dispatch(deleteWarehouseSandSocket(payload));
      break;

    case ADD_NEW_WAREHOUSE_LIME_SOCKET:
      dispatch(addNewWarehouseLimeSocket(payload));
      break;

    case UPDATE_WAREHOUSE_LIME_SOCKET:
      dispatch(updateWarehouseLimeSocket(payload));
      break;

    case DELETE_WAREHOUSE_LIME_SOCKET:
      dispatch(deleteWarehouseLimeSocket(payload));
      break;

    case ADD_NEW_WAREHOUSE_CEMENT_SOCKET:
      dispatch(addNewWarehouseCementSocket(payload));
      break;

    case UPDATE_WAREHOUSE_CEMENT_SOCKET:
      dispatch(updateWarehouseCementSocket(payload));
      break;

    case DELETE_WAREHOUSE_CEMENT_SOCKET:
      dispatch(deleteWarehouseCementSocket(payload));
      break;

    case ADD_NEW_WAREHOUSE_GYPSUM_SOCKET:
      dispatch(addNewWarehouseGypsumSocket(payload));
      break;

    case UPDATE_WAREHOUSE_GYPSUM_SOCKET:
      dispatch(updateWarehouseGypsumSocket(payload));
      break;

    case DELETE_WAREHOUSE_GYPSUM_SOCKET:
      dispatch(deleteWarehouseGypsumSocket(payload));
      break;

    case ADD_NEW_WAREHOUSE_GYPSUM_STONE_SOCKET:
      dispatch(addNewWarehouseGypsumStoneSocket(payload));
      break;

    case UPDATE_WAREHOUSE_GYPSUM_STONE_SOCKET:
      dispatch(updateWarehouseGypsumStoneSocket(payload));
      break;

    case DELETE_WAREHOUSE_GYPSUM_STONE_SOCKET:
      dispatch(deleteWarehouseGypsumStoneSocket(payload));
      break;

    case ADD_NEW_WAREHOUSE_ALUMINUM1_SOCKET:
      dispatch(addNewWarehouseAluminum1Socket(payload));
      break;

    case UPDATE_WAREHOUSE_ALUMINUM1_SOCKET:
      dispatch(updateWarehouseAluminum1Socket(payload));
      break;

    case DELETE_WAREHOUSE_ALUMINUM1_SOCKET:
      dispatch(deleteWarehouseAluminum1Socket(payload));
      break;

    case ADD_NEW_WAREHOUSE_ALUMINUM2_SOCKET:
      dispatch(addNewWarehouseAluminum2Socket(payload));
      break;

    case UPDATE_WAREHOUSE_ALUMINUM2_SOCKET:
      dispatch(updateWarehouseAluminum2Socket(payload));
      break;

    case DELETE_WAREHOUSE_ALUMINUM2_SOCKET:
      dispatch(deleteWarehouseAluminum2Socket(payload));
      break;

    case ADD_NEW_WAREHOUSE_GRINDING_BALLS_SOCKET:
      dispatch(addNewWarehouseGrindingBallsSocket(payload));
      break;

    case UPDATE_WAREHOUSE_GRINDING_BALLS_SOCKET:
      dispatch(updateWarehouseGrindingBallsSocket(payload));
      break;

    case DELETE_WAREHOUSE_GRINDING_BALLS_SOCKET:
      dispatch(deleteWarehouseGrindingBallsSocket(payload));
      break;

    case ADD_NEW_WAREHOUSE_AAC_SOCKET:
      dispatch(addNewWarehouseAACSocket(payload));
      break;

    case UPDATE_WAREHOUSE_AAC_SOCKET:
      dispatch(updateWarehouseAACSocket(payload));
      break;

    case DELETE_WAREHOUSE_AAC_SOCKET:
      dispatch(deleteWarehouseAACSocket(payload));
      break;

    case ADD_NEW_WAREHOUSE_SAND_SLURRY_SOCKET:
      dispatch(addNewWarehouseSandSlurrySocket(payload));
      break;

    case ADD_NEW_LOTES_LIST_SOCKET:
      dispatch(addNewLotesListSocket(payload));
      break;

    case DELETE_LOTES_LIST_CAKES_SOCKET:
      dispatch(deleteLotesListSocket(payload));
      break;

    case UPDATE_LOTES_LIST_SOCKET:
      dispatch(updateLotesListSocket(payload));
      break;

    case UPDATE_LOTES_LIST_NOTE_SOCKET:
      dispatch(updateLotesListNoteSocket(payload));
      break;

    case ADD_NEW_LOTES_LIST_CAKES_SOCKET:
      dispatch(addNewLotesListCakesSocket(payload));
      break;

    case UPDATE_LOTES_LIST_CAKES_SOCKET:
      dispatch(updateLotesListCakesSocket(payload));
      break;

    case UPDATE_LOTES_LIST_CAKES_BOOLEAN_SOCKET:
      dispatch(updateLotesListCakesBooleanSocket(payload));
      break;

    case ADD_NEW_ORDER_TO_WAREHOUSE_SOCKET:
      dispatch(addNewOrderToWarehouseSocket(payload));
      break;

    case UPDATE_ORDER_TO_WAREHOUSE_SOCKET:
      dispatch(updateOrderToWarehouseSocket(payload));
      break;

    case DELETE_ORDER_TO_WAREHOUSE_SOCKET:
      dispatch(deleteOrderToWarehouseSocket(payload));
      break;

    default:
      break;
  }
};
