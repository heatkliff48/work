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

export const deleteReservedProductSocket = (reserved_products_id) => {
  return {
    type: DELETE_PRODUCT_FROM_RESERVED_LIST_SOCKET,
    payload: reserved_products_id,
  };
};

export const updateRemainingStockSocket = (upd_rem_srock) => {
  return {
    type: REMAINING_STOCK_SOCKET,
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
