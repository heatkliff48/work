import { useUsersContext } from '#components/contexts/UserContext.js';
import { useLocation } from 'react-router-dom';
import { clearBatchState } from '#components/redux/actions/batchDesignerAction.js';
import { getBatchOutside } from '#components/redux/actions/batchOutsideAction.js';
import {
  getAllClients,
  getAllContactInfo,
  getAllDeliveryAddresses,
  getClientPriceInfo,
} from '#components/redux/actions/clientAction.js';
import {
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
  getMainRawMatConsumption,
  getRawMatConsumption,
  getRecipe,
  getRecipeOrdersData,
} from '#components/redux/actions/recipeAction.js';
import { getRelatedMaterialsBackorder } from '#components/redux/actions/relatedMaterialsBackorderListAction.js';
import { getAllRoles } from '#components/redux/actions/rolesAction.js';
import { getAllStockBalance } from '#components/redux/actions/stockBalanceAction.js';
import {
  getAllWarehouse,
  getAutoclaveCalendar,
  getListOfAnchorReservedProducts,
  getListOfDryMixedReservedProducts,
  getListOfOrderedProduction,
  getListOfOrderedProductionOEM,
  getListOfRelMatReservedProducts,
  getListOfReservedProducts,
  getListOfToolReservedProducts,
  getRawMaterialsWarehouse,
} from '#components/redux/actions/warehouseAction.js';
import { getFilesWarehouse } from '#components/redux/actions/filesWarehouseAction.js';
import { getFilesProduct } from '#components/redux/actions/filesProductAction.js';
import { getFilesOrder } from '#components/redux/actions/filesOrderAction.js';
import { getAllProductionBatchLogs } from '#components/redux/actions/productionBatchLogAction.js';
import { getQualityManagement } from '#components/redux/actions/qualityManagementAction.js';
import { getPagesList } from '#components/redux/actions/pagesAction';
import {
  getAllUsersInfo,
  getAllUsersMainInfo,
} from '#components/redux/actions/usersInfoAction';
import { getAldabaran } from '#components/redux/actions/aldabaranAction.js';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import {
  getLotesList,
  getLotesListCakes,
} from '#components/redux/actions/lotesListAction.js';

import '#components/Styles/dashboard.css';

import '#components/Styles/dashboard.css';
import { getFilesLotesList } from '#components/redux/actions/filesLotesListAction.js';


function Main() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { setStoredData } = useOrderContext();
  const { roles, checkUserAccess } = useUsersContext();

  useEffect(() => {
    if (!user || !localStorage.getItem('user')) {
      navigate('/sign-in');
    }
  }, [user]);

  useEffect(() => {
    dispatch(getAldabaran());
    dispatch(getAutoclaveCalendar());
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
    dispatch(getClientPriceInfo());
    dispatch(getDryMixesJournal());
    dispatch(getDryMixedProductsOfOrders());
    dispatch(getDryMixesWarehouse());
    dispatch(getFilesOrder());
    dispatch(getFilesLotesList());
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
    dispatch(getRawMatConsumption());
    dispatch(getMainRawMatConsumption());
    dispatch(getQualityManagement());
    dispatch(clearBatchState());
    dispatch(getLotesList());
    dispatch(getLotesListCakes());
    dispatch(getRawMaterialsWarehouse());
    setStoredData(null);
  }, [dispatch, setStoredData]);

  return (
    <>
      <div className="bb-section-title">Quick Actions</div>

      <div className="bb-actions">
        <button
          className="bb-action-btn bb-primary"
          onClick={() => navigate('/orders')}
          type="button"
        >
          Add New Order
        </button>

        <button
          className="bb-action-btn"
          onClick={() => navigate('/clients')}
          type="button"
        >
          Add New Client
        </button>

        <button
          className="bb-action-btn"
          onClick={() => navigate('/warehouse_products_type')}
          type="button"
        >
          Update Inventory
        </button>

        <button
          className="bb-action-btn"
          onClick={() => navigate('/production_batch_designer_new')}
          type="button"
        >
          Batch Plan
        </button>
      </div>
    </>
  );
}

export default Main;
