import { GET_AUTOCLAVE, SAVE_AUTOCLAVE } from '../types/autoclaveTypes';

export const getAutoclave = () => {
  return {
    type: GET_AUTOCLAVE,
  };
};

export const saveAutoclave = (autoclave) => {
  console.log('ACTION AUTOCLAVE', autoclave);
  return {
    type: SAVE_AUTOCLAVE,
    payload: autoclave,
  };
};
