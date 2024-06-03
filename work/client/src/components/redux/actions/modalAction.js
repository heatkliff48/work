import { SET_MODAL } from '../types/modalTypes';

export const setModalWindow = (bool) => {
  return {
    type: SET_MODAL,
    payload: bool,
  };
};
