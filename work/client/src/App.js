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

function App() {
  const dispatch = useDispatch();
  const isCheckedAuth = useRef(false);

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
  }, [dispatch, url]);

  // useEffect(() => {
  //   //сделать диспатч чек юзер на нахождение юзера в бд

  //   // if (isCheckedAuth && !user) {
  //   //   navigate('/sign-in');
  //   // }
  //   dispatch(getAllRoles());
  //   console.log("object");
  // }, [dispatch, user]);

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
          <Route path="*" element={<Navigate to={'sign-in'} />} />
        </Routes>
        <SnackbarProvider />
      </div>
    </ProjectContextProvider>
  );
}

export default App;
