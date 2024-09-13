import {
  GET_ADD_USER,
  GET_CHECK_USER,
  GET_DEL_USER,
  GET_LOGIN_USER,
} from '../types/userTypes';

export const addUser = (user) => {
  return {
    type: GET_ADD_USER,
    payload: user,
  };
};

export const loginUser = (user) => {
  return {
    type: GET_LOGIN_USER,
    payload: user,
  };
};

export const checkUser = () => {
  return {
    type: GET_CHECK_USER,
  };
};

export const delUser = () => {
  return {
    type: GET_DEL_USER,
  };
};
