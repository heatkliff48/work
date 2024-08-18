import {
  GET_ALL_USERS_INFO,
  ADD_NEW_USERS_INFO,
  NEED_UPDATE_USERS_INFO,
  GET_ALL_USERS_MAIN_INFO,
  ADD_NEW_USERS_MAIN_INFO,
  NEED_UPDATE_USERS_MAIN_INFO,
} from '../types/usersInfoTypes';

export const getAllUsersInfo = () => {
  return {
    type: GET_ALL_USERS_INFO,
  };
};

export const addNewUsersInfo = ({ usersInfo }) => {
  return {
    type: ADD_NEW_USERS_INFO,
    payload: { usersInfo },
  };
};

export const updateUsersInfo = ({ usersInfo }) => {
  return {
    type: NEED_UPDATE_USERS_INFO,
    payload: { usersInfo },
  };
};

export const getAllUsersMainInfo = () => {
  return {
    type: GET_ALL_USERS_MAIN_INFO,
  };
};

export const addNewUsersMainInfo = ({ usersMainInfo }) => {
  return {
    type: ADD_NEW_USERS_MAIN_INFO,
    payload: { usersMainInfo },
  };
};

export const updateUsersMainInfo = ({ usersMainInfo }) => {
  return {
    type: NEED_UPDATE_USERS_MAIN_INFO,
    payload: { usersMainInfo },
  };
};
