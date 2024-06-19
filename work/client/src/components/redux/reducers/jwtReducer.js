import { SET_JWT_TOKEN } from '../types/jwtTypes';

export const jwtReducer = (jwt = null, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_JWT_TOKEN: {
      return payload;
    }
    default:
      return jwt;
  }
};
