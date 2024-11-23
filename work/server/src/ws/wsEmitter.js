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
  GET_DELETE_PRODUCT_OF_ORDER_SOCKET,
  GET_DELETE_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  UPDATE_REMAINING_STOCK_SOCKET,
  UPDATE_STATUS_OF_ORDER_SOCKET,
  ADD_NEW_WAREHOUSE_SOCKET,
  ADD_NEW_RECIPE_SOCKET,
  DELETE_RECIPE_SOCKET,
  ADD_NEW_FILES_WAREHOUSE_SOCKET,
  DELETE_FILES_WAREHOUSE_SOCKET,
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

  myEmitter.on(UPDATE_REMAINING_STOCK_SOCKET, (upd_rem_srock) => {
    for (let [id, userConnect] of map) {
      userConnect.send(
        JSON.stringify({
          type: UPDATE_REMAINING_STOCK_SOCKET,
          payload: upd_rem_srock,
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
