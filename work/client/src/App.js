import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { SnackbarProvider, closeSnackbar } from 'notistack';

import './App.css';

import Accounting from '#components/Accounting/Accounting.jsx';
import BatchOutside from '#components/BatchOutside/BatchOutside.jsx';
import ClientsInfo from '#components/Clients/ClientsInfo/ClientsInfo.js';
import ClientsPriceInfo from '#components/Clients/ClientsPriceInfo/ClientsPriceInfo.jsx';
import CakeFillUp from '#components/CakeFillUp/CakeFillUp.jsx';
import GreenLineMonitoring from '#components/GreenLineMonitoring/GreenLineMonitoring.jsx';
import TemperatureDataMonitoring from '#components/GreenLineMonitoring/TemperatureDataMonitoring.jsx';
import LoginForm from '#components/LoginForm/LoginForm.jsx';
import LotesList from '#components/LotesList/LotesList.jsx';
import Main from '#components/Main/Main.jsx';
import NavBar from '#components/NavBar/NavBar.jsx';
import OrderCart from '#components/Orders/OrderCart.jsx';
import OrdersTable from '#components/Orders/OrdersTable.jsx';
import OrdersToWarehouseTable from '#components/Orders/OrdersToWarehouse/OrdersToWarehouseTable.jsx';
import Products from '#components/Products/Products.jsx';
import ProductsTypeJournal from '#components/Products/ProductsTypeJournal.jsx';
import DryMixesJournal from '#components/Products/DryMixesJournal.jsx';
import RelatedMaterialsJournal from '#components/Products/RelatedMaterialsJournal.jsx';
import AnchorsTable from '#components/Products/AnchorsTable.jsx';
import ToolsTable from '#components/Products/ToolsTable.jsx';
import AutoclaveCalendare from '#components/ProductionBatchDesigner/AutoclaveCalendare.jsx';
import ProductionBatchDesignerNew from '#components/ProductionBatchDesigner/ProductionBatchDesignerNew.jsx';
import ProductionQuality from '#components/ProductionQuality/ProductionQuality.jsx';
import QualityManagementTable from '#components/QualityManagement/QualityManagementTable.jsx';
import RawMaterialsConsumption from '#components/RawMaterialsConsumption/RawMaterialsConsumption.jsx';
import RawMaterialsPlan from '#components/RawMaterialsPlan/RawMaterialsPlan.jsx';
import RecipeOrders from '#components/RawMaterialsPlan/RecipeOrders.jsx';
import ProductsListForRecipes from '#components/Recipe/ProductsListForRecipes.jsx';
import Roles from '#components/Roles/Roles.jsx';
import Statistics from '#components/Statistics/Statistics.jsx';
import StockBalance from '#components/Statistics/StockBalance.jsx';
import TaskBoard from '#components/TaskBoard/TaskBoard.jsx';
import TechnologyCalendar from '#components/TechnologyPlanner/TechnologyCalendar.jsx';
import UsersInfo from '#components/UsersInfo/usersInfo.jsx';
import Warehouse from '#components/Warehouse/Warehouse.jsx';
import DryMixesWarehouse from '#components/Warehouse/DryMixesWarehouse.jsx';
import RelatedMaterialsWarehouse from '#components/Warehouse/RelatedMaterialsWarehouse.jsx';
import AnchorsWarehouse from '#components/Warehouse/AnchorsWarehouse.jsx';
import ToolsWarehouse from '#components/Warehouse/ToolsWarehouse.jsx';
import RawMaterialsWarehouse from '#components/Warehouse/RawMaterialsWarehouse.jsx';
import ProductsTypeWarehouse from '#components/Warehouse/ProductsTypeWarehouse.jsx';
import ListOfOrderedProduction from '#components/Warehouse/ListOfOrderedProduction/ListOfOrderedProduction.jsx';
import ListOfOrderedProductionOEM from '#components/Warehouse/ListOfOrderedProductionOEM/ListOfOrderedProductionOEM.jsx';
import RelatedMaterialsBackorderList from '#components/Warehouse/RelatedMaterialsBackorderList/RelatedMaterialsBackorderList.jsx';
import WarehouseManager from '#components/WarehouseManager/WarehouseManager.jsx';
import WMOrderCard from '#components/WarehouseManager/WMOrderCard/WMOrderCard.jsx';
import FacturaManager from '#components/Accounting/Factura/FacturaManager.jsx';
import FacturaOrderCard from '#components/Accounting/Factura/FacturaOrderCard.jsx';

import MainContextProvider from '#components/contexts/MainContex.js';
import ProtectedRoute from '#components/ProtectedRoute/ProtectedRoute.jsx';

import { checkUser } from '#components/redux/actions/userAction.js';

import showMessage from '#components/Utils/showMessage.js';

import WebSocketClient from '#utils/WebSockeetClient.js';
import { createSocketOnMessage } from '#utils/socket.message.js';
import { getWebSocketUrl } from '#utils/getApiUrl.js';
import loadAppData from '#utils/loadAppData.js';
import useLogout from '#utils/useLogout.js';

import '#components/Styles/buttons.css';

function AuthenticatedLayout() {
  return (
    <MainContextProvider>
      <NavBar />
    </MainContextProvider>
  );
}

function App() {
  const dispatch = useDispatch();
  const logout = useLogout();

  const user = useSelector((state) => state.user);
  const authChecked = useSelector((state) => state.authChecked);

  const authCheckStarted = useRef(false);

  // useLogout использует navigate, поэтому функция может меняться
  // при переходе между страницами. В ref всегда хранится актуальная версия.
  const logoutRef = useRef(logout);
  logoutRef.current = logout;

  const webSocketUrl = getWebSocketUrl();

  // Первоначальная проверка refresh-сессии выполняется один раз.
  useEffect(() => {
    if (authCheckStarted.current) {
      return;
    }

    authCheckStarted.current = true;
    dispatch(checkUser());
  }, [dispatch]);

  useEffect(() => {
    // Не открываем WebSocket и не загружаем закрытые данные,
    // пока первоначальная проверка авторизации не завершилась.
    if (!authChecked || !user?.id) {
      return undefined;
    }

    const socketOnMessageFunc = createSocketOnMessage(dispatch);

    const webSocketClient = new WebSocketClient({
      url: webSocketUrl,
      socketOnMessageFunc,

      onUnauthorized: () => {
        closeSnackbar('ws-reconnected');

        showMessage('Session expired, please sign in again', 'warning');

        logoutRef.current();
      },

      onReconnect: () => {
        // За время отсутствия соединения часть сообщений
        // могла не дойти, поэтому обновляем общие данные.
        loadAppData(dispatch);

        showMessage('Connection restored. Data may be outdated', 'info', {
          key: 'ws-reconnected',
          preventDuplicate: true,
          persist: true,

          action: () => (
            <button
              className="table_button"
              type="button"
              onClick={() => window.location.reload()}
            >
              Refresh
            </button>
          ),
        });
      },
    });

    // Загружаем общие данные после подтверждения авторизации.
    // Это работает на любой странице, а не только на Main.
    loadAppData(dispatch);

    return () => {
      webSocketClient.close();
    };
  }, [authChecked, user?.id, dispatch, webSocketUrl]);

  return (
    <div className="wrapper">
      <SnackbarProvider />

      <Routes>
        {/* Публичная страница */}
        <Route path="/sign-in" element={<LoginForm />} />

        {/* Все остальные страницы требуют авторизацию */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AuthenticatedLayout />}>
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

            <Route path="/cake_fillup" element={<CakeFillUp />} />

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

            <Route path="/technology_calendar" element={<TechnologyCalendar />} />

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

            <Route path="/factura_manager" element={<FacturaManager />} />

            <Route
              path="/factura_manager/order-card"
              element={<FacturaOrderCard />}
            />

            <Route path="/lotes_list" element={<LotesList />} />

            <Route path="/task_board" element={<TaskBoard />} />

            <Route path="/green_line_monitoring" element={<GreenLineMonitoring />} />

            <Route
              path="/temperature_data_monitoring"
              element={<TemperatureDataMonitoring />}
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
