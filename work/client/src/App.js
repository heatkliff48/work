import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import LoginForm from './components/LoginForm/LoginForm';
import Main from './components/Main/Main';
import NavBar from './components/NavBar/NavBar';
import RegForm from './components/RegForm/RegForm';
import Roles from './components/Roles/Roles';
import Products from './components/Products/Products';
import ClientsInfo from './components/Clients/ClientsInfo/ClientsInfo';
import OrdersTable from '#components/Orders/OrdersTable.jsx';
import MainContextProvider from '#components/contexts/MainContex.js';
import OrderCart from '#components/Orders/OrderCart.jsx';
import Warehouse from '#components/Warehouse/Warehouse.jsx';
import UsersInfo from '#components/UsersInfo/usersInfo.jsx';
import ProductionBatchLog from '#components/ProductionBatchLog/ProductionBatchLog.jsx';

function App() {

  return (
    <MainContextProvider>
      <div className="wrapper">
        <SnackbarProvider />
        <NavBar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/products" element={<Products />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/sign-up" element={<RegForm />} />
          <Route path="/sign-in" element={<LoginForm />} />
          <Route path="/clients" element={<ClientsInfo />} />
          <Route path="/orders" element={<OrdersTable />} />
          <Route path="/order_card" element={<OrderCart />} />
          <Route path="/warehouse" element={<Warehouse />} />
          <Route path="/users_info" element={<UsersInfo />} />
          <Route path="/production_batch_log" element={<ProductionBatchLog />} />

          <Route path="*" element={<Navigate to={'sign-in'} />} />
        </Routes>
        <SnackbarProvider />
      </div>
    </MainContextProvider>
  );
}

export default App;
