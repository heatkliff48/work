import { ALL_ROLES } from '../types/rolesTypes';
import {
  UPDATE_ROLE_ACTIVE_SOCKET,
  UPDATE_ROLE_SOCKET,
} from '../types/socketTypes/socket';

export const rolesReducer = (roles = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case ALL_ROLES: {
      return payload;
    }

    case UPDATE_ROLE_SOCKET: {
      if (!payload || payload.length === 0) return roles;

      const updRole = roles.map((role) => {
        if (role.id === payload[0].role_id) {
          return {
            ...role,
            PageAndRolesArray: role.PageAndRolesArray.map((pageItem) => {
              const updatedPageAndRoles = payload.find(
                (p) => p.page_id === pageItem.id
              );

              if (updatedPageAndRoles) {
                return {
                  ...pageItem,
                  PageAndRoles: {
                    ...pageItem.PageAndRoles,
                    ...updatedPageAndRoles,
                  },
                };
              }

              return pageItem;
            }),
          };
        }

        return role;
      });

      return updRole;
    }

    case UPDATE_ROLE_ACTIVE_SOCKET: {
      return payload;
    }

    default:
      return roles;
  }
};
