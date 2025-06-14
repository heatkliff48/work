const {
  ADD_NEW_PRODUCT_SOCKET,
  UPDATE_PRODUCT_SOCKET,
  UPDATE_ROLE_SOCKET,
  UPDATE_ROLE_ACTIVE_SOCKET,
  ADD_NEW_ORDER_SOCKET,
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
} = require('../constants/event');
const myEmitter = require('../ee');

function registerWsEmitter(map) {
  myEmitter.on(ADD_NEW_PRODUCT_SOCKET, (products) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_PRODUCT_SOCKET,
          payload: products,
        })
      );
    }
  });

  myEmitter.on(ADD_NEW_ALDABARAN_SOCKET, (currentAldabaran) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_ALDABARAN_SOCKET,
          payload: currentAldabaran,
        })
      );
    }
  });

  myEmitter.on(UPDATE_PRODUCT_SOCKET, (products) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_PRODUCT_SOCKET,
          payload: products,
        })
      );
    }
  });

  myEmitter.on(REPAIR_PRODUCT_SOCKET, (repProduct) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: REPAIR_PRODUCT_SOCKET,
          payload: repProduct,
        })
      );
    }
  });

  myEmitter.on(UPDATE_ROLE_SOCKET, (updRoleData) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_ROLE_SOCKET,
          payload: updRoleData,
        })
      );
    }
  });

  myEmitter.on(UPDATE_ROLE_ACTIVE_SOCKET, (updActiveRoleData) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_ROLE_ACTIVE_SOCKET,
          payload: updActiveRoleData,
        })
      );
    }
  });

  myEmitter.on(ADD_NEW_ORDER_SOCKET, (newOrder) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_ORDER_SOCKET,
          payload: newOrder,
        })
      );
    }
  });

  myEmitter.on(ADD_DATASHIP_ORDER_SOCKET, (date) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_DATASHIP_ORDER_SOCKET,
          payload: date,
        })
      );
    }
  });

  myEmitter.on(ADD_DESCRIPTIOM_ORDER_SOCKET, (desc) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_DESCRIPTIOM_ORDER_SOCKET,
          payload: desc,
        })
      );
    }
  });

  myEmitter.on(ADD_SECONDARY_CONTACT_ORDER_SOCKET, (sec_cnt) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_SECONDARY_CONTACT_ORDER_SOCKET,
          payload: sec_cnt,
        })
      );
    }
  });

  myEmitter.on(DELETE_SECONDARY_CONTACT_ORDER_SOCKET, (sec_cnt) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: DELETE_SECONDARY_CONTACT_ORDER_SOCKET,
          payload: sec_cnt,
        })
      );
    }
  });

  myEmitter.on(UPDATE_STATUS_OF_ORDER_SOCKET, (order) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_STATUS_OF_ORDER_SOCKET,
          payload: order,
        })
      );
    }
  });

  myEmitter.on(UPDATE_PERSON_IN_CHARGE_OF_ORDER_SOCKET, (person_in_charge) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_PERSON_IN_CHARGE_OF_ORDER_SOCKET,
          payload: person_in_charge,
        })
      );
    }
  });

  myEmitter.on(UPDATE_PRODUCT_OF_ORDER_SOCKET, (product_of_order) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_PRODUCT_OF_ORDER_SOCKET,
          payload: product_of_order,
        })
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
          })
        );
      }
    }
  );

  myEmitter.on(UPDATE_ANCHOR_PRODUCT_OF_ORDER_SOCKET, (anchor_product_of_order) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_ANCHOR_PRODUCT_OF_ORDER_SOCKET,
          payload: anchor_product_of_order,
        })
      );
    }
  });

  myEmitter.on(UPDATE_TOOL_PRODUCT_OF_ORDER_SOCKET, (newToolProductsOfOrder) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_TOOL_PRODUCT_OF_ORDER_SOCKET,
          payload: newToolProductsOfOrder,
        })
      );
    }
  });

  myEmitter.on(
    UPDATE_REL_MAT_PRODUCT_OF_ORDER_SOCKET,
    (rel_mat_product_of_order) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: UPDATE_REL_MAT_PRODUCT_OF_ORDER_SOCKET,
            payload: rel_mat_product_of_order,
          })
        );
      }
    }
  );

  myEmitter.on(GET_DELETE_PRODUCT_OF_ORDER_SOCKET, (product_id) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: GET_DELETE_PRODUCT_OF_ORDER_SOCKET,
          payload: product_id,
        })
      );
    }
  });

  myEmitter.on(GET_DELETE_DRY_MIXED_PRODUCT_OF_ORDER_SOCKET, (product_id) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: GET_DELETE_DRY_MIXED_PRODUCT_OF_ORDER_SOCKET,
          payload: product_id,
        })
      );
    }
  });

  myEmitter.on(GET_DELETE_ANCHOR_PRODUCT_OF_ORDER_SOCKET, (product_id) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: GET_DELETE_ANCHOR_PRODUCT_OF_ORDER_SOCKET,
          payload: product_id,
        })
      );
    }
  });

  myEmitter.on(GET_DELETE_TOOL_PRODUCT_OF_ORDER_SOCKET, (product_id) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: GET_DELETE_TOOL_PRODUCT_OF_ORDER_SOCKET,
          payload: product_id,
        })
      );
    }
  });

  myEmitter.on(ADD_NEW_WAREHOUSE_SOCKET, (new_warehouse) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_WAREHOUSE_SOCKET,
          payload: new_warehouse,
        })
      );
    }
  });

  myEmitter.on(ADD_NEW_CLIENT_SOCKET, (client) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_CLIENT_SOCKET,
          payload: client,
        })
      );
    }
  });

  myEmitter.on(UPDATE_CLIENT_SOCKET, (client) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_CLIENT_SOCKET,
          payload: client,
        })
      );
    }
  });

  myEmitter.on(ADD_CLIENTS_LEGAL_ADDRESS_SOCKET, (legalAddress) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_CLIENTS_LEGAL_ADDRESS_SOCKET,
          payload: legalAddress,
        })
      );
    }
  });

  myEmitter.on(UPDATE_LEGAL_ADDRESS_SOCKET, (legalAddress) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_LEGAL_ADDRESS_SOCKET,
          payload: legalAddress,
        })
      );
    }
  });

  myEmitter.on(ADD_CONTACT_INFO_SOCKET, (contactInfo) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_CONTACT_INFO_SOCKET,
          payload: contactInfo,
        })
      );
    }
  });

  myEmitter.on(ADD_DELIVERY_ADDRESSES_SOCKET, (deliveryAddress) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_DELIVERY_ADDRESSES_SOCKET,
          payload: deliveryAddress,
        })
      );
    }
  });

  myEmitter.on(ADD_NEW_BATCH_OUTSIDE_SOCKET, (batchOutside) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_BATCH_OUTSIDE_SOCKET,
          payload: batchOutside,
        })
      );
    }
  });

  myEmitter.on(UPDATE_BATCH_OUTSIDE_SOCKET, (batchOutside) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_BATCH_OUTSIDE_SOCKET,
          payload: batchOutside,
        })
      );
    }
  });

  myEmitter.on(DELETE_BATCH_OUTSIDE_SOCKET, (batch_id) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: DELETE_BATCH_OUTSIDE_SOCKET,
          payload: batch_id,
        })
      );
    }
  });

  myEmitter.on(
    GET_DELETE_PRODUCT_FROM_RESERVED_LIST_SOCKET,
    (reserved_products_id) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: GET_DELETE_PRODUCT_FROM_RESERVED_LIST_SOCKET,
            payload: reserved_products_id,
          })
        );
      }
    }
  );

  myEmitter.on(UPDATE_REMAINING_STOCK_SOCKET, (updWarehouse) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_REMAINING_STOCK_SOCKET,
          payload: updWarehouse,
        })
      );
    }
  });

  myEmitter.on(ADD_NEW_RECIPE_SOCKET, (recipe) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_RECIPE_SOCKET,
          payload: recipe,
        })
      );
    }
  });

  myEmitter.on(DELETE_RECIPE_SOCKET, (recipe_id) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: DELETE_RECIPE_SOCKET,
          payload: recipe_id,
        })
      );
    }
  });

  myEmitter.on(ADD_NEW_FILES_WAREHOUSE_SOCKET, (filesWarehouse) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_FILES_WAREHOUSE_SOCKET,
          payload: filesWarehouse,
        })
      );
    }
  });

  myEmitter.on(DELETE_FILES_WAREHOUSE_SOCKET, (warehouse_id) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: DELETE_FILES_WAREHOUSE_SOCKET,
          payload: warehouse_id,
        })
      );
    }
  });

  myEmitter.on(ADD_NEW_FILES_ORDER_SOCKET, (filesOrder) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_FILES_ORDER_SOCKET,
          payload: filesOrder,
        })
      );
    }
  });

  myEmitter.on(DELETE_FILES_ORDER_SOCKET, (order_id) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: DELETE_FILES_ORDER_SOCKET,
          payload: order_id,
        })
      );
    }
  });

  myEmitter.on(SAVE_MATERIAL_PLAN_SOCKET, (recipeOrders) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: SAVE_MATERIAL_PLAN_SOCKET,
          payload: recipeOrders,
        })
      );
    }
  });

  myEmitter.on(DELETE_MATERIAL_PLAN_SOCKET, (material_plan_id) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: DELETE_MATERIAL_PLAN_SOCKET,
          payload: material_plan_id,
        })
      );
    }
  });

  myEmitter.on(ADD_NEW_FILES_PRODUCT_SOCKET, (filesProduct) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_FILES_PRODUCT_SOCKET,
          payload: filesProduct,
        })
      );
    }
  });

  myEmitter.on(DELETE_FILES_PRODUCT_SOCKET, (product_id) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: DELETE_FILES_PRODUCT_SOCKET,
          payload: product_id,
        })
      );
    }
  });

  myEmitter.on(ADD_NEW_STOCK_BALANCE_SOCKET, (newStockBalance) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_STOCK_BALANCE_SOCKET,
          payload: newStockBalance,
        })
      );
    }
  });

  myEmitter.on(ADD_NEW_DRY_MIXES_JOURNAL_SOCKET, (dryMixesJournal) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_DRY_MIXES_JOURNAL_SOCKET,
          payload: dryMixesJournal,
        })
      );
    }
  });

  myEmitter.on(UPDATE_DRY_MIXES_JOURNAL_SOCKET, (dryMixesJournal) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_DRY_MIXES_JOURNAL_SOCKET,
          payload: dryMixesJournal,
        })
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
          })
        );
      }
    }
  );

  myEmitter.on(
    UPDATE_RELATED_MATERIALS_JOURNAL_SOCKET,
    (relatedMaterialsJournal) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: UPDATE_RELATED_MATERIALS_JOURNAL_SOCKET,
            payload: relatedMaterialsJournal,
          })
        );
      }
    }
  );

  myEmitter.on(ADD_NEW_ANCHOR_SOCKET, (anchor) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_ANCHOR_SOCKET,
          payload: anchor,
        })
      );
    }
  });

  myEmitter.on(UPDATE_ANCHOR_SOCKET, (anchor) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_ANCHOR_SOCKET,
          payload: anchor,
        })
      );
    }
  });

  myEmitter.on(ADD_NEW_TOOL_SOCKET, (tool) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_TOOL_SOCKET,
          payload: tool,
        })
      );
    }
  });

  myEmitter.on(UPDATE_TOOL_SOCKET, (tool) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_TOOL_SOCKET,
          payload: tool,
        })
      );
    }
  });

  myEmitter.on(ADD_NEW_DRY_MIXES_WAREHOUSE_SOCKET, (dryMixesWarehouse) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_DRY_MIXES_WAREHOUSE_SOCKET,
          payload: dryMixesWarehouse,
        })
      );
    }
  });

  myEmitter.on(UPDATE_DRY_MIXES_WAREHOUSE_SOCKET, (dryMixesWarehouse) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_DRY_MIXES_WAREHOUSE_SOCKET,
          payload: dryMixesWarehouse,
        })
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
          })
        );
      }
    }
  );

  myEmitter.on(
    UPDATE_RELATED_MATERIALS_WAREHOUSE_SOCKET,
    (relatedMaterialsWarehouse) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: UPDATE_RELATED_MATERIALS_WAREHOUSE_SOCKET,
            payload: relatedMaterialsWarehouse,
          })
        );
      }
    }
  );

  myEmitter.on(ADD_NEW_ANCHORS_WAREHOUSE_SOCKET, (anchorsWarehouse) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_ANCHORS_WAREHOUSE_SOCKET,
          payload: anchorsWarehouse,
        })
      );
    }
  });

  myEmitter.on(UPDATE_ANCHORS_WAREHOUSE_SOCKET, (anchorsWarehouse) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_ANCHORS_WAREHOUSE_SOCKET,
          payload: anchorsWarehouse,
        })
      );
    }
  });

  myEmitter.on(ADD_NEW_TOOLS_WAREHOUSE_SOCKET, (toolsWarehouse) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_TOOLS_WAREHOUSE_SOCKET,
          payload: toolsWarehouse,
        })
      );
    }
  });

  myEmitter.on(UPDATE_TOOLS_WAREHOUSE_SOCKET, (toolsWarehouse) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_TOOLS_WAREHOUSE_SOCKET,
          payload: toolsWarehouse,
        })
      );
    }
  });

  myEmitter.on(ADD_NEW_QUALITY_MANAGEMENT_DATA_SOCKET, (qualityManagementData) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: ADD_NEW_QUALITY_MANAGEMENT_DATA_SOCKET,
          payload: qualityManagementData,
        })
      );
    }
  });

  myEmitter.on(UPDATE_QUALITY_MANAGEMENT_DATA_SOCKET, (qualityManagementData) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_QUALITY_MANAGEMENT_DATA_SOCKET,
          payload: qualityManagementData,
        })
      );
    }
  });

  myEmitter.on(DELETE_QUALITY_MANAGEMENT_DATA_SOCKET, (qualityManagementDataID) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: DELETE_QUALITY_MANAGEMENT_DATA_SOCKET,
          payload: qualityManagementDataID,
        })
      );
    }
  });

  myEmitter.on(
    ADD_NEW_RELATED_MATERIALS_BACKORDER_SOCKET,
    (relatedMaterialsBackorderList) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: ADD_NEW_RELATED_MATERIALS_BACKORDER_SOCKET,
            payload: relatedMaterialsBackorderList,
          })
        );
      }
    }
  );

  myEmitter.on(
    UPDATE_RELATED_MATERIALS_BACKORDER_SOCKET,
    (relatedMaterialsBackorderList) => {
      for (let [id, userConnect] of map) {
        userConnect.send(
          JSON.stringify({
            type: UPDATE_RELATED_MATERIALS_BACKORDER_SOCKET,
            payload: relatedMaterialsBackorderList,
          })
        );
      }
    }
  );

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
