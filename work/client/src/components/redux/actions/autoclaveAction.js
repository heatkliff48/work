import { GET_AUTOCLAVE, SAVE_AUTOCLAVE, UPDATE_AUTOCLAVE } from '../types/autoclaveTypes';

export const getAutoclave = () => {
  return {
    type: GET_AUTOCLAVE,
  };
};

export const saveAutoclave = (autoclave) => {
  return {
    type: SAVE_AUTOCLAVE,
    payload: autoclave,
  };
};

export const updateAutoclave = (list_of_order_id) => {
  return {
    type: UPDATE_AUTOCLAVE,
    payload: list_of_order_id,
  };
};
