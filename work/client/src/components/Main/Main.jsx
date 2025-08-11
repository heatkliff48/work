import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { clearBatchState } from '#components/redux/actions/batchDesignerAction.js';
import { getBatchOutside } from '#components/redux/actions/batchOutsideAction.js';
import {
  getAllClients,
  getAllContactInfo,
  getAllDeliveryAddresses,
} from '#components/redux/actions/clientAction.js';
import {
  getAccountingDataList,
  getAnchorProductsOfOrders,
  getDryMixedProductsOfOrders,
  getOrders,
  getProductsOfOrders,
  getToolProductsOfOrders,
  getRelMatProductsOfOrders,
} from '#components/redux/actions/ordersAction.js';
import { getAllProducts } from '#components/redux/actions/productsAction.js';
import {
  getAnchor,
  getDryMixesJournal,
  getProductCode,
  getRelatedMaterialsJournal,
  getTool,
} from '#components/redux/actions/productsTypeJournalAction.js';
import {
  getAnchorsWarehouse,
  getDryMixesWarehouse,
  getRelatedMaterialsWarehouse,
  getToolsWarehouse,
} from '#components/redux/actions/productsTypeWarehouseAction.js';
import {
  getRecipe,
  getRecipeOrdersData,
} from '#components/redux/actions/recipeAction.js';
import { getRelatedMaterialsBackorder } from '#components/redux/actions/relatedMaterialsBackorderListAction.js';
import { getAllRoles } from '#components/redux/actions/rolesAction.js';
import { getAllStockBalance } from '#components/redux/actions/stockBalanceAction.js';
import {
  getAllWarehouse,
  getListOfAnchorReservedProducts,
  getListOfDryMixedReservedProducts,
  getListOfOrderedProduction,
  getListOfOrderedProductionOEM,
  getListOfRelMatReservedProducts,
  getListOfReservedProducts,
  getListOfToolReservedProducts,
} from '#components/redux/actions/warehouseAction.js';
import { getFilesWarehouse } from '#components/redux/actions/filesWarehouseAction.js';
import { getFilesProduct } from '#components/redux/actions/filesProductAction.js';
import { getFilesOrder } from '#components/redux/actions/filesOrderAction.js';
import { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllProductionBatchLogs } from '#components/redux/actions/productionBatchLogAction.js';
import { getQualityManagement } from '#components/redux/actions/qualityManagementAction.js';
import { getPagesList } from '#components/redux/actions/pagesAction';
import {
  getAllUsersInfo,
  getAllUsersMainInfo,
} from '#components/redux/actions/usersInfoAction';
import { getAldabaran } from '#components/redux/actions/aldabaranAction.js';

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
    dispatch(getAldabaran());
    dispatch(getAllDeliveryAddresses());
    dispatch(getAllClients());
    dispatch(getAllContactInfo());
    dispatch(getAllProducts());
    dispatch(getAllProductionBatchLogs());
    dispatch(getAllRoles());
    dispatch(getAllStockBalance());
    dispatch(getAllUsersInfo());
    dispatch(getAllUsersMainInfo());
    dispatch(getAllWarehouse());
    dispatch(getAnchor());
    dispatch(getAnchorProductsOfOrders());
    dispatch(getAnchorsWarehouse());
    dispatch(getBatchOutside());
    dispatch(getDryMixesJournal());
    dispatch(getDryMixedProductsOfOrders());
    dispatch(getDryMixesWarehouse());
    dispatch(getFilesOrder());
    dispatch(getFilesProduct());
    dispatch(getFilesWarehouse());
    dispatch(getRelMatProductsOfOrders());
    dispatch(getListOfReservedProducts());
    dispatch(getListOfDryMixedReservedProducts());
    dispatch(getListOfAnchorReservedProducts());
    dispatch(getListOfToolReservedProducts());
    dispatch(getListOfRelMatReservedProducts());
    dispatch(getListOfOrderedProduction());
    dispatch(getListOfOrderedProductionOEM());
    dispatch(getOrders());
    dispatch(getPagesList());
    dispatch(getProductsOfOrders());
    dispatch(getRecipeOrdersData());
    dispatch(getRecipe());
    dispatch(getRelatedMaterialsBackorder());
    dispatch(getRelatedMaterialsJournal());
    dispatch(getRelatedMaterialsWarehouse());
    dispatch(getTool());
    dispatch(getToolProductsOfOrders());
    dispatch(getToolsWarehouse());
    dispatch(getProductCode());

    dispatch(getQualityManagement());
    dispatch(clearBatchState());

    setStoredData(null);
    //dispatch(dataFetchedChange(true));
  }, []);

  return (
    <div className="main-container">
      <h1 className="main-title">Main Page</h1>
      <div className="button-container">
        {checkUserAccess(user, roles, 'Users_info')?.canRead && (
          <button className="nav-button" onClick={() => navigate('/users_info')}>
            Users Info
          </button>
        )}
        {checkUserAccess(user, roles, 'Roles')?.canRead && (
          <button className="nav-button" onClick={() => navigate('/roles')}>
            Roles
          </button>
        )}
        {checkUserAccess(user, roles, 'warehouse_manager')?.canRead && (
          <button
            className="nav-button"
            onClick={() => navigate('/warehouse_manager')}
          >
            Order dispatch
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
        {checkUserAccess(user, roles, 'Statistics')?.canRead && (
          <button className="nav-button" onClick={() => navigate('/statistics')}>
            Statistics
          </button>
        )}
        {checkUserAccess(user, roles, 'Orders')?.canRead && (
          <button className="nav-button" onClick={() => navigate('/orders')}>
            Orders
          </button>
        )}
        {checkUserAccess(user, roles, 'accounting')?.canRead && (
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
        {/* {checkUserAccess(user, roles, 'autoclave_calenare')?.canRead && ( */}
        <button
          className="nav-button"
          onClick={() => navigate('/autoclave_calenare')}
        >
          Autoclave Calendare
        </button>
         {/* )} */}
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
        {checkUserAccess(user, roles, 'related_materials_backorder_list')
          ?.canRead && (
          <button
            className="nav-button"
            onClick={() => navigate('/related_materials_backorder_list')}
          >
            Related materials backorder list
          </button>
        )}
        {checkUserAccess(user, roles, 'production_plan')?.canRead && (
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
        {checkUserAccess(user, roles, 'quality_management')?.canRead && (
          <button
            className="nav-button"
            onClick={() => navigate('/quality_management')}
          >
            Quality Management
          </button>
        )}
      </div>
    </div>
  );
}
export default Main;
