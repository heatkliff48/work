const {
  ADD_NEW_PRODUCT_SOCKET,
  UPDATE_PRODUCT_SOCKET,
  UPDATE_ROLE_SOCKET,
  UPDATE_ROLE_ACTIVE_SOCKET,
  ADD_NEW_ORDER_SOCKET,
  ADD_DATASHIP_ORDER_SOCKET,
  UPDATE_PRODUCT_OF_ORDER_SOCKET,
  GET_DELETE_PRODUCT_OF_ORDER_SOCKET,
  GET_DELETE_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  UPDATE_REMAINING_STOCK_SOCKET,
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
