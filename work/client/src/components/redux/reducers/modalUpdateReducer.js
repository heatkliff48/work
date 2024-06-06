import { SET_UPDATE_MODAL } from '../types/modalTypes';

export const modalUpdateReducer = (modal = false, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_UPDATE_MODAL:
      return payload;

    default:
      return modal;
  }
};
