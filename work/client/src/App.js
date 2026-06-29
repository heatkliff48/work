import './App.css';
import Accounting from '#components/Accounting/Accounting.jsx';
import BatchOutside from '#components/BatchOutside/BatchOutside.jsx';
import OrderCart from '#components/Orders/OrderCart.jsx';
import OrdersTable from '#components/Orders/OrdersTable.jsx';
import RawMaterialsPlan from '#components/RawMaterialsPlan/RawMaterialsPlan.jsx';
import RecipeOrders from '#components/RawMaterialsPlan/RecipeOrders.jsx';
import ProductsListForRecipes from '#components/Recipe/ProductsListForRecipes.jsx';
import Statistics from '#components/Statistics/Statistics.jsx';
import StockBalance from '#components/Statistics/StockBalance.jsx';
import UsersInfo from '#components/UsersInfo/usersInfo.jsx';
import ListOfOrderedProduction from '#components/Warehouse/ListOfOrderedProduction/ListOfOrderedProduction.jsx';
import ListOfOrderedProductionOEM from '#components/Warehouse/ListOfOrderedProductionOEM/ListOfOrderedProductionOEM.jsx';
import Warehouse from '#components/Warehouse/Warehouse.jsx';
import DryMixesWarehouse from '#components/Warehouse/DryMixesWarehouse.jsx';
import RelatedMaterialsWarehouse from '#components/Warehouse/RelatedMaterialsWarehouse.jsx';
import AnchorsWarehouse from '#components/Warehouse/AnchorsWarehouse.jsx';
import ToolsWarehouse from '#components/Warehouse/ToolsWarehouse.jsx';
import RawMaterialsWarehouse from '#components/Warehouse/RawMaterialsWarehouse.jsx';
import MainContextProvider from '#components/contexts/MainContex.js';
import WebSocketClient from '#utils/WebSockeetClient.js';
import { createSocketOnMessage } from '#utils/socket.message.js';
import ClientsInfo from './components/Clients/ClientsInfo/ClientsInfo';
import LoginForm from './components/LoginForm/LoginForm';
import Main from './components/Main/Main';
import NavBar from './components/NavBar/NavBar';
import Products from './components/Products/Products';
import Roles from './components/Roles/Roles';
import { SnackbarProvider } from 'notistack';
import {
  useEffect,
  // useRef
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
import ProductsTypeJournal from '#components/Products/ProductsTypeJournal.jsx';
import DryMixesJournal from '#components/Products/DryMixesJournal.jsx';
import RelatedMaterialsJournal from '#components/Products/RelatedMaterialsJournal.jsx';
import AnchorsTable from '#components/Products/AnchorsTable.jsx';
import ToolsTable from '#components/Products/ToolsTable.jsx';
import QualityManagementTable from '#components/QualityManagement/QualityManagementTable.jsx';
import WarehouseManager from '#components/WarehouseManager/WarehouseManager.jsx';
import ProductsTypeWarehouse from '#components/Warehouse/ProductsTypeWarehouse.jsx';
import RelatedMaterialsBackorderList from '#components/Warehouse/RelatedMaterialsBackorderList/RelatedMaterialsBackorderList.jsx';
import AutoclaveCalendare from '#components/ProductionBatchDesigner/AutoclaveCalendare.jsx';
import ProductionBatchDesignerNew from '#components/ProductionBatchDesigner/ProductionBatchDesignerNew.jsx';
import RawMaterialsConsumption from '#components/RawMaterialsConsumption/RawMaterialsConsumption.jsx';
import LotesList from '#components/LotesList/LotesList.jsx';
import ClientsPriceInfo from '#components/Clients/ClientsPriceInfo/ClientsPriceInfo.jsx';
import CackeFillUp from '#components/CackeFillUp/CackeFillUp.jsx';
import OrdersToWarehouseTable from '#components/Orders/OrdersToWarehouse/OrdersToWarehouseTable.jsx';
import ProductionQuality from '#components/ProductionQuality/ProductionQuality.jsx';

import '#components/Styles/buttons.css';
import TaskBoard from '#components/TaskBoard/TaskBoard.jsx';
import GreenLineMonitoring from '#components/GreenLineMonitoring/GreenLineMonitoring.jsx';
import TemperatureDataMonitoring from '#components/GreenLineMonitoring/TemperatureDataMonitoring.jsx';

import { getWebSocketUrl } from '#utils/getApiUrl.js';
import WMOrderCard from '#components/WarehouseManager/WMOrderCard/WMOrderCard.jsx';

function App() {
  const dispatch = useDispatch();

  // WS_URL_AUTO_REPLACE_START
  const url = getWebSocketUrl();
  // WS_URL_AUTO_REPLACE_END

  // const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  // const isCheckedAuth = useRef(false);

  useEffect(() => {
    if (user) {
      const socketOnMessageFunc = createSocketOnMessage(dispatch);
      new WebSocketClient({ url, socketOnMessageFunc });
    }

    // if (isCheckedAuth && !user) navigate('/sign-in');
  }, [user]);

  return (
    <MainContextProvider>
      <div className="wrapper">
        <SnackbarProvider />

        <Routes>
          {/* публичная страница */}
          <Route path="/sign-in" element={<LoginForm />} />

          {/* layout со sidebar + topbar для всех остальных */}
          <Route element={<NavBar />}>
            <Route path="/" element={<Main />} />
            <Route path="/accounting" element={<Accounting />} />
            <Route path="/anchors" element={<AnchorsTable />} />

            <Route path="/batch_outside" element={<BatchOutside />} />
            <Route path="/clients" element={<ClientsInfo />} />
            <Route path="/clients_price_info" element={<ClientsPriceInfo />} />
            <Route path="/dry_mixes_journal" element={<DryMixesJournal />} />

            <Route
              path="/list_of_ordered_production"
              element={<ListOfOrderedProduction />}
            />
            <Route
              path="/list_of_ordered_production_oem"
              element={<ListOfOrderedProductionOEM />}
            />
            <Route
              path="/related_materials_backorder_list"
              element={<RelatedMaterialsBackorderList />}
            />

            <Route path="/orders" element={<OrdersTable />} />
            <Route path="/cacke_fillup" element={<CackeFillUp />} />
            <Route path="/order_card" element={<OrderCart />} />
            <Route
              path="/orders_to_warehouse"
              element={<OrdersToWarehouseTable />}
            />

            <Route path="/production_quality" element={<ProductionQuality />} />
            <Route path="/products" element={<Products />} />
            <Route
              path="/production_batch_designer_new"
              element={<ProductionBatchDesignerNew />}
            />
            <Route path="/autoclave_calendar" element={<AutoclaveCalendare />} />

            <Route path="/products_type_journal" element={<ProductsTypeJournal />} />
            <Route path="/quality_management" element={<QualityManagementTable />} />

            <Route path="/raw_materials_plan" element={<RawMaterialsPlan />} />
            <Route path="/recipe_products" element={<ProductsListForRecipes />} />
            <Route path="/recipe_orders" element={<RecipeOrders />} />
            <Route
              path="/raw_material_consumption"
              element={<RawMaterialsConsumption />}
            />

            <Route
              path="/related_materials_journal"
              element={<RelatedMaterialsJournal />}
            />
            <Route path="/roles" element={<Roles />} />

            <Route path="/statistics" element={<Statistics />} />
            <Route path="/stock_balance" element={<StockBalance />} />

            <Route path="/tools" element={<ToolsTable />} />
            <Route path="/users_info" element={<UsersInfo />} />

            <Route path="/warehouse_HCCA_blocks" element={<Warehouse />} />
            <Route path="/warehouse_dry_mixes" element={<DryMixesWarehouse />} />
            <Route
              path="/warehouse_related_materials"
              element={<RelatedMaterialsWarehouse />}
            />
            <Route path="/warehouse_anchors" element={<AnchorsWarehouse />} />
            <Route path="/warehouse_tools" element={<ToolsWarehouse />} />
            <Route
              path="/warehouse_raw_materials"
              element={<RawMaterialsWarehouse />}
            />
            <Route
              path="/warehouse_products_type"
              element={<ProductsTypeWarehouse />}
            />
            <Route path="/warehouse-manager/order-card" element={<WMOrderCard />} />
            <Route path="/warehouse_manager" element={<WarehouseManager />} />

            <Route path="/lotes_list" element={<LotesList />} />
            <Route path="/task_board" element={<TaskBoard />} />
            <Route path="/green_line_monitoring" element={<GreenLineMonitoring />} />
            <Route
              path="/temperature_data_monitoring"
              element={<TemperatureDataMonitoring />}
            />

            {/* всё неизвестное — на sign-in */}
            <Route path="*" element={<Navigate to="/sign-in" />} />
          </Route>
        </Routes>
      </div>
    </MainContextProvider>
  );
}

export default App;
