import { NEW_SAVE_AUTOCLAVE, SET_AUTOCLAVE } from '../types/autoclaveTypes';

export const autoclaveReducer = (autoclave = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_AUTOCLAVE: {
      return payload?.sort((a, b) => a.id - b.id) ?? autoclave;
    }

    case NEW_SAVE_AUTOCLAVE: {
      console.log('REDUCER AUTOCLAVE', payload);
      return payload?.sort((a, b) => a - b);
    }

    default:
      return autoclave;
  }
};
