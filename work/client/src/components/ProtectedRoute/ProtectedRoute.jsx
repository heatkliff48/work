import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useSelector } from 'react-redux';

function ProtectedRoute() {
  const location = useLocation();

  const user = useSelector((state) => state.user);
  const authChecked = useSelector((state) => state.authChecked);

  if (!authChecked) {
    return <div>Проверка авторизации...</div>;
  }

  if (!user) {
    return (
      <Navigate
        to="/sign-in"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;
