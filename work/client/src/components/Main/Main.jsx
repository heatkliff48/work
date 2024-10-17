// import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRoles } from '#components/redux/actions/rolesAction.js';
import { getAllProducts } from '#components/redux/actions/productsAction.js';
import {
  getAllWarehouse,
  getListOfOrderedProduction,
  getListOfOrderedProductionOEM,
  getListOfReservedProducts,
} from '#components/redux/actions/warehouseAction.js';
import {
  getOrders,
  getProductsOfOrders,
} from '#components/redux/actions/ordersAction.js';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';

function Main() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const { roles, checkUserAccess } = useUsersContext();
  const { modalRoleCard } = useModalContext();
  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
    }
    dispatch(getAllRoles());
    dispatch(getAllProducts());
    dispatch(getAllWarehouse());
    dispatch(getProductsOfOrders());
    dispatch(getListOfReservedProducts());
    dispatch(getListOfOrderedProduction());
    dispatch(getListOfOrderedProductionOEM());
    dispatch(getOrders());
  }, [navigate, user, modalRoleCard]);

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
      {/* {checkUserAccess(user, roles, 'Production_batch_log')?.canRead && (
        <button onClick={() => navigate('/production_batch_log')}>
          Production Batch Log 
        </button>
      )} */}
      <button onClick={() => navigate('/production_batch_designer')}>
        Production Batch Designer
      </button>
      <button onClick={() => navigate('/list_of_ordered_production')}>
        List of ordered production
      </button>
      <button onClick={() => navigate('/list_of_ordered_production_oem')}>
        List of ordered production OEM
      </button>
      <button onClick={() => navigate('/batch_outside')}>Batch Outside</button>
    </div>
  );
}
export default Main;
