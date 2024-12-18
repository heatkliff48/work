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
import { useUsersContext } from '#components/contexts/UserContext.js';
import { clearBatchState } from '#components/redux/actions/batchDesignerAction.js';
import { getRecipeOrdersData } from '#components/redux/actions/recipeAction.js';
import { dataFetchedChange } from '#components/redux/actions/userAction.js';

function Main() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const dataFetched = useSelector((state) => state.dataFetched);

  const { roles, checkUserAccess } = useUsersContext();
  // useEffect(() => {
  //   if (!user) {
  //     navigate('/sign-in');
  //   }
  // }, [user]);

  // useEffect(() => {
  //   if (!dataFetched) {
  //     Promise.all([
  //       dispatch(getAllRoles()),
  //       dispatch(getAllProducts()),
  //       dispatch(getAllWarehouse()),
  //       dispatch(getProductsOfOrders()),
  //       dispatch(getListOfReservedProducts()),
  //       dispatch(getListOfOrderedProduction()),
  //       dispatch(getListOfOrderedProductionOEM()),
  //       dispatch(getOrders()),
  //       dispatch(getRecipeOrdersData()),
  //     ]).then(() => {
  //       // Обновите флаг после завершения запросов
  //       dispatch(dataFetchedChange(true));
  //     });
  //   }
  //   dispatch(clearBatchState());
  // }, []);

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
    dispatch(getRecipeOrdersData());
    dispatch(clearBatchState());
    //dispatch(dataFetchedChange(true));
  }, [user]);

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
      {checkUserAccess(user, roles, 'production_batch_designer')?.canRead && (
        <button onClick={() => navigate('/production_batch_designer')}>
          Production Batch Designer
        </button>
      )}
      {checkUserAccess(user, roles, 'List_of_ordered_production')?.canRead && (
        <button onClick={() => navigate('/list_of_ordered_production')}>
          List of ordered production
        </button>
      )}
      {checkUserAccess(user, roles, 'list_of_ordered_production_oem')?.canRead && (
        <button onClick={() => navigate('/list_of_ordered_production_oem')}>
          List of ordered production OEM
        </button>
      )}
      {checkUserAccess(user, roles, 'batch_outside')?.canRead && (
        <button onClick={() => navigate('/batch_outside')}>Batch Outside</button>
      )}
      {checkUserAccess(user, roles, 'recipe_products')?.canRead && (
        <button onClick={() => navigate('/recipe_products')}>Recipe Products</button>
      )}
      {checkUserAccess(user, roles, 'raw_materials_plan')?.canRead && (
        <button onClick={() => navigate('/raw_materials_plan')}>
          Raw Materials Plan
        </button>
      )}
      {checkUserAccess(user, roles, 'recipe_orders')?.canRead && (
        <button onClick={() => navigate('/recipe_orders')}>Recipe Orders</button>
      )}
    </div>
  );
}
export default Main;
