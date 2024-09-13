import {
  ADD_DATASHIP_ORDER_SOCKET,
  DATASHIP_ORDER_SOCKET,
  NEW_ORDER_SOCKET,
} from '#components/redux/types/socketTypes/socket.js';

export const addNewOrderSocket = (newOrder) => {
  return {
    type: NEW_ORDER_SOCKET,
    payload: newOrder,
  };
};

export const addDatashipOrderSocket = (date) => {
  return {
    type: DATASHIP_ORDER_SOCKET,
    payload: date,
  };
};

// export const updateOrderSocket = (products) => {
//   return {
//     type: NEW_ORDER_SOCKET,
//     payload: products,
//   };
// };
