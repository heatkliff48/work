import {
  DATASHIP_ORDER_SOCKET,
  DELETE_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  DELETE_PRODUCT_OF_ORDER_SOCKET,
  NEED_DELETE_FILES_ORDER_SOCKET,
  NEED_DELETE_FILES_WAREHOUSE_SOCKET,
  NEED_DELETE_RECIPE_SOCKET,
  NEW_FILES_ORDER_SOCKET,
  NEW_FILES_WAREHOUSE_SOCKET,
  NEW_ORDER_SOCKET,
  NEW_PRODUCT_SOCKET,
  NEW_RECIPE_SOCKET,
  NEW_WAREHOUSE_SOCKET,
  REMAINING_STOCK_SOCKET,
  NEW_MATERIAL_PLAN_SOCKET,
  STATUS_OF_ORDER_SOCKET,
  UPD_PRODUCT_SOCKET,
  UPDATE_PRODUCT_OF_ORDER_REDUCER_SOCKET,
  UPDATE_ROLE_ACTIVE_SOCKET,
  UPDATE_ROLE_SOCKET,
  NEES_DELETE_MATERIAL_PLAN_SOCKET,
  NEW_FILES_PRODUCT_SOCKET,
  NEED_DELETE_FILES_PRODUCT_SOCKET,
  PERSON_IN_CHARGE_OF_ORDER_SOCKET,
  NEW_STOCK_BALANCE_SOCKET,
  NEW_DRY_MIXES_JOURNAL_SOCKET,
  NEED_UPDATE_DRY_MIXES_JOURNAL_SOCKET,
  NEW_RELATED_MATERIALS_JOURNAL_SOCKET,
  NEED_UPDATE_RELATED_MATERIALS_JOURNAL_SOCKET,
  NEW_ANCHOR_SOCKET,
  NEED_UPDATE_ANCHOR_SOCKET,
  NEW_TOOL_SOCKET,
  NEED_UPDATE_TOOL_SOCKET,
  UPDATE_DRY_MIXED_PRODUCT_OF_ORDER_REDUCER_SOCKET,
  UPDATE_ANCHOR_PRODUCT_OF_ORDER_REDUCER_SOCKET,
  UPDATE_TOOL_PRODUCT_OF_ORDER_REDUCER_SOCKET,
  NEW_QUALITY_MANAGEMENT_DATA_SOCKET,
  NEED_UPDATE_QUALITY_MANAGEMENT_DATA_SOCKET,
  NEED_DELETE_QUALITY_MANAGEMENT_DATA_SOCKET,
  DELETE_DRY_MIXED_PRODUCT_OF_ORDER_SOCKET,
  DELETE_ANCHOR_PRODUCT_OF_ORDER_SOCKET,
  DELETE_TOOL_PRODUCT_OF_ORDER_SOCKET,
  REP_PRODUCT_SOCKET,
  NEW_DRY_MIXES_WAREHOUSE_SOCKET,
  NEED_UPDATE_DRY_MIXES_WAREHOUSE_SOCKET,
  NEW_RELATED_MATERIALS_WAREHOUSE_SOCKET,
  NEED_UPDATE_RELATED_MATERIALS_WAREHOUSE_SOCKET,
  NEW_ANCHORS_WAREHOUSE_SOCKET,
  NEW_TOOLS_WAREHOUSE_SOCKET,
  NEED_UPDATE_TOOLS_WAREHOUSE_SOCKET,
  NEED_UPDATE_ANCHORS_WAREHOUSE_SOCKET,
  NEW_RELATED_MATERIALS_BACKORDER_SOCKET,
  NEED_UPDATE_RELATED_MATERIALS_BACKORDER_SOCKET,
  DESCRIPTIOM_ORDER_SOCKET,
  SECONDARY_CONTACT_ORDER_SOCKET,
  NEW_ALDABARAN_SOCKET,
  UPDATE_REL_MAT_PRODUCT_OF_ORDER_REDUCER_SOCKET,
  REMOVE_SECONDARY_CONTACT_ORDER_SOCKET,
  NEW_DELIVERY_PRICE_SOCKET,
  NEW_PRODUCT_FROM_RESERVED_LIST_SOCKET,
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
  DELETE_REL_MAT_PRODUCT_OF_ORDER_SOCKET,
  NEED_UPDATE_PRODUCT_CODE_SOCKET,
  NEW_RANDOM_PRODUCTS_OF_ORDER_SOCKET,
  UPDATE_PRODUCT_INFO_OF_ORDER_SOCKET,
  UPDATE_DRY_MIXED_PRODUCT_INFO_OF_ORDER_SOCKET,
  UPDATE_ANCHOR_PRODUCT_INFO_OF_ORDER_SOCKET,
  UPDATE_TOOL_PRODUCT_INFO_OF_ORDER_SOCKET,
  UPDATE_REL_MAT_PRODUCT_INFO_OF_ORDER_SOCKET,
  UPDATE_CONTACT_OF_ORDER_SOCKET,
  UPDATE_ADRESS_OF_ORDER_SOCKET,
  DELETE_ORDER_SOCKET,
  UPDATE_AUTOCLAVE_CALENDAR_SOCKET,
  NEW_LIST_OF_ORDERED_PRODUCTION_SOCKET,
  UPDATE_LIST_OF_ORDERED_PRODUCTION_SOCKET,
  NEW_LIST_OF_ORDERED_PRODUCTION_OEM_SOCKET,
  UPDATE_LIST_OF_ORDERED_PRODUCTION_OEM_SOCKET,
  WAREHOUSE_QUANTITYS_SOCKET,
  DRY_MIXES_QUANTITYS_SOCKET,
  ANCHOR_QUANTITYS_SOCKET,
  TOOL_QUANTITYS_SOCKET,
  REL_MAT_QUANTITYS_SOCKET,
  NEW_RAW_MAT_CONSUMPTION_SOCKET,
} from '#components/redux/types/socketTypes/socket.js';

export const updateRolesSocket = (updRoleData) => {
  return {
    type: UPDATE_ROLE_SOCKET,
    payload: updRoleData,
  };
};

export const updateRolesActiveSocket = (updActiveRoleData) => {
  return {
    type: UPDATE_ROLE_ACTIVE_SOCKET,
    payload: updActiveRoleData,
  };
};

export const addNewProductSocket = (products) => {
  return {
    type: NEW_PRODUCT_SOCKET,
    payload: products,
  };
};

export const updateProductSocket = (products) => {
  return {
    type: UPD_PRODUCT_SOCKET,
    payload: products,
  };
};

export const repairProductSocket = (repProduct) => {
  return {
    type: REP_PRODUCT_SOCKET,
    payload: repProduct,
  };
};

export const addNewOrderSocket = (newOrder) => {
  return {
    type: NEW_ORDER_SOCKET,
    payload: newOrder,
  };
};

export const deleteOrderSocket = (order_id) => {
  return {
    type: DELETE_ORDER_SOCKET,
    payload: order_id,
  };
};

export const addNewDeliveryPriceSocket = (price) => {
  return {
    type: NEW_DELIVERY_PRICE_SOCKET,
    payload: price,
  };
};

export const updProductOfOrderSocket = (product_of_order) => {
  return {
    type: UPDATE_PRODUCT_OF_ORDER_REDUCER_SOCKET,
    payload: product_of_order,
  };
};

export const updDryMixedProductOfOrderSocket = (dry_mixed_product_of_order) => {
  return {
    type: UPDATE_DRY_MIXED_PRODUCT_OF_ORDER_REDUCER_SOCKET,
    payload: dry_mixed_product_of_order,
  };
};

export const updAnchorProductOfOrderSocket = (anchor_product_of_order) => {
  return {
    type: UPDATE_ANCHOR_PRODUCT_OF_ORDER_REDUCER_SOCKET,
    payload: anchor_product_of_order,
  };
};

export const updToolProductOfOrderSocket = (tool_product_of_order) => {
  return {
    type: UPDATE_TOOL_PRODUCT_OF_ORDER_REDUCER_SOCKET,
    payload: tool_product_of_order,
  };
};

export const updRelMatProductOfOrderSocket = (rel_mat_product_of_order) => {
  return {
    type: UPDATE_REL_MAT_PRODUCT_OF_ORDER_REDUCER_SOCKET,
    payload: rel_mat_product_of_order,
  };
};

export const deeleteProductOfOrderSocket = (product_id) => {
  return {
    type: DELETE_PRODUCT_OF_ORDER_SOCKET,
    payload: product_id,
  };
};

export const deleteDryMixedProductOfOrderSocket = (product_id) => {
  return {
    type: DELETE_DRY_MIXED_PRODUCT_OF_ORDER_SOCKET,
    payload: product_id,
  };
};

export const deleteAnchorProductOfOrderSocket = (product_id) => {
  return {
    type: DELETE_ANCHOR_PRODUCT_OF_ORDER_SOCKET,
    payload: product_id,
  };
};

export const deleteToolProductOfOrderSocket = (product_id) => {
  return {
    type: DELETE_TOOL_PRODUCT_OF_ORDER_SOCKET,
    payload: product_id,
  };
};

export const deleteRelMatProductOfOrderSocket = (product_id) => {
  return {
    type: DELETE_REL_MAT_PRODUCT_OF_ORDER_SOCKET,
    payload: product_id,
  };
};

export const updateProductInfoOfOrderSocket = (upd_prod_info) => {
  return {
    type: UPDATE_PRODUCT_INFO_OF_ORDER_SOCKET,
    payload: upd_prod_info,
  };
};

export const updateDryMixedProductInfoOfOrderSocket = (upd_prod_info) => {
  return {
    type: UPDATE_DRY_MIXED_PRODUCT_INFO_OF_ORDER_SOCKET,
    payload: upd_prod_info,
  };
};

export const updateAnchorProductInfoOfOrderSocket = (upd_prod_info) => {
  return {
    type: UPDATE_ANCHOR_PRODUCT_INFO_OF_ORDER_SOCKET,
    payload: upd_prod_info,
  };
};

export const updateToolProductInfoOfOrderSocket = (upd_prod_info) => {
  return {
    type: UPDATE_TOOL_PRODUCT_INFO_OF_ORDER_SOCKET,
    payload: upd_prod_info,
  };
};

export const updateRelMatProductInfoOfOrderSocket = (upd_prod_info) => {
  return {
    type: UPDATE_REL_MAT_PRODUCT_INFO_OF_ORDER_SOCKET,
    payload: upd_prod_info,
  };
};

export const updateContactOfOrderSocket = (date) => {
  return {
    type: UPDATE_CONTACT_OF_ORDER_SOCKET,
    payload: date,
  };
};

export const updateAdressOfOrderSocket = (date) => {
  return {
    type: UPDATE_ADRESS_OF_ORDER_SOCKET,
    payload: date,
  };
};

export const addDatashipOrderSocket = (date) => {
  return {
    type: DATASHIP_ORDER_SOCKET,
    payload: date,
  };
};

export const addDescOrderSocket = (desc) => {
  return {
    type: DESCRIPTIOM_ORDER_SOCKET,
    payload: desc,
  };
};

export const addSecondaryContactSocket = (sec_cnt) => {
  return {
    type: SECONDARY_CONTACT_ORDER_SOCKET,
    payload: sec_cnt,
  };
};

export const deleteSecondaryContactSocket = (sec_cnt) => {
  return {
    type: REMOVE_SECONDARY_CONTACT_ORDER_SOCKET,
    payload: sec_cnt,
  };
};

export const updStatusOfOrderSocket = (order) => {
  return {
    type: STATUS_OF_ORDER_SOCKET,
    payload: order,
  };
};

export const updInChargeOrderSocket = (person_in_charge) => {
  return {
    type: PERSON_IN_CHARGE_OF_ORDER_SOCKET,
    payload: person_in_charge,
  };
};

export const updateAutoclaveCalendarSocket = (updAutoclaveCalendares) => {
  return {
    type: UPDATE_AUTOCLAVE_CALENDAR_SOCKET,
    payload: updAutoclaveCalendares,
  };
};

export const addNewReservedProductSocket = (new_reserved_product) => {
  return {
    type: NEW_PRODUCT_FROM_RESERVED_LIST_SOCKET,
    payload: new_reserved_product,
  };
};

export const updateReservedProductSocket = (new_reserved_product) => {
  return {
    type: UPDATE_PRODUCT_FROM_RESERVED_LIST_SOCKET,
    payload: new_reserved_product,
  };
};

export const deleteReservedProductSocket = (reserved_products_id) => {
  return {
    type: DELETE_PRODUCT_FROM_RESERVED_LIST_SOCKET,
    payload: reserved_products_id,
  };
};

export const addNewDryMixedReservedProductSocket = (new_reserved_product) => {
  return {
    type: NEW_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET,
    payload: new_reserved_product,
  };
};

export const updateDryMixedReservedProductSocket = (new_reserved_product) => {
  return {
    type: UPDATE_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET,
    payload: new_reserved_product,
  };
};

export const deleteDryMixedReservedProductSocket = (reserved_products_id) => {
  return {
    type: DELETE_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET,
    payload: reserved_products_id,
  };
};

export const addNewAnchorReservedProductSocket = (new_reserved_product) => {
  return {
    type: NEW_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET,
    payload: new_reserved_product,
  };
};

export const updateAnchorReservedProductSocket = (new_reserved_product) => {
  return {
    type: UPDATE_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET,
    payload: new_reserved_product,
  };
};

export const deleteAnchorReservedProductSocket = (reserved_products_id) => {
  return {
    type: DELETE_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET,
    payload: reserved_products_id,
  };
};

export const addNewToolReservedProductSocket = (new_reserved_product) => {
  return {
    type: NEW_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET,
    payload: new_reserved_product,
  };
};

export const updateToolReservedProductSocket = (new_reserved_product) => {
  return {
    type: UPDATE_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET,
    payload: new_reserved_product,
  };
};

export const deleteToolReservedProductSocket = (reserved_products_id) => {
  return {
    type: DELETE_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET,
    payload: reserved_products_id,
  };
};

export const addNewRelMatReservedProductSocket = (new_reserved_product) => {
  return {
    type: NEW_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET,
    payload: new_reserved_product,
  };
};

export const updateRelMatReservedProductSocket = (new_reserved_product) => {
  return {
    type: UPDATE_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET,
    payload: new_reserved_product,
  };
};

export const deleteRelMatReservedProductSocket = (reserved_products_id) => {
  return {
    type: DELETE_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET,
    payload: reserved_products_id,
  };
};

export const updateRemainingStockSocket = (upd_rem_srock) => {
  return {
    type: REMAINING_STOCK_SOCKET,
    payload: upd_rem_srock,
  };
};

export const updateWarehouseQuantitysSocket = (upd_rem_srock) => {
  return {
    type: WAREHOUSE_QUANTITYS_SOCKET,
    payload: upd_rem_srock,
  };
};

export const updateDryMixesQuantitysSocket = (upd_rem_srock) => {
  return {
    type: DRY_MIXES_QUANTITYS_SOCKET,
    payload: upd_rem_srock,
  };
};

export const updateAnchorQuantitysSocket = (upd_rem_srock) => {
  return {
    type: ANCHOR_QUANTITYS_SOCKET,
    payload: upd_rem_srock,
  };
};

export const updateToolQuantitysSocket = (upd_rem_srock) => {
  return {
    type: TOOL_QUANTITYS_SOCKET,
    payload: upd_rem_srock,
  };
};

export const updateRelMatQuantitysSocket = (upd_rem_srock) => {
  return {
    type: REL_MAT_QUANTITYS_SOCKET,
    payload: upd_rem_srock,
  };
};

export const addNewWarehouseSocket = (new_warehouse) => {
  return {
    type: NEW_WAREHOUSE_SOCKET,
    payload: new_warehouse,
  };
};

export const addNewRecipeSocket = (recipe) => {
  return {
    type: NEW_RECIPE_SOCKET,
    payload: recipe,
  };
};

export const addNewRawMatConsumptionSocket = (rawMatConsumption) => {
  return {
    type: NEW_RAW_MAT_CONSUMPTION_SOCKET,
    payload: rawMatConsumption,
  };
};

export const deleteRecipeSocket = (recipe_id) => {
  return {
    type: NEED_DELETE_RECIPE_SOCKET,
    payload: recipe_id,
  };
};

export const addNewFilesWarehouseSocket = (filesWarehouse) => {
  return {
    type: NEW_FILES_WAREHOUSE_SOCKET,
    payload: filesWarehouse,
  };
};

export const deleteFilesWarehouseSocket = (warehouse_id) => {
  return {
    type: NEED_DELETE_FILES_WAREHOUSE_SOCKET,
    payload: warehouse_id,
  };
};

export const addNewFilesOrderSocket = (filesOrder) => {
  return {
    type: NEW_FILES_ORDER_SOCKET,
    payload: filesOrder,
  };
};

export const deleteFilesOrderSocket = (order_id) => {
  return {
    type: NEED_DELETE_FILES_ORDER_SOCKET,
    payload: order_id,
  };
};

export const addNewFilesProductSocket = (filesProduct) => {
  return {
    type: NEW_FILES_PRODUCT_SOCKET,
    payload: filesProduct,
  };
};

export const deleteFilesProductSocket = (product_id) => {
  return {
    type: NEED_DELETE_FILES_PRODUCT_SOCKET,
    payload: product_id,
  };
};

export const saveMaterialPlanSocket = (recipeOrders) => {
  return {
    type: NEW_MATERIAL_PLAN_SOCKET,
    payload: recipeOrders,
  };
};

export const deleteMaterialPlanSocket = (material_plan_id) => {
  return {
    type: NEES_DELETE_MATERIAL_PLAN_SOCKET,
    payload: material_plan_id,
  };
};

export const addNewStockBalanceSocket = (stock) => {
  return {
    type: NEW_STOCK_BALANCE_SOCKET,
    payload: stock,
  };
};

export const addNewDryMixesJournalSocket = (dryMixesJournal) => {
  return {
    type: NEW_DRY_MIXES_JOURNAL_SOCKET,
    payload: dryMixesJournal,
  };
};

export const updateDryMixesJournalSocket = (dryMixesJournal) => {
  return {
    type: NEED_UPDATE_DRY_MIXES_JOURNAL_SOCKET,
    payload: dryMixesJournal,
  };
};

export const addNewRelatedMaterialsJournalSocket = (relatedMaterialsJournal) => {
  return {
    type: NEW_RELATED_MATERIALS_JOURNAL_SOCKET,
    payload: relatedMaterialsJournal,
  };
};

export const updateRelatedMaterialsJournalSocket = (relatedMaterialsJournal) => {
  return {
    type: NEED_UPDATE_RELATED_MATERIALS_JOURNAL_SOCKET,
    payload: relatedMaterialsJournal,
  };
};

export const addNewAnchorSocket = (anchor) => {
  return {
    type: NEW_ANCHOR_SOCKET,
    payload: anchor,
  };
};

export const updateAnchorSocket = (anchor) => {
  return {
    type: NEED_UPDATE_ANCHOR_SOCKET,
    payload: anchor,
  };
};

export const addNewToolSocket = (tool) => {
  return {
    type: NEW_TOOL_SOCKET,
    payload: tool,
  };
};

export const updateToolSocket = (tool) => {
  return {
    type: NEED_UPDATE_TOOL_SOCKET,
    payload: tool,
  };
};

export const addNewDryMixesWarehouseSocket = (dryMixesWarehouse) => {
  return {
    type: NEW_DRY_MIXES_WAREHOUSE_SOCKET,
    payload: dryMixesWarehouse,
  };
};

export const updateDryMixesWarehouseSocket = (dryMixesWarehouse) => {
  return {
    type: NEED_UPDATE_DRY_MIXES_WAREHOUSE_SOCKET,
    payload: dryMixesWarehouse,
  };
};

export const addNewRelatedMaterialsWarehouseSocket = (relatedMaterialsWarehouse) => {
  return {
    type: NEW_RELATED_MATERIALS_WAREHOUSE_SOCKET,
    payload: relatedMaterialsWarehouse,
  };
};

export const updateRelatedMaterialsWarehouseSocket = (relatedMaterialsWarehouse) => {
  return {
    type: NEED_UPDATE_RELATED_MATERIALS_WAREHOUSE_SOCKET,
    payload: relatedMaterialsWarehouse,
  };
};

export const addNewAnchorsWarehouseSocket = (anchorsWarehouse) => {
  return {
    type: NEW_ANCHORS_WAREHOUSE_SOCKET,
    payload: anchorsWarehouse,
  };
};

export const updateAnchorsWarehouseSocket = (anchorsWarehouse) => {
  return {
    type: NEED_UPDATE_ANCHORS_WAREHOUSE_SOCKET,
    payload: anchorsWarehouse,
  };
};

export const addNewToolsWarehouseSocket = (toolsWarehouse) => {
  return {
    type: NEW_TOOLS_WAREHOUSE_SOCKET,
    payload: toolsWarehouse,
  };
};

export const updateToolsWarehouseSocket = (toolsWarehouse) => {
  return {
    type: NEED_UPDATE_TOOLS_WAREHOUSE_SOCKET,
    payload: toolsWarehouse,
  };
};

export const addNewQualityManagementSocket = (qualityManagementData) => {
  return {
    type: NEW_QUALITY_MANAGEMENT_DATA_SOCKET,
    payload: qualityManagementData,
  };
};

export const updateQualityManagementSocket = (qualityManagementData) => {
  return {
    type: NEED_UPDATE_QUALITY_MANAGEMENT_DATA_SOCKET,
    payload: qualityManagementData,
  };
};

export const deleteQualityManagementSocket = (qualityManagementDataID) => {
  return {
    type: NEED_DELETE_QUALITY_MANAGEMENT_DATA_SOCKET,
    payload: qualityManagementDataID,
  };
};

export const addNewRelatedMaterialsBackorderSocket = (
  relatedMaterialsBackorderList
) => {
  return {
    type: NEW_RELATED_MATERIALS_BACKORDER_SOCKET,
    payload: relatedMaterialsBackorderList,
  };
};

export const updateRelatedMaterialsBackorderSocket = (
  relatedMaterialsBackorderList
) => {
  return {
    type: NEED_UPDATE_RELATED_MATERIALS_BACKORDER_SOCKET,
    payload: relatedMaterialsBackorderList,
  };
};

export const addNewAldabaranSocket = (currentAldabaran) => {
  return {
    type: NEW_ALDABARAN_SOCKET,
    payload: currentAldabaran,
  };
};

export const updateProductCodeSocket = (productCode) => {
  return {
    type: NEED_UPDATE_PRODUCT_CODE_SOCKET,
    payload: productCode,
  };
};

export const addOrderRandomProductsSocket = (randomProducts) => {
  return {
    type: NEW_RANDOM_PRODUCTS_OF_ORDER_SOCKET,
    payload: randomProducts,
  };
};

export const addNewListOfOrderedProductionSocket = (new_ordered_production) => {
  return {
    type: NEW_LIST_OF_ORDERED_PRODUCTION_SOCKET,
    payload: new_ordered_production,
  };
};

export const updateListOfOrderedProductionSocket = (upd_ordered_production) => {
  return {
    type: UPDATE_LIST_OF_ORDERED_PRODUCTION_SOCKET,
    payload: upd_ordered_production,
  };
};

export const addNewListOfOrderedProductionOEMSocket = (
  new_ordered_production_oem
) => {
  return {
    type: NEW_LIST_OF_ORDERED_PRODUCTION_OEM_SOCKET,
    payload: new_ordered_production_oem,
  };
};

export const updateListOfOrderedProductionOEMSocket = (
  upd_ordered_production_oem
) => {
  return {
    type: UPDATE_LIST_OF_ORDERED_PRODUCTION_OEM_SOCKET,
    payload: upd_ordered_production_oem,
  };
};
