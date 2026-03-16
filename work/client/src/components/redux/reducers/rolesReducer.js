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
      const targetRoleId = payload[0]?.role_id;

      if (!targetRoleId) return roles;

      const updRole = roles.map((role) => {
        if (role.id === targetRoleId) {
          return {
            ...role,
            PageAndRolesArray: payload.map((p) => ({
              id: p.page_id,
              PageAndRoles: {
                page_id: p.page_id,
                role_id: p.role_id,
                read: p.read,
                write: p.write,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
              },
            })),
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
