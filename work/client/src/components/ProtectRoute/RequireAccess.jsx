import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUsersContext } from '#components/contexts/UserContext.js';

// Пускает на страницу только при праве read на её аксессор (см. PAGE_ACCESS)
const RequireAccess = () => {
  const { pathname } = useLocation();
  const { roles, canOpenPath } = useUsersContext();

  // пока роли не загружены, не выкидываем пользователя раньше времени
  if (roles.length && !canOpenPath(pathname)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RequireAccess;
