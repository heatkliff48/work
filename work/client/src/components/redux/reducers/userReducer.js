import { ADD_USER, CHECK_USER, DEL_USER, LOGIN_USER } from '../types/userTypes';

export const userReducer = (user = null, action) => {
  const { type, payload } = action;

  switch (type) {
    case ADD_USER:
    case CHECK_USER:
    case DEL_USER:
    case LOGIN_USER:
      return payload;

    default:
      return user;
  }
};

export const authCheckedReducer = (authChecked = false, action) => {
  switch (action.type) {
    case ADD_USER:
    case CHECK_USER:
    case DEL_USER:
    case LOGIN_USER:
      return true;

    default:
      return authChecked;
  }
};
