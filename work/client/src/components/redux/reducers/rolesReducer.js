import { ALL_ROLES, UPDATE_ROLE } from '../types/rolesTypes';

export const rolesReducer = (roles = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case ALL_ROLES: {
      return payload;
    }

    case UPDATE_ROLE: {
      console.log('UPD REDUCER', payload);
      if (!payload || payload.length === 0) return roles;
      const updRole = roles.map((role) => {
        if (role.id === payload[0].role_id) {
          // Обновляем роль, которая соответствует role_id из первого элемента payload
          return {
            ...role,
            PageAndRolesArray: role.PageAndRolesArray.map((pageItem) => {
              const updatedPageAndRoles = payload.find(
                (p) => p.page_id === pageItem.id
              );
              if (updatedPageAndRoles) {
                // Если нашли обновление для этой страницы, применяем его
                return {
                  ...pageItem,
                  PageAndRoles: {
                    ...pageItem.PageAndRoles,
                    ...updatedPageAndRoles,
                  },
                };
              }
              return pageItem; // Возвращаем неизмененную страницу, если для нее нет обновлений
            }),
          };
        }
        return role; // Возвращаем неизмененную роль, если id не совпадает
      });
      console.log('updRole', updRole);

      return updRole;
    }

    default:
      return roles;
  }
};
