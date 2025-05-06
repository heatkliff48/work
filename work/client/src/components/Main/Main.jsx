// import axios from 'axios';

import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
// import { dataFetchedChange } from '#components/redux/actions/userAction.js';
import { clearBatchState } from '#components/redux/actions/batchDesignerAction.js';
import { getAllDeliveryAddresses } from '#components/redux/actions/clientAction.js';
import {
  getAccountingDataList,
  getAnchorProductsOfOrders,
  getDryMixedProductsOfOrders,
  getOrders,
  getProductsOfOrders,
  getToolProductsOfOrders,
} from '#components/redux/actions/ordersAction.js';
import { getAllProducts } from '#components/redux/actions/productsAction.js';
import {
  getAnchor,
  getDryMixesJournal,
  getRelatedMaterialsJournal,
  getTool,
} from '#components/redux/actions/productsTypeJournalAction.js';
import { getRecipeOrdersData } from '#components/redux/actions/recipeAction.js';
import { getAllRoles } from '#components/redux/actions/rolesAction.js';
import { getAllStockBalance } from '#components/redux/actions/stockBalanceAction.js';
import {
  getAllWarehouse,
  getListOfOrderedProduction,
  getListOfOrderedProductionOEM,
  getListOfReservedProducts,
} from '#components/redux/actions/warehouseAction.js';
import { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Main() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  // const dataFetched = useSelector((state) => state.dataFetched);
  const { setStoredData } = useOrderContext();
  const { roles, checkUserAccess } = useUsersContext();

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
    }
  }, [user]);

  useEffect(() => {
    dispatch(getAllRoles());
    dispatch(getAllProducts());
    dispatch(getDryMixesJournal());
    dispatch(getRelatedMaterialsJournal());
    dispatch(getAnchor());
    dispatch(getTool());
    dispatch(getAllWarehouse());
    dispatch(getProductsOfOrders());
    dispatch(getDryMixedProductsOfOrders());
    dispatch(getAnchorProductsOfOrders());
    dispatch(getToolProductsOfOrders());
    dispatch(getListOfReservedProducts());
    dispatch(getListOfOrderedProduction());
    dispatch(getListOfOrderedProductionOEM());
    dispatch(getOrders());
    dispatch(getRecipeOrdersData());
    dispatch(clearBatchState());
    dispatch(getAllStockBalance());
    setStoredData(null);
    //dispatch(dataFetchedChange(true));
  }, []);

  return (
    <div className="main-container">
      <h1 className="main-title">Main Page</h1>
      <div className="button-container">
        <button
          className="nav-button"
          onClick={() => navigate('/warehouse_manager')}
        >
          Warehouse Manager
        </button>

        {checkUserAccess(user, roles, 'Roles')?.canRead && (
          <button className="nav-button" onClick={() => navigate('/roles')}>
            Roles
          </button>
        )}
        {checkUserAccess(user, roles, 'Products')?.canRead && (
          <button
            className="nav-button"
            onClick={() => navigate('/products_type_journal')}
          >
            Products Type Journal
          </button>
        )}
        <button className="nav-button" onClick={() => navigate('/statistics')}>
          Statistics
        </button>

        {checkUserAccess(user, roles, 'Orders')?.canRead && (
          <button className="nav-button" onClick={() => navigate('/orders')}>
            Orders
          </button>
        )}
        {checkUserAccess(user, roles, 'Orders')?.canRead && (
          <button className="nav-button" onClick={() => navigate('/accounting')}>
            Accounting
          </button>
        )}
        {checkUserAccess(user, roles, 'Clients')?.canRead && (
          <button className="nav-button" onClick={() => navigate('/clients')}>
            Clients
          </button>
        )}
        {checkUserAccess(user, roles, 'Warehouse')?.canRead && (
          <button
            className="nav-button"
            onClick={() => navigate('/warehouse_products_type')}
          >
            Warehouse
          </button>
        )}
        {checkUserAccess(user, roles, 'Users_info')?.canRead && (
          <button className="nav-button" onClick={() => navigate('/users_info')}>
            Users Info
          </button>
        )}
        {/* {checkUserAccess(user, roles, 'Production_batch_log')?.canRead && (
        <button className="nav-button" onClick={() => navigate('/production_batch_log')}>
          Production Batch Log 
        </button>
      )} */}
        {checkUserAccess(user, roles, 'production_batch_designer')?.canRead && (
          <button
            className="nav-button"
            onClick={() => navigate('/production_batch_designer')}
          >
            Production Batch Designer
          </button>
        )}
        {checkUserAccess(user, roles, 'List_of_ordered_production')?.canRead && (
          <button
            className="nav-button"
            onClick={() => navigate('/list_of_ordered_production')}
          >
            List of ordered production
          </button>
        )}
        {checkUserAccess(user, roles, 'list_of_ordered_production_oem')?.canRead && (
          <button
            className="nav-button"
            onClick={() => navigate('/list_of_ordered_production_oem')}
          >
            List of ordered production OEM
          </button>
        )}
        {checkUserAccess(user, roles, 'batch_outside')?.canRead && (
          <button className="nav-button" onClick={() => navigate('/batch_outside')}>
            Production Plan
          </button>
        )}
        {checkUserAccess(user, roles, 'recipe_products')?.canRead && (
          <button
            className="nav-button"
            onClick={() => navigate('/recipe_products')}
          >
            Recipe Products
          </button>
        )}
        {checkUserAccess(user, roles, 'raw_materials_plan')?.canRead && (
          <button
            className="nav-button"
            onClick={() => navigate('/raw_materials_plan')}
          >
            Raw Materials Plan
          </button>
        )}
        {checkUserAccess(user, roles, 'recipe_orders')?.canRead && (
          <button className="nav-button" onClick={() => navigate('/recipe_orders')}>
            Recipe Orders
          </button>
        )}
        {/* {checkUserAccess(user, roles, 'quality_management')?.canRead && ( */}
        <button
          className="nav-button"
          onClick={() => navigate('/quality_management')}
        >
          Quality Management
        </button>
        {/* )} */}
      </div>
    </div>
  );
}
export default Main;
