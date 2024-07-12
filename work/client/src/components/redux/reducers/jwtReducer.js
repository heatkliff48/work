import { DELETE_JWT_TOKEN, SET_JWT_TOKEN } from '../types/jwtTypes';

export const jwtReducer = (jwt = null, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_JWT_TOKEN: {
      console.log('REDUCER TOKEN', payload);
      return payload ?? jwt;
    }
    case DELETE_JWT_TOKEN: {
      return null;
    }
    default:
      return jwt;
  }
};
