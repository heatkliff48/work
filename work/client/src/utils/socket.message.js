import {
  addDatashipOrderSocket,
  addNewOrderSocket,
  addNewProductSocket,
  deeleteProductOfOrderSocket,
  updateProductSocket,
  updateRolesActiveSocket,
  updateRolesSocket,
  updProductOfOrderSocket,
} from '#components/redux/actions/socketActions/socketAction.js';

import {
  ADD_DATASHIP_ORDER_SOCKET,
  ADD_NEW_ORDER_SOCKET,
  ADD_NEW_PRODUCT_SOCKET,
  GET_DELETE_PRODUCT_OF_ORDER_SOCKET,
  UPDATE_PRODUCT_OF_ORDER_SOCKET,
  UPDATE_PRODUCT_SOCKET,
  UPDATE_ROLE_ACTIVE_SOCKET,
  UPDATE_ROLE_SOCKET,
} from '#components/redux/types/socketTypes/socket.js';

export const createSocketOnMessage = (dispatch) => (event) => {
  const parsedData = JSON.parse(event.data);
  const { type, payload } = parsedData;

  switch (type) {
    case ADD_NEW_PRODUCT_SOCKET:
      dispatch(addNewProductSocket(payload));
      break;

    case UPDATE_PRODUCT_SOCKET:
      dispatch(updateProductSocket(payload));
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

    case UPDATE_PRODUCT_OF_ORDER_SOCKET:
      dispatch(updProductOfOrderSocket(payload));
      break;

    case GET_DELETE_PRODUCT_OF_ORDER_SOCKET:
      dispatch(deeleteProductOfOrderSocket(payload));
      break;

    case ADD_DATASHIP_ORDER_SOCKET:
      dispatch(addDatashipOrderSocket(payload));
      break;

    default:
      break;
  }
};
