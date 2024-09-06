// import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useProjectContext } from '#components/contexts/Context.js';

function Main() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const { roles, checkUserAccess } = useProjectContext();

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
    }
  }, [navigate, user]);

  return (
    <div>
      <p>MAIN PAGE</p>
      {checkUserAccess(user, roles, 'Products')?.canRead && (
        <button onClick={() => navigate('/products')}>Products</button>
      )}
      {checkUserAccess(user, roles, 'Orders')?.canRead && (
        <button onClick={() => navigate('/orders')}>Orders</button>
      )}
      {checkUserAccess(user, roles, 'Clients')?.canRead && (
        <button onClick={() => navigate('/clients')}>Clients</button>
      )}
      {checkUserAccess(user, roles, 'Warehouse')?.canRead && (
        <button onClick={() => navigate('/warehouse')}>Warehouse</button>
      )}
      {checkUserAccess(user, roles, 'Users_info')?.canRead && (
        <button onClick={() => navigate('/users_info')}>Users Info</button>
      )}
      {checkUserAccess(user, roles, 'Production_batch_log')?.canRead && (
        <button onClick={() => navigate('/production_batch_log')}>
          Production Batch Log
        </button>
      )}
      <button onClick={() => navigate('/list_of_ordered_production')}>
        List of ordered production
      </button>
      <button onClick={() => navigate('/list_of_ordered_production_oem')}>
        List of ordered production OEM
      </button>
    </div>
  );
}
export default Main;
