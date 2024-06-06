import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm/LoginForm';
import Main from './components/Main/Main';
import { useDispatch } from 'react-redux';
import NavBar from './components/NavBar/NavBar';
import RegForm from './components/RegForm/RegForm';
// import ProtectedRoute from './components/ProtectRoute/ProtectRoute';
import { SnackbarProvider } from 'notistack';
import axios from 'axios';
import { useEffect } from 'react';
import { setToken } from './components/redux/actions/jwtAction';
import ProductContextProvider from './components/contexts/Context';

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
  }, [dispatch, url]);

  return (
    <ProductContextProvider>
      <div className="wrapper">
        <SnackbarProvider />
        <NavBar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/sign-up" element={<RegForm />} />
          <Route path="/sign-in" element={<LoginForm />} />
          <Route path="*" element={<Navigate to={'sign-in'} />} />
        </Routes>
        <SnackbarProvider />
      </div>
    </ProductContextProvider>
  );
}

export default App;
