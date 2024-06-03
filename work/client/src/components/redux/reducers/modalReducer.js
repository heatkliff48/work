import { SET_MODAL } from '../types/modalTypes';

export const modalReducer = (modal = false, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_MODAL:
      return payload;

    default:
      return modal;
  }
};
