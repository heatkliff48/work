import './App.css';
import BatchOutside from '#components/BatchOutside/BatchOutside.jsx';
import OrderCart from '#components/Orders/OrderCart.jsx';
import OrdersTable from '#components/Orders/OrdersTable.jsx';
import ProductionBatchDesigner from '#components/ProductionBatchDesigner/ProductionBatchDesigner.jsx';
import RawMaterialsPlan from '#components/RawMaterialsPlan/RawMaterialsPlan.jsx';
import RecipeOrders from '#components/RawMaterialsPlan/RecipeOrders.jsx';
import ProductsListForRecipes from '#components/Recipe/ProductsListForRecipes.jsx';
import Statistics from '#components/Statistics/Statistics.jsx';
import StockBalance from '#components/Statistics/StockBalance.jsx';
import UsersInfo from '#components/UsersInfo/usersInfo.jsx';
import ListOfOrderedProduction from '#components/Warehouse/ListOfOrderedProduction/ListOfOrderedProduction.jsx';
import ListOfOrderedProductionOEM from '#components/Warehouse/ListOfOrderedProductionOEM/ListOfOrderedProductionOEM.jsx';
import Warehouse from '#components/Warehouse/Warehouse.jsx';
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
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function App() {
  const dispatch = useDispatch();
  const url = 'ws://localhost:3001';
  const socket = useRef();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  // const isCheckedAuth = useRef(false);

  useEffect(() => {
    if (user) {
      const socketOnMessageFunc = createSocketOnMessage(dispatch);
      const webSocketClient = new WebSocketClient({ url, socketOnMessageFunc });
    }

    // if (isCheckedAuth && !user) navigate('/sign-in');
  }, [user]);
  return (
    <MainContextProvider>
      <div className="wrapper">
        <SnackbarProvider />
        <NavBar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/products" element={<Products />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/sign-in" element={<LoginForm />} />
          <Route path="/clients" element={<ClientsInfo />} />
          <Route path="/orders" element={<OrdersTable />} />
          <Route path="/order_card" element={<OrderCart />} />
          <Route path="/warehouse" element={<Warehouse />} />
          <Route path="/users_info" element={<UsersInfo />} />
          <Route
            path="/production_batch_designer"
            element={<ProductionBatchDesigner />}
          />
          {/* <Route path="/production_batch_log" element={<ProductionBatchLog />} /> */}
          <Route
            path="/list_of_ordered_production"
            element={<ListOfOrderedProduction />}
          />
          <Route
            path="/list_of_ordered_production_oem"
            element={<ListOfOrderedProductionOEM />}
          />
          <Route path="/batch_outside" element={<BatchOutside />} />

          <Route path="/recipe_products" element={<ProductsListForRecipes />} />

          <Route path="/raw_materials_plan" element={<RawMaterialsPlan />} />
          <Route path="/recipe_orders" element={<RecipeOrders />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/stock_balance" element={<StockBalance />} />

          <Route path="*" element={<Navigate to={'sign-in'} />} />
        </Routes>
      </div>
    </MainContextProvider>
  );
}

export default App;
