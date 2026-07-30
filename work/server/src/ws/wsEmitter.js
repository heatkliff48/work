const {
  ADD_NEW_PRODUCT_SOCKET,
  UPDATE_PRODUCT_SOCKET,
  UPDATE_ROLE_SOCKET,
  UPDATE_ROLE_ACTIVE_SOCKET,
  ADD_NEW_ORDER_SOCKET,
  ADD_CHILD_ORDER_SOCKET,
  ADD_DATASHIP_ORDER_SOCKET,
  ADD_NEW_CLIENT_SOCKET,
  UPDATE_CLIENT_SOCKET,
  ADD_NEW_BATCH_OUTSIDE_SOCKET,
  UPDATE_BATCH_OUTSIDE_SOCKET,
  DELETE_BATCH_OUTSIDE_SOCKET,
  ADD_CLIENTS_LEGAL_ADDRESS_SOCKET,
  UPDATE_LEGAL_ADDRESS_SOCKET,
  ADD_DELIVERY_ADDRESSES_SOCKET,
  ADD_CONTACT_INFO_SOCKET,
  UPDATE_PRODUCT_OF_ORDER_SOCKET,
  UPDATE_DRY_MIXED_PRODUCT_OF_ORDER_SOCKET,
  GET_DELETE_PRODUCT_OF_ORDER_SOCKET,
  GET_DELETE_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  UPDATE_REMAINING_STOCK_SOCKET,
  UPDATE_STATUS_OF_ORDER_SOCKET,
  ADD_NEW_WAREHOUSE_SOCKET,
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
  ADD_NEW_RELATED_MATERIALS_JOURNAL_SOCKET,
  UPDATE_RELATED_MATERIALS_JOURNAL_SOCKET,
  ADD_NEW_DRY_MIXES_JOURNAL_SOCKET,
  UPDATE_DRY_MIXES_JOURNAL_SOCKET,
  ADD_NEW_ANCHOR_SOCKET,
  UPDATE_ANCHOR_SOCKET,
  ADD_NEW_TOOL_SOCKET,
  UPDATE_TOOL_SOCKET,
  ADD_NEW_QUALITY_MANAGEMENT_DATA_SOCKET,
  UPDATE_QUALITY_MANAGEMENT_DATA_SOCKET,
  DELETE_QUALITY_MANAGEMENT_DATA_SOCKET,
  UPDATE_ANCHOR_PRODUCT_OF_ORDER_SOCKET,
  UPDATE_TOOL_PRODUCT_OF_ORDER_SOCKET,
  GET_DELETE_DRY_MIXED_PRODUCT_OF_ORDER_SOCKET,
  GET_DELETE_ANCHOR_PRODUCT_OF_ORDER_SOCKET,
  GET_DELETE_TOOL_PRODUCT_OF_ORDER_SOCKET,
  REPAIR_PRODUCT_SOCKET,
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
  ADD_DESCRIPTIOM_ORDER_SOCKET,
  ADD_SECONDARY_CONTACT_ORDER_SOCKET,
  ADD_NEW_ALDABARAN_SOCKET,
  UPDATE_REL_MAT_PRODUCT_OF_ORDER_SOCKET,
  DELETE_SECONDARY_CONTACT_ORDER_SOCKET,
  GET_NEW_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_UPDATE_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_NEW_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_UPDATE_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_DELETE_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_NEW_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_UPDATE_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_DELETE_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_NEW_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_UPDATE_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_DELETE_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_NEW_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_UPDATE_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_DELETE_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_DELETE_REL_MAT_PRODUCT_OF_ORDER_SOCKET,
  ADD_NEW_DELIVERY_PRICE_SOCKET,
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
  GET_UPDATE_LIST_OF_ORDERED_PRODUCTION_SOCKET,
  ADD_NEW_LIST_OF_ORDERED_PRODUCTION_SOCKET,
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
  ADD_NEW_RAW_MAT_CONSUMPTION_CURRENT_MOLDS_SOCKET,
  DELETE_OLD_RAW_MAT_CONSUMPTION_CURRENT_MOLDS_SOCKET,
  ADD_NEW_PRODUCTION_QUALITY_SOCKET,
  ADD_NEW_COMPRESSIONS_QUALITY_SOCKET,
  ADD_NEW_DIMENSIONS_QUALITY_SOCKET,
  UPDATE_COMPRESSIONS_QUALITY_SOCKET,
  UPDATE_DIMENSIONS_QUALITY_SOCKET,
  UPDATE_WAREHOUSE_SAND_SLURRY_SOCKET,
  ADD_NEW_WAREHOUSE_PALLETS_SOCKET,
  DELETE_WAREHOUSE_PALLETS_SOCKET,
  ADD_NEW_WAREHOUSE_PLASTICS_SOCKET,
  UPDATE_WAREHOUSE_PLASTICS_SOCKET,
  DELETE_WAREHOUSE_PLASTICS_SOCKET,
  ADD_NEW_WAREHOUSE_SAND_POWDER_SOCKET,
  UPDATE_WAREHOUSE_SAND_POWDER_SOCKET,
  UPDATE_WAREHOUSE_PALLETS_SOCKET,
  DELETE_WAREHOUSE_SAND_POWDER_SOCKET,
  ADD_WAREHOUSE_MANAGER_TRAILER_SOCKET,
  DELETE_WAREHOUSE_MANAGER_TRAILER_SOCKET,
  CHANGE_STATUS_WAREHOUSE_MANAGER_TRAILER_SOCKET,
  UPDATE_PAYMENT_METHOD_SOCKET,
} = require('../constants/event');
const myEmitter = require('../ee');

function registerWsEmitter(map) {
  myEmitter.on(ADD_NEW_PRODUCT_SOCKET, (products) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_PRODUCT_SOCKET,
          payload: products,
        }),
      );
    }
  });

  //PRODUCTION QUALITY
  myEmitter.on(ADD_NEW_PRODUCTION_QUALITY_SOCKET, (products_quantyties) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_PRODUCTION_QUALITY_SOCKET,
          payload: products_quantyties,
        }),
      );
    }
  });

  //DIMENSION QUALITY
  myEmitter.on(ADD_NEW_DIMENSIONS_QUALITY_SOCKET, (products_quantyties) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_DIMENSIONS_QUALITY_SOCKET,
          payload: products_quantyties,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_DIMENSIONS_QUALITY_SOCKET, (products_quantyties) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_DIMENSIONS_QUALITY_SOCKET,
          payload: products_quantyties,
        }),
      );
    }
  });

  //COMPRESSIONS QUALITY
  myEmitter.on(ADD_NEW_COMPRESSIONS_QUALITY_SOCKET, (products_quantyties) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_COMPRESSIONS_QUALITY_SOCKET,
          payload: products_quantyties,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_COMPRESSIONS_QUALITY_SOCKET, (products_quantyties) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_COMPRESSIONS_QUALITY_SOCKET,
          payload: products_quantyties,
        }),
      );
    }
  });

  myEmitter.on(ADD_NEW_ALDABARAN_SOCKET, (currentAldabaran) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_ALDABARAN_SOCKET,
          payload: currentAldabaran,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_PRODUCT_SOCKET, (products) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_PRODUCT_SOCKET,
          payload: products,
        }),
      );
    }
  });

  myEmitter.on(REPAIR_PRODUCT_SOCKET, (repProduct) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: REPAIR_PRODUCT_SOCKET,
          payload: repProduct,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_ROLE_SOCKET, (updRoleData) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_ROLE_SOCKET,
          payload: updRoleData,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_ROLE_ACTIVE_SOCKET, (updActiveRoleData) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_ROLE_ACTIVE_SOCKET,
          payload: updActiveRoleData,
        }),
      );
    }
  });

  myEmitter.on(ADD_NEW_ORDER_SOCKET, (newOrder) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_ORDER_SOCKET,
          payload: newOrder,
        }),
      );
    }
  });

  myEmitter.on(ADD_CHILD_ORDER_SOCKET, (childOrder) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_CHILD_ORDER_SOCKET,
          payload: childOrder,
        }),
      );
    }
  });

  myEmitter.on(GET_DELETE_ORDER_SOCKET, (order_id) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: GET_DELETE_ORDER_SOCKET,
          payload: order_id,
        }),
      );
    }
  });

  myEmitter.on(ADD_NEW_DELIVERY_PRICE_SOCKET, (order) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_DELIVERY_PRICE_SOCKET,
          payload: order,
        }),
      );
    }
  });

  myEmitter.on(ADD_DATASHIP_ORDER_SOCKET, (date) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_DATASHIP_ORDER_SOCKET,
          payload: date,
        }),
      );
    }
  });

  myEmitter.on(ADD_DESCRIPTIOM_ORDER_SOCKET, (desc) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_DESCRIPTIOM_ORDER_SOCKET,
          payload: desc,
        }),
      );
    }
  });

  myEmitter.on(ADD_SECONDARY_CONTACT_ORDER_SOCKET, (sec_cnt) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_SECONDARY_CONTACT_ORDER_SOCKET,
          payload: sec_cnt,
        }),
      );
    }
  });

  myEmitter.on(DELETE_SECONDARY_CONTACT_ORDER_SOCKET, (sec_cnt) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: DELETE_SECONDARY_CONTACT_ORDER_SOCKET,
          payload: sec_cnt,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_STATUS_OF_ORDER_SOCKET, (order) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_STATUS_OF_ORDER_SOCKET,
          payload: order,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_PERSON_IN_CHARGE_OF_ORDER_SOCKET, (person_in_charge) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_PERSON_IN_CHARGE_OF_ORDER_SOCKET,
          payload: person_in_charge,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_PAYMENT_METHOD_SOCKET, (payment_method) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_PAYMENT_METHOD_SOCKET,
          payload: payment_method,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_PRODUCT_OF_ORDER_SOCKET, (newProductsOfOrder) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_PRODUCT_OF_ORDER_SOCKET,
          payload: newProductsOfOrder,
        }),
      );
    }
  });

  myEmitter.on(
    UPDATE_DRY_MIXED_PRODUCT_OF_ORDER_SOCKET,
    (dry_mixed_product_of_order) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: UPDATE_DRY_MIXED_PRODUCT_OF_ORDER_SOCKET,
            payload: dry_mixed_product_of_order,
          }),
        );
      }
    },
  );

  myEmitter.on(
    UPDATE_ANCHOR_PRODUCT_OF_ORDER_SOCKET,
    (anchor_product_of_order) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: UPDATE_ANCHOR_PRODUCT_OF_ORDER_SOCKET,
            payload: anchor_product_of_order,
          }),
        );
      }
    },
  );

  myEmitter.on(
    UPDATE_TOOL_PRODUCT_OF_ORDER_SOCKET,
    (newToolProductsOfOrder) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: UPDATE_TOOL_PRODUCT_OF_ORDER_SOCKET,
            payload: newToolProductsOfOrder,
          }),
        );
      }
    },
  );

  myEmitter.on(
    UPDATE_REL_MAT_PRODUCT_OF_ORDER_SOCKET,
    (rel_mat_product_of_order) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: UPDATE_REL_MAT_PRODUCT_OF_ORDER_SOCKET,
            payload: rel_mat_product_of_order,
          }),
        );
      }
    },
  );

  myEmitter.on(GET_UPDATE_CONTACT_OF_ORDER_SOCKET, (contact_of_order) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: GET_UPDATE_CONTACT_OF_ORDER_SOCKET,
          payload: contact_of_order,
        }),
      );
    }
  });

  myEmitter.on(GET_UPDATE_ADRESS_OF_ORDER_SOCKET, (adress_of_order) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: GET_UPDATE_ADRESS_OF_ORDER_SOCKET,
          payload: adress_of_order,
        }),
      );
    }
  });

  myEmitter.on(GET_DELETE_PRODUCT_OF_ORDER_SOCKET, (product_id) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: GET_DELETE_PRODUCT_OF_ORDER_SOCKET,
          payload: product_id,
        }),
      );
    }
  });

  myEmitter.on(GET_DELETE_DRY_MIXED_PRODUCT_OF_ORDER_SOCKET, (product_id) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: GET_DELETE_DRY_MIXED_PRODUCT_OF_ORDER_SOCKET,
          payload: product_id,
        }),
      );
    }
  });

  myEmitter.on(GET_DELETE_ANCHOR_PRODUCT_OF_ORDER_SOCKET, (product_id) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: GET_DELETE_ANCHOR_PRODUCT_OF_ORDER_SOCKET,
          payload: product_id,
        }),
      );
    }
  });

  myEmitter.on(GET_DELETE_TOOL_PRODUCT_OF_ORDER_SOCKET, (product_id) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: GET_DELETE_TOOL_PRODUCT_OF_ORDER_SOCKET,
          payload: product_id,
        }),
      );
    }
  });

  myEmitter.on(GET_DELETE_REL_MAT_PRODUCT_OF_ORDER_SOCKET, (product_id) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: GET_DELETE_REL_MAT_PRODUCT_OF_ORDER_SOCKET,
          payload: product_id,
        }),
      );
    }
  });

  myEmitter.on(GET_UPDATE_PRODUCT_INFO_OF_ORDER_SOCKET, (upd_prod_info) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: GET_UPDATE_PRODUCT_INFO_OF_ORDER_SOCKET,
          payload: upd_prod_info,
        }),
      );
    }
  });

  myEmitter.on(
    GET_UPDATE_DRY_MIXED_PRODUCT_INFO_OF_ORDER_SOCKET,
    (upd_prod_info) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: GET_UPDATE_DRY_MIXED_PRODUCT_INFO_OF_ORDER_SOCKET,
            payload: upd_prod_info,
          }),
        );
      }
    },
  );

  myEmitter.on(
    GET_UPDATE_ANCHOR_PRODUCT_INFO_OF_ORDER_SOCKET,
    (upd_prod_info) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: GET_UPDATE_ANCHOR_PRODUCT_INFO_OF_ORDER_SOCKET,
            payload: upd_prod_info,
          }),
        );
      }
    },
  );

  myEmitter.on(
    GET_UPDATE_TOOL_PRODUCT_INFO_OF_ORDER_SOCKET,
    (upd_prod_info) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: GET_UPDATE_TOOL_PRODUCT_INFO_OF_ORDER_SOCKET,
            payload: upd_prod_info,
          }),
        );
      }
    },
  );

  myEmitter.on(
    GET_UPDATE_REL_MAT_PRODUCT_INFO_OF_ORDER_SOCKET,
    (upd_prod_info) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: GET_UPDATE_REL_MAT_PRODUCT_INFO_OF_ORDER_SOCKET,
            payload: upd_prod_info,
          }),
        );
      }
    },
  );

  myEmitter.on(ADD_NEW_WAREHOUSE_SOCKET, (new_warehouse) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_WAREHOUSE_SOCKET,
          payload: new_warehouse,
        }),
      );
    }
  });

  myEmitter.on(ADD_NEW_CLIENT_SOCKET, (client) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_CLIENT_SOCKET,
          payload: client,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_CLIENT_SOCKET, (client) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_CLIENT_SOCKET,
          payload: client,
        }),
      );
    }
  });

  myEmitter.on(ADD_CLIENTS_LEGAL_ADDRESS_SOCKET, (legalAddress) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_CLIENTS_LEGAL_ADDRESS_SOCKET,
          payload: legalAddress,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_LEGAL_ADDRESS_SOCKET, (legalAddress) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_LEGAL_ADDRESS_SOCKET,
          payload: legalAddress,
        }),
      );
    }
  });

  myEmitter.on(ADD_CONTACT_INFO_SOCKET, (contactInfo) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_CONTACT_INFO_SOCKET,
          payload: contactInfo,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_CONTACT_INFO_SOCKET, (contactInfo) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_CONTACT_INFO_SOCKET,
          payload: contactInfo,
        }),
      );
    }
  });

  myEmitter.on(NEED_UPD_CONTACT_PRICE_INFO_SOCKET, (updClient) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: NEED_UPD_CONTACT_PRICE_INFO_SOCKET,
          payload: updClient,
        }),
      );
    }
  });

  myEmitter.on(ADD_DELIVERY_ADDRESSES_SOCKET, (deliveryAddress) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_DELIVERY_ADDRESSES_SOCKET,
          payload: deliveryAddress,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_DELIVERY_ADDRESSES_SOCKET, (deliveryAddress) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_DELIVERY_ADDRESSES_SOCKET,
          payload: deliveryAddress,
        }),
      );
    }
  });

  myEmitter.on(ADD_NEW_BATCH_OUTSIDE_SOCKET, (batchOutside) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_BATCH_OUTSIDE_SOCKET,
          payload: batchOutside,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_BATCH_OUTSIDE_SOCKET, (batchOutside) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_BATCH_OUTSIDE_SOCKET,
          payload: batchOutside,
        }),
      );
    }
  });

  myEmitter.on(DELETE_BATCH_OUTSIDE_SOCKET, (batch_id) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: DELETE_BATCH_OUTSIDE_SOCKET,
          payload: batch_id,
        }),
      );
    }
  });

  myEmitter.on(
    GET_NEW_PRODUCT_FROM_RESERVED_LIST_SOCKET,
    (new_reserved_product) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: GET_NEW_PRODUCT_FROM_RESERVED_LIST_SOCKET,
            payload: new_reserved_product,
          }),
        );
      }
    },
  );

  myEmitter.on(
    GET_UPDATE_PRODUCT_FROM_RESERVED_LIST_SOCKET,
    (new_reserved_product) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: GET_UPDATE_PRODUCT_FROM_RESERVED_LIST_SOCKET,
            payload: new_reserved_product,
          }),
        );
      }
    },
  );

  myEmitter.on(
    GET_DELETE_PRODUCT_FROM_RESERVED_LIST_SOCKET,
    (reserved_products_id) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: GET_DELETE_PRODUCT_FROM_RESERVED_LIST_SOCKET,
            payload: reserved_products_id,
          }),
        );
      }
    },
  );

  myEmitter.on(
    GET_NEW_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET,
    (new_reserved_product) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: GET_NEW_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET,
            payload: new_reserved_product,
          }),
        );
      }
    },
  );

  myEmitter.on(
    GET_UPDATE_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET,
    (new_reserved_product) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: GET_UPDATE_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET,
            payload: new_reserved_product,
          }),
        );
      }
    },
  );

  myEmitter.on(
    GET_DELETE_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET,
    (reserved_products_id) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: GET_DELETE_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET,
            payload: reserved_products_id,
          }),
        );
      }
    },
  );

  myEmitter.on(
    GET_NEW_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET,
    (new_reserved_product) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: GET_NEW_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET,
            payload: new_reserved_product,
          }),
        );
      }
    },
  );

  myEmitter.on(
    GET_UPDATE_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET,
    (new_reserved_product) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: GET_UPDATE_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET,
            payload: new_reserved_product,
          }),
        );
      }
    },
  );

  myEmitter.on(
    GET_DELETE_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET,
    (reserved_products_id) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: GET_DELETE_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET,
            payload: reserved_products_id,
          }),
        );
      }
    },
  );

  myEmitter.on(
    GET_NEW_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET,
    (new_reserved_product) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: GET_NEW_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET,
            payload: new_reserved_product,
          }),
        );
      }
    },
  );

  myEmitter.on(
    GET_UPDATE_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET,
    (new_reserved_product) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: GET_UPDATE_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET,
            payload: new_reserved_product,
          }),
        );
      }
    },
  );

  myEmitter.on(
    GET_DELETE_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET,
    (reserved_products_id) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: GET_DELETE_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET,
            payload: reserved_products_id,
          }),
        );
      }
    },
  );

  myEmitter.on(
    GET_NEW_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET,
    (new_reserved_product) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: GET_NEW_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET,
            payload: new_reserved_product,
          }),
        );
      }
    },
  );

  myEmitter.on(
    GET_UPDATE_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET,
    (new_reserved_product) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: GET_UPDATE_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET,
            payload: new_reserved_product,
          }),
        );
      }
    },
  );

  myEmitter.on(
    GET_DELETE_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET,
    (reserved_products_id) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: GET_DELETE_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET,
            payload: reserved_products_id,
          }),
        );
      }
    },
  );

  myEmitter.on(UPDATE_REMAINING_STOCK_SOCKET, (updWarehouse) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_REMAINING_STOCK_SOCKET,
          payload: updWarehouse,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_WAREHOUSE_QUANTITYS_SOCKET, (updWarehouse) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_WAREHOUSE_QUANTITYS_SOCKET,
          payload: updWarehouse,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_DRY_MIXES_QUANTITYS_SOCKET, (updDryMixes) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_DRY_MIXES_QUANTITYS_SOCKET,
          payload: updDryMixes,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_ANCHOR_QUANTITYS_SOCKET, (updAnchor) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_ANCHOR_QUANTITYS_SOCKET,
          payload: updAnchor,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_TOOL_QUANTITYS_SOCKET, (updTool) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_TOOL_QUANTITYS_SOCKET,
          payload: updTool,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_REL_MAT_QUANTITYS_SOCKET, (updRelMat) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_REL_MAT_QUANTITYS_SOCKET,
          payload: updRelMat,
        }),
      );
    }
  });

  myEmitter.on(ADD_NEW_RAW_MAT_CONSUMPTION_SOCKET, (rawMatConsumption) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_RAW_MAT_CONSUMPTION_SOCKET,
          payload: rawMatConsumption,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_RAW_MAT_CONSUMPTION_SOCKET, (rawMatConsumption) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_RAW_MAT_CONSUMPTION_SOCKET,
          payload: rawMatConsumption,
        }),
      );
    }
  });

  myEmitter.on(DELETE_OLD_RAW_MAT_CONSUMPTION_SOCKET, (rawMatConsumption) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: DELETE_OLD_RAW_MAT_CONSUMPTION_SOCKET,
          payload: rawMatConsumption,
        }),
      );
    }
  });

  myEmitter.on(
    ADD_NEW_RAW_MAT_CONSUMPTION_CURRENT_MOLDS_SOCKET,
    (rawMatConsumption) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: ADD_NEW_RAW_MAT_CONSUMPTION_CURRENT_MOLDS_SOCKET,
            payload: rawMatConsumption,
          }),
        );
      }
    },
  );

  // myEmitter.on(UPDATE_RAW_MAT_CONSUMPTION_SOCKET, (rawMatConsumption) => {
  //   for (let [id, userConnect] of map) {
  //     userConnect.send(
  //       JSON.stringify({
  //         type: UPDATE_RAW_MAT_CONSUMPTION_SOCKET,
  //         payload: rawMatConsumption,
  //       }),
  //     );
  //   }
  // });

  myEmitter.on(
    DELETE_OLD_RAW_MAT_CONSUMPTION_CURRENT_MOLDS_SOCKET,
    (rawMatConsumption) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: DELETE_OLD_RAW_MAT_CONSUMPTION_CURRENT_MOLDS_SOCKET,
            payload: rawMatConsumption,
          }),
        );
      }
    },
  );

  myEmitter.on(ADD_NEW_RECIPE_SOCKET, (recipe) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_RECIPE_SOCKET,
          payload: recipe,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_RECIPE_SOCKET, (recipe) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_RECIPE_SOCKET,
          payload: recipe,
        }),
      );
    }
  });

  myEmitter.on(DELETE_RECIPE_SOCKET, (recipe_id) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: DELETE_RECIPE_SOCKET,
          payload: recipe_id,
        }),
      );
    }
  });

  myEmitter.on(ADD_NEW_FILES_LOTES_LIST_SOCKET, (filesWarehouse) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_FILES_LOTES_LIST_SOCKET,
          payload: filesWarehouse,
        }),
      );
    }
  });

  myEmitter.on(DELETE_FILES_LOTES_LIST_SOCKET, (warehouse_id) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: DELETE_FILES_LOTES_LIST_SOCKET,
          payload: warehouse_id,
        }),
      );
    }
  });

  myEmitter.on(ADD_NEW_FILES_WAREHOUSE_SOCKET, (filesWarehouse) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_FILES_WAREHOUSE_SOCKET,
          payload: filesWarehouse,
        }),
      );
    }
  });

  myEmitter.on(DELETE_FILES_WAREHOUSE_SOCKET, (warehouse_id) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: DELETE_FILES_WAREHOUSE_SOCKET,
          payload: warehouse_id,
        }),
      );
    }
  });

  myEmitter.on(ADD_NEW_FILES_ORDER_SOCKET, (filesOrder) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_FILES_ORDER_SOCKET,
          payload: filesOrder,
        }),
      );
    }
  });

  myEmitter.on(DELETE_FILES_ORDER_SOCKET, (order_id) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: DELETE_FILES_ORDER_SOCKET,
          payload: order_id,
        }),
      );
    }
  });

  myEmitter.on(SAVE_MATERIAL_PLAN_SOCKET, (recipeOrders) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: SAVE_MATERIAL_PLAN_SOCKET,
          payload: recipeOrders,
        }),
      );
    }
  });

  myEmitter.on(DELETE_MATERIAL_PLAN_SOCKET, (material_plan_id) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: DELETE_MATERIAL_PLAN_SOCKET,
          payload: material_plan_id,
        }),
      );
    }
  });

  myEmitter.on(ADD_NEW_FILES_PRODUCT_SOCKET, (filesProduct) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_FILES_PRODUCT_SOCKET,
          payload: filesProduct,
        }),
      );
    }
  });

  myEmitter.on(DELETE_FILES_PRODUCT_SOCKET, (product_id) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: DELETE_FILES_PRODUCT_SOCKET,
          payload: product_id,
        }),
      );
    }
  });

  myEmitter.on(ADD_NEW_STOCK_BALANCE_SOCKET, (newStockBalance) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_STOCK_BALANCE_SOCKET,
          payload: newStockBalance,
        }),
      );
    }
  });

  myEmitter.on(ADD_NEW_DRY_MIXES_JOURNAL_SOCKET, (dryMixesJournal) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_DRY_MIXES_JOURNAL_SOCKET,
          payload: dryMixesJournal,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_DRY_MIXES_JOURNAL_SOCKET, (dryMixesJournal) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_DRY_MIXES_JOURNAL_SOCKET,
          payload: dryMixesJournal,
        }),
      );
    }
  });

  myEmitter.on(
    ADD_NEW_RELATED_MATERIALS_JOURNAL_SOCKET,
    (relatedMaterialsJournal) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: ADD_NEW_RELATED_MATERIALS_JOURNAL_SOCKET,
            payload: relatedMaterialsJournal,
          }),
        );
      }
    },
  );

  myEmitter.on(
    UPDATE_RELATED_MATERIALS_JOURNAL_SOCKET,
    (relatedMaterialsJournal) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: UPDATE_RELATED_MATERIALS_JOURNAL_SOCKET,
            payload: relatedMaterialsJournal,
          }),
        );
      }
    },
  );

  myEmitter.on(ADD_NEW_ANCHOR_SOCKET, (anchor) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_ANCHOR_SOCKET,
          payload: anchor,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_ANCHOR_SOCKET, (anchor) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_ANCHOR_SOCKET,
          payload: anchor,
        }),
      );
    }
  });

  myEmitter.on(ADD_NEW_TOOL_SOCKET, (tool) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_TOOL_SOCKET,
          payload: tool,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_TOOL_SOCKET, (tool) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_TOOL_SOCKET,
          payload: tool,
        }),
      );
    }
  });

  myEmitter.on(ADD_NEW_DRY_MIXES_WAREHOUSE_SOCKET, (dryMixesWarehouse) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_DRY_MIXES_WAREHOUSE_SOCKET,
          payload: dryMixesWarehouse,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_DRY_MIXES_WAREHOUSE_SOCKET, (dryMixesWarehouse) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_DRY_MIXES_WAREHOUSE_SOCKET,
          payload: dryMixesWarehouse,
        }),
      );
    }
  });

  myEmitter.on(
    ADD_NEW_RELATED_MATERIALS_WAREHOUSE_SOCKET,
    (relatedMaterialsWarehouse) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: ADD_NEW_RELATED_MATERIALS_WAREHOUSE_SOCKET,
            payload: relatedMaterialsWarehouse,
          }),
        );
      }
    },
  );

  myEmitter.on(
    UPDATE_RELATED_MATERIALS_WAREHOUSE_SOCKET,
    (relatedMaterialsWarehouse) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: UPDATE_RELATED_MATERIALS_WAREHOUSE_SOCKET,
            payload: relatedMaterialsWarehouse,
          }),
        );
      }
    },
  );

  myEmitter.on(ADD_NEW_ANCHORS_WAREHOUSE_SOCKET, (anchorsWarehouse) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_ANCHORS_WAREHOUSE_SOCKET,
          payload: anchorsWarehouse,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_ANCHORS_WAREHOUSE_SOCKET, (anchorsWarehouse) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_ANCHORS_WAREHOUSE_SOCKET,
          payload: anchorsWarehouse,
        }),
      );
    }
  });

  myEmitter.on(ADD_NEW_TOOLS_WAREHOUSE_SOCKET, (toolsWarehouse) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_TOOLS_WAREHOUSE_SOCKET,
          payload: toolsWarehouse,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_TOOLS_WAREHOUSE_SOCKET, (toolsWarehouse) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_TOOLS_WAREHOUSE_SOCKET,
          payload: toolsWarehouse,
        }),
      );
    }
  });

  myEmitter.on(
    UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET,
    (rawMaterialsWarehouse) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET,
            payload: rawMaterialsWarehouse,
          }),
        );
      }
    },
  );

  myEmitter.on(
    ADD_NEW_QUALITY_MANAGEMENT_DATA_SOCKET,
    (qualityManagementData) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: ADD_NEW_QUALITY_MANAGEMENT_DATA_SOCKET,
            payload: qualityManagementData,
          }),
        );
      }
    },
  );

  myEmitter.on(
    UPDATE_QUALITY_MANAGEMENT_DATA_SOCKET,
    (qualityManagementData) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: UPDATE_QUALITY_MANAGEMENT_DATA_SOCKET,
            payload: qualityManagementData,
          }),
        );
      }
    },
  );

  myEmitter.on(
    DELETE_QUALITY_MANAGEMENT_DATA_SOCKET,
    (qualityManagementDataID) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: DELETE_QUALITY_MANAGEMENT_DATA_SOCKET,
            payload: qualityManagementDataID,
          }),
        );
      }
    },
  );

  myEmitter.on(ADD_WAREHOUSE_MANAGER_TRAILER_SOCKET, (wh_trailer) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_WAREHOUSE_MANAGER_TRAILER_SOCKET,
          payload: wh_trailer,
        }),
      );
    }
  });

  myEmitter.on(
    CHANGE_STATUS_WAREHOUSE_MANAGER_TRAILER_SOCKET,
    (wh_trailer_status) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: CHANGE_STATUS_WAREHOUSE_MANAGER_TRAILER_SOCKET,
            payload: wh_trailer_status,
          }),
        );
      }
    },
  );

  myEmitter.on(DELETE_WAREHOUSE_MANAGER_TRAILER_SOCKET, (wh_trailer) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: DELETE_WAREHOUSE_MANAGER_TRAILER_SOCKET,
          payload: wh_trailer,
        }),
      );
    }
  });

  // myEmitter.on(DELETE_QUALITY_MANAGEMENT_DATA_SOCKET, (qualityManagementDataID) => {
  //   for (let [id, userConnect] of map) {
  //     userConnect.send(
  //       JSON.stringify({
  //         type: DELETE_QUALITY_MANAGEMENT_DATA_SOCKET,
  //         payload: qualityManagementDataID,
  //       }),
  //     );
  //   }
  // });

  myEmitter.on(
    ADD_NEW_RELATED_MATERIALS_BACKORDER_SOCKET,
    (relatedMaterialsBackorderList) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: ADD_NEW_RELATED_MATERIALS_BACKORDER_SOCKET,
            payload: relatedMaterialsBackorderList,
          }),
        );
      }
    },
  );

  myEmitter.on(
    UPDATE_RELATED_MATERIALS_BACKORDER_SOCKET,
    (relatedMaterialsBackorderList) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: UPDATE_RELATED_MATERIALS_BACKORDER_SOCKET,
            payload: relatedMaterialsBackorderList,
          }),
        );
      }
    },
  );

  myEmitter.on(UPDATE_PRODUCT_CODE_SOCKET, (tool) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_PRODUCT_CODE_SOCKET,
          payload: tool,
        }),
      );
    }
  });

  myEmitter.on(ADD_RANDOM_PRODUCTS_OF_ORDER_SOCKET, (randomProducts) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_RANDOM_PRODUCTS_OF_ORDER_SOCKET,
          payload: randomProducts,
        }),
      );
    }
  });

  myEmitter.on(
    GET_UPDATE_AUTOCLAVE_CALENDAR_SOCKET,
    (updAutoclaveCalendares) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: GET_UPDATE_AUTOCLAVE_CALENDAR_SOCKET,
            payload: updAutoclaveCalendares,
          }),
        );
      }
    },
  );

  myEmitter.on(
    ADD_NEW_LIST_OF_ORDERED_PRODUCTION_SOCKET,
    (new_ordered_production) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: ADD_NEW_LIST_OF_ORDERED_PRODUCTION_SOCKET,
            payload: new_ordered_production,
          }),
        );
      }
    },
  );

  myEmitter.on(
    GET_UPDATE_LIST_OF_ORDERED_PRODUCTION_SOCKET,
    (upd_ordered_production) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: GET_UPDATE_LIST_OF_ORDERED_PRODUCTION_SOCKET,
            payload: upd_ordered_production,
          }),
        );
      }
    },
  );

  myEmitter.on(
    ADD_NEW_LIST_OF_ORDERED_PRODUCTION_OEM_SOCKET,
    (new_ordered_production_oem) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: ADD_NEW_LIST_OF_ORDERED_PRODUCTION_OEM_SOCKET,
            payload: new_ordered_production_oem,
          }),
        );
      }
    },
  );

  myEmitter.on(
    GET_UPDATE_LIST_OF_ORDERED_PRODUCTION_OEM_SOCKET,
    (upd_ordered_production_oem) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: GET_UPDATE_LIST_OF_ORDERED_PRODUCTION_OEM_SOCKET,
            payload: upd_ordered_production_oem,
          }),
        );
      }
    },
  );

  myEmitter.on(ADD_NEW_WAREHOUSE_SAND_SOCKET, (warehouseSand) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_WAREHOUSE_SAND_SOCKET,
          payload: warehouseSand,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_WAREHOUSE_SAND_SOCKET, (warehouseSand) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_WAREHOUSE_SAND_SOCKET,
          payload: warehouseSand,
        }),
      );
    }
  });

  myEmitter.on(DELETE_WAREHOUSE_SAND_SOCKET, (sand_warehouse_id) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: DELETE_WAREHOUSE_SAND_SOCKET,
          payload: sand_warehouse_id,
        }),
      );
    }
  });

  // Lime
  myEmitter.on(ADD_NEW_WAREHOUSE_LIME_SOCKET, (warehouseLime) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_WAREHOUSE_LIME_SOCKET,
          payload: warehouseLime,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_WAREHOUSE_LIME_SOCKET, (warehouseLime) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_WAREHOUSE_LIME_SOCKET,
          payload: warehouseLime,
        }),
      );
    }
  });

  myEmitter.on(DELETE_WAREHOUSE_LIME_SOCKET, (lime_warehouse_id) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: DELETE_WAREHOUSE_LIME_SOCKET,
          payload: lime_warehouse_id,
        }),
      );
    }
  });

  // Cement
  myEmitter.on(ADD_NEW_WAREHOUSE_CEMENT_SOCKET, (warehouseCement) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_WAREHOUSE_CEMENT_SOCKET,
          payload: warehouseCement,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_WAREHOUSE_CEMENT_SOCKET, (warehouseCement) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_WAREHOUSE_CEMENT_SOCKET,
          payload: warehouseCement,
        }),
      );
    }
  });

  myEmitter.on(DELETE_WAREHOUSE_CEMENT_SOCKET, (cement_warehouse_id) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: DELETE_WAREHOUSE_CEMENT_SOCKET,
          payload: cement_warehouse_id,
        }),
      );
    }
  });

  // Gypsum
  myEmitter.on(ADD_NEW_WAREHOUSE_GYPSUM_SOCKET, (warehouseGypsum) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_WAREHOUSE_GYPSUM_SOCKET,
          payload: warehouseGypsum,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_WAREHOUSE_GYPSUM_SOCKET, (warehouseGypsum) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_WAREHOUSE_GYPSUM_SOCKET,
          payload: warehouseGypsum,
        }),
      );
    }
  });

  myEmitter.on(DELETE_WAREHOUSE_GYPSUM_SOCKET, (gypsum_warehouse_id) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: DELETE_WAREHOUSE_GYPSUM_SOCKET,
          payload: gypsum_warehouse_id,
        }),
      );
    }
  });

  // Gypsum stone
  myEmitter.on(
    ADD_NEW_WAREHOUSE_GYPSUM_STONE_SOCKET,
    (warehouseGypsumStone) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: ADD_NEW_WAREHOUSE_GYPSUM_STONE_SOCKET,
            payload: warehouseGypsumStone,
          }),
        );
      }
    },
  );

  myEmitter.on(UPDATE_WAREHOUSE_GYPSUM_STONE_SOCKET, (warehouseGypsumStone) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_WAREHOUSE_GYPSUM_STONE_SOCKET,
          payload: warehouseGypsumStone,
        }),
      );
    }
  });

  myEmitter.on(
    DELETE_WAREHOUSE_GYPSUM_STONE_SOCKET,
    (gypsum_stone_warehouse_id) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: DELETE_WAREHOUSE_GYPSUM_STONE_SOCKET,
            payload: gypsum_stone_warehouse_id,
          }),
        );
      }
    },
  );

  // Aluminum1
  myEmitter.on(ADD_NEW_WAREHOUSE_ALUMINUM1_SOCKET, (warehouseAluminum1) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_WAREHOUSE_ALUMINUM1_SOCKET,
          payload: warehouseAluminum1,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_WAREHOUSE_ALUMINUM1_SOCKET, (warehouseAluminum1) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_WAREHOUSE_ALUMINUM1_SOCKET,
          payload: warehouseAluminum1,
        }),
      );
    }
  });

  myEmitter.on(DELETE_WAREHOUSE_ALUMINUM1_SOCKET, (aluminum1_warehouse_id) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: DELETE_WAREHOUSE_ALUMINUM1_SOCKET,
          payload: aluminum1_warehouse_id,
        }),
      );
    }
  });

  // Aluminum2
  myEmitter.on(ADD_NEW_WAREHOUSE_ALUMINUM2_SOCKET, (warehouseAluminum2) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_WAREHOUSE_ALUMINUM2_SOCKET,
          payload: warehouseAluminum2,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_WAREHOUSE_ALUMINUM2_SOCKET, (warehouseAluminum2) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_WAREHOUSE_ALUMINUM2_SOCKET,
          payload: warehouseAluminum2,
        }),
      );
    }
  });

  myEmitter.on(DELETE_WAREHOUSE_ALUMINUM2_SOCKET, (aluminum2_warehouse_id) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: DELETE_WAREHOUSE_ALUMINUM2_SOCKET,
          payload: aluminum2_warehouse_id,
        }),
      );
    }
  });

  // Grinding Balls
  myEmitter.on(
    ADD_NEW_WAREHOUSE_GRINDING_BALLS_SOCKET,
    (warehouseGrindingBalls) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: ADD_NEW_WAREHOUSE_GRINDING_BALLS_SOCKET,
            payload: warehouseGrindingBalls,
          }),
        );
      }
    },
  );

  myEmitter.on(
    UPDATE_WAREHOUSE_GRINDING_BALLS_SOCKET,
    (warehouseGrindingBalls) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: UPDATE_WAREHOUSE_GRINDING_BALLS_SOCKET,
            payload: warehouseGrindingBalls,
          }),
        );
      }
    },
  );

  myEmitter.on(
    DELETE_WAREHOUSE_GRINDING_BALLS_SOCKET,
    (grinding_balls_warehouse_id) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: DELETE_WAREHOUSE_GRINDING_BALLS_SOCKET,
            payload: grinding_balls_warehouse_id,
          }),
        );
      }
    },
  );

  // AAC
  myEmitter.on(ADD_NEW_WAREHOUSE_AAC_SOCKET, (warehouseAAC) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_WAREHOUSE_AAC_SOCKET,
          payload: warehouseAAC,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_WAREHOUSE_AAC_SOCKET, (warehouseAAC) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_WAREHOUSE_AAC_SOCKET,
          payload: warehouseAAC,
        }),
      );
    }
  });

  myEmitter.on(DELETE_WAREHOUSE_AAC_SOCKET, (aac_warehouse_id) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: DELETE_WAREHOUSE_AAC_SOCKET,
          payload: aac_warehouse_id,
        }),
      );
    }
  });

  // Sand Slurry
  myEmitter.on(ADD_NEW_WAREHOUSE_SAND_SLURRY_SOCKET, (warehouseSandSlurry) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_WAREHOUSE_SAND_SLURRY_SOCKET,
          payload: warehouseSandSlurry,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_WAREHOUSE_SAND_SLURRY_SOCKET, (warehouseSandSlurry) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_WAREHOUSE_SAND_SLURRY_SOCKET,
          payload: warehouseSandSlurry,
        }),
      );
    }
  });

  // Pallets
  myEmitter.on(ADD_NEW_WAREHOUSE_PALLETS_SOCKET, (warehousePallets) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_WAREHOUSE_PALLETS_SOCKET,
          payload: warehousePallets,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_WAREHOUSE_PALLETS_SOCKET, (warehousePallets) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_WAREHOUSE_PALLETS_SOCKET,
          payload: warehousePallets,
        }),
      );
    }
  });

  myEmitter.on(DELETE_WAREHOUSE_PALLETS_SOCKET, (pallets_warehouse_id) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: DELETE_WAREHOUSE_PALLETS_SOCKET,
          payload: pallets_warehouse_id,
        }),
      );
    }
  });

  // Plastics

  myEmitter.on(ADD_NEW_WAREHOUSE_PLASTICS_SOCKET, (warehousePlastics) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_WAREHOUSE_PLASTICS_SOCKET,
          payload: warehousePlastics,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_WAREHOUSE_PLASTICS_SOCKET, (warehousePlastics) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_WAREHOUSE_PLASTICS_SOCKET,
          payload: warehousePlastics,
        }),
      );
    }
  });

  myEmitter.on(DELETE_WAREHOUSE_PLASTICS_SOCKET, (plastics_warehouse_id) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: DELETE_WAREHOUSE_PLASTICS_SOCKET,
          payload: plastics_warehouse_id,
        }),
      );
    }
  });

  // Sand Powder

  myEmitter.on(ADD_NEW_WAREHOUSE_SAND_POWDER_SOCKET, (warehouseSandPowder) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_WAREHOUSE_SAND_POWDER_SOCKET,
          payload: warehouseSandPowder,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_WAREHOUSE_SAND_POWDER_SOCKET, (warehouseSandPowder) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_WAREHOUSE_SAND_POWDER_SOCKET,
          payload: warehouseSandPowder,
        }),
      );
    }
  });

  myEmitter.on(
    DELETE_WAREHOUSE_SAND_POWDER_SOCKET,
    (sand_powder_warehouse_id) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: DELETE_WAREHOUSE_SAND_POWDER_SOCKET,
            payload: sand_powder_warehouse_id,
          }),
        );
      }
    },
  );

  myEmitter.on(ADD_NEW_LOTES_LIST_SOCKET, (lotesListBatches) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_LOTES_LIST_SOCKET,
          payload: lotesListBatches,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_LOTES_LIST_SOCKET, (lotesListBatches) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_LOTES_LIST_SOCKET,
          payload: lotesListBatches,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_LOTES_LIST_NOTE_SOCKET, (lotesListBatches) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_LOTES_LIST_NOTE_SOCKET,
          payload: lotesListBatches,
        }),
      );
    }
  });

  myEmitter.on(ADD_NEW_LOTES_LIST_CAKES_SOCKET, (lotesListBatches) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_LOTES_LIST_CAKES_SOCKET,
          payload: lotesListBatches,
        }),
      );
    }
  });

  myEmitter.on(DELETE_LOTES_LIST_CAKES_SOCKET, (lotesListBatches) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: DELETE_LOTES_LIST_CAKES_SOCKET,
          payload: lotesListBatches,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_LOTES_LIST_CAKES_SOCKET, (lotesListBatches) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_LOTES_LIST_CAKES_SOCKET,
          payload: lotesListBatches,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_LOTES_LIST_CAKES_BOOLEAN_SOCKET, (lotesListBatches) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_LOTES_LIST_CAKES_BOOLEAN_SOCKET,
          payload: lotesListBatches,
        }),
      );
    }
  });

  myEmitter.on(ADD_NEW_ORDER_TO_WAREHOUSE_SOCKET, (orderToWarehouse) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_ORDER_TO_WAREHOUSE_SOCKET,
          payload: orderToWarehouse,
        }),
      );
    }
  });

  myEmitter.on(UPDATE_ORDER_TO_WAREHOUSE_SOCKET, (orderToWarehouse) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_ORDER_TO_WAREHOUSE_SOCKET,
          payload: orderToWarehouse,
        }),
      );
    }
  });

  myEmitter.on(DELETE_ORDER_TO_WAREHOUSE_SOCKET, (order_id) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: DELETE_ORDER_TO_WAREHOUSE_SOCKET,
          payload: order_id,
        }),
      );
    }
  });

  // myEmitter.on(CHECK_CARD_SOCKET, (gameusers, street, dohod, isFree, money) => {
  //   for (let [id, userConnect] of map) {
  //     gameusers.map((el) => {
  //       if (el.id == id) {
  //         userConnect.send(
  //           JSON.stringify({
  //             type: CHECK_CARD_SOCKET,
  //             payload: {
  //               card: street,
  //               cardBoardValue: dohod,
  //               isFree,
  //               money,
  //             },
  //           })
  //         );
  //       }
  //     });
  //   }
  // });
}
module.exports = registerWsEmitter;
