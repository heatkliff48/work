import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import LoginForm from './components/LoginForm/LoginForm';
import Main from './components/Main/Main';
import NavBar from './components/NavBar/NavBar';
import Roles from './components/Roles/Roles';
import Products from './components/Products/Products';
import ClientsInfo from './components/Clients/ClientsInfo/ClientsInfo';
import OrdersTable from '#components/Orders/OrdersTable.jsx';
import MainContextProvider from '#components/contexts/MainContex.js';
import OrderCart from '#components/Orders/OrderCart.jsx';
import Warehouse from '#components/Warehouse/Warehouse.jsx';
import UsersInfo from '#components/UsersInfo/usersInfo.jsx';
// import ProductionBatchLog from '#components/ProductionBatchLog/ProductionBatchLog.jsx';
import ListOfOrderedProduction from '#components/Warehouse/ListOfOrderedProduction/ListOfOrderedProduction.jsx';
import ListOfOrderedProductionOEM from '#components/Warehouse/ListOfOrderedProductionOEM/ListOfOrderedProductionOEM.jsx';
import ProductionBatchDesigner from '#components/ProductionBatchDesigner/ProductionBatchDesigner.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSocketOnMessage } from '#utils/socket.message.js';
import WebSocketClient from '#utils/WebSockeetClient.js';

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
      const webSocketClient = new WebSocketClient({ url, socketOnMessageFunc }); // Создайте экземпляр WebSocketClien
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

          <Route path="*" element={<Navigate to={'sign-in'} />} />
        </Routes>
      </div>
    </MainContextProvider>
  );
}

export default App;
