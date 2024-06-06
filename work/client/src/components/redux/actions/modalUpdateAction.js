import { SET_UPDATE_MODAL } from '../types/modalTypes';

export const setUpdateModalWindow = (bool) => {
  return {
    type: SET_UPDATE_MODAL,
    payload: bool,
  };
};
