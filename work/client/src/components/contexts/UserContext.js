import { createContext, useContext, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';

const UsersContext = createContext();

export const UsersContextProvider = ({ children }) => {
  const [userAccess, setUserAccess] = useState(null);
  const roles = useSelector(state => state.roles);

  const checkUserAccess = (user, roles, pageName) => {
    if (user?.role === 3) return { canRead: true, canWrite: true };
    const userRole = roles.find(role => role.id === user?.role);
    if (!userRole || !userRole.isActive) {
      return { canRead: false, canWrite: false };
    }
    const pagePermissions = userRole?.PageAndRolesArray?.find(
      page => page.page_name === pageName
    );
    if (!pagePermissions) {
      return { canRead: false, canWrite: false };
    }
    return {
      canRead: pagePermissions.PageAndRoles.read,
      canWrite: pagePermissions.PageAndRoles.write,
    };
  };

  return (
    <UsersContext.Provider value={{ roles, checkUserAccess, userAccess, setUserAccess }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsersContext = () => useContext(UsersContext);
