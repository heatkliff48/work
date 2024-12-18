import {
  NEW_AUTOCLAVE,
  NEW_SAVE_AUTOCLAVE,
  SET_AUTOCLAVE,
} from '../types/autoclaveTypes';

export const autoclaveReducer = (autoclave = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_AUTOCLAVE: {
      return payload?.sort((a, b) => a.id - b.id) ?? autoclave;
    }

    case NEW_SAVE_AUTOCLAVE: {
      return payload;
    }

    case NEW_AUTOCLAVE: {
      return payload;
    }

    default:
      return autoclave;
  }
};
