import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import { useEffect } from 'react';
import { setToken } from './components/redux/actions/jwtAction';
import axios from 'axios';
import LoginForm from './components/LoginForm/LoginForm';
import Main from './components/Main/Main';
import NavBar from './components/NavBar/NavBar';
import RegForm from './components/RegForm/RegForm';
import Roles from './components/Roles/Roles';
import Products from './components/Products/Products';
import ClientsInfo from './components/Clients/ClientsInfo/ClientsInfo';
import AddProductOrder from '#components/Orders/AddProductOrder.jsx';
import OrdersTable from '#components/Orders/OrdersTable.jsx';
import MainContextProvider from '#components/contexts/MainContex.js';
import OrderCart from '#components/Orders/OrderCart.jsx';

function App() {
  const dispatch = useDispatch();

  const url = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true,
  });

  useEffect(() => {
    url
      .post('/auth/refresh')
      .then((res) => {
        const { accessToken, accessTokenExpiration } = res.data;
        dispatch(setToken(accessToken, accessTokenExpiration));
      })
      .catch(() => {});
  }, [url]);

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
            <Route path="/addProductOrder" element={<AddProductOrder />} />
            <Route path="*" element={<Navigate to={'sign-in'} />} />
          </Routes>
          <SnackbarProvider />
        </div>
    </MainContextProvider>
  );
}

export default App;
