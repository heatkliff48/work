import './App.css';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm/LoginForm';
import Main from './components/Main/Main';
import { useDispatch, useSelector } from 'react-redux';
import NavBar from './components/NavBar/NavBar';
import RegForm from './components/RegForm/RegForm';
// import ProtectedRoute from './components/ProtectRoute/ProtectRoute';
import { SnackbarProvider } from 'notistack';
import axios from 'axios';
import { useEffect, useRef } from 'react';
import { setToken } from './components/redux/actions/jwtAction';
import ProjectContextProvider from './components/contexts/Context';
import Roles from './components/Roles/Roles';
import Products from './components/Products/Products';
import { checkUser } from './components/redux/actions/userAction';
import Orders from './components/Orders/Orders';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isCheckedAuth = useRef(false);
  const user = useSelector((state) => state.user);

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

  useEffect(() => {
    //сделать диспатч чек юзер на нахождение юзера в бд
    // dispatch(checkUser());

    if (isCheckedAuth && !user) {
      navigate('/sign-in');
    }
  }, []);

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
          <Route path="/orders" element={<Orders />} />
          {/* <Route path="/addNewOrder" element={<LoginForm />} /> */}
          <Route path="*" element={<Navigate to={'sign-in'} />} />
        </Routes>
        <SnackbarProvider />
      </div>
    </ProjectContextProvider>
  );
}

export default App;
