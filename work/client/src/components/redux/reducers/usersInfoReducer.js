import {
  ALL_USERS_INFO,
  NEW_USERS_INFO,
  UPDATE_USERS_INFO,
  ALL_USERS_MAIN_INFO,
  NEW_USERS_MAIN_INFO,
  UPDATE_USERS_MAIN_INFO,
} from '../types/usersInfoTypes';

export const usersInfoReducer = (usersInfo = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case ALL_USERS_INFO: {
      return payload;
    }
    case NEW_USERS_INFO: {
      return [...usersInfo, payload];
    }
    case UPDATE_USERS_INFO: {
      const updateUsersInfo = usersInfo.map((el) => {
        if (el.id === payload[1].id) return payload[1];
        return el;
      });
      return updateUsersInfo;
      // return [...usersInfo, payload];
    }
    default:
      return usersInfo;
  }
};

export const usersMainInfoReducer = (usersMainInfo = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case ALL_USERS_MAIN_INFO: {
      return payload;
    }
    case NEW_USERS_MAIN_INFO: {
      return [...usersMainInfo, payload];
    }
    case UPDATE_USERS_MAIN_INFO: {
      const updateUsersMainInfo = usersMainInfo.map((el) => {
        if (el.id === payload[1].id) return payload[1];
        return el;
      });
      return updateUsersMainInfo;
      // return [...usersMainInfo, payload];
    }
    default:
      return usersMainInfo;
  }
};
