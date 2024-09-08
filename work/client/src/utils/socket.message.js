import { addNewProductSocket } from '#components/redux/actions/socketActions/productActionSocket.js';
import { ADD_NEW_PRODUCT_SOCKET } from '#components/redux/types/constants/socket.js';

export const createSocketOnMessage = (dispatch) => (event) => {
  const parsedData = JSON.parse(event.data);

  switch (parsedData.type) {
    case ADD_NEW_PRODUCT_SOCKET:
      dispatch(addNewProductSocket(parsedData.payload));
      break;

    default:
      break;
  }
};
