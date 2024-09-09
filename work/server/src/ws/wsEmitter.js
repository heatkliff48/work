const {
  ADD_NEW_PRODUCT_SOCKET,
  UPDATE_PRODUCT_SOCKET,
  UPDATE_ROLE_SOCKET,
  UPDATE_ROLE_ACTIVE_SOCKET,
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
