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
import ProjectContextProvider from './components/contexts/Context';
import Roles from './components/Roles/Roles';
import Products from './components/Products/Products';
import ClientsInfo from './components/Clients/ClientsInfo/ClientsInfo';
import Orders from './components/Orders/Orders';
import AddClientOrder from '#components/Orders/AddClientOrder.jsx';
import AddProductOrder from '#components/Orders/AddProductOrder.jsx';

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
    <ProjectContextProvider>
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
          <Route path="/orders" element={<Orders />} />
          <Route path="/addClientOrder" element={<AddClientOrder />} />
          <Route path="/addProductOrder" element={<AddProductOrder />} />
          <Route path="*" element={<Navigate to={'sign-in'} />} />
        </Routes>
        <SnackbarProvider />
      </div>
    </ProjectContextProvider>
  );
}

export default App;
