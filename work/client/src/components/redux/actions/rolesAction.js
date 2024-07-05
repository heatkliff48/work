import { GET_ALL_ROLES, NEED_UPDATE_ROLE } from '../types/rolesTypes';

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
