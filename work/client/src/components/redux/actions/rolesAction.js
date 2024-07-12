import {
  GET_ALL_ROLES,
  NEED_UPDATE_ROLE,
  NEED_UPDATE_ROLE_ACTIVE,
} from '../types/rolesTypes';

export const getAllRoles = () => {
  return {
    type: GET_ALL_ROLES,
  };
};

export const updateRoles = ({ updRole }) => {
  return {
    type: NEED_UPDATE_ROLE,
    payload: { updRole },
  };
};

export const updateRoleActive = ({ updActiveRole }) => {
  return {
    type: NEED_UPDATE_ROLE_ACTIVE,
    payload: { updActiveRole },
  };
};
