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
      // сервер присылает роль целиком, вместе с PageAndRolesArray
      if (!payload?.id) return roles;
      return roles.map((role) => (role.id === payload.id ? payload : role));
    }

    case UPDATE_ROLE_ACTIVE_SOCKET: {
      // здесь приходят роли без PageAndRolesArray — берём из них только флаг,
      // иначе у всех пропадут права на страницы
      if (!Array.isArray(payload)) return roles;
      return roles.map((role) => {
        const updRole = payload.find((el) => el?.id === role.id);
        return updRole ? { ...role, isActive: updRole.isActive } : role;
      });
    }

    default:
      return roles;
  }
};
