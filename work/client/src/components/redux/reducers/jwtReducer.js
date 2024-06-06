import {
  SET_GWT_TOKEN,
} from '../types/jwtTypes';

export const jwtReducer = (jwt = null, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_GWT_TOKEN: {
      console.log("JWT", action);
      return payload;
    }
    default:
      return jwt;
  }
};
