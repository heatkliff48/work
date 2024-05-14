import './App.css';
import { Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm/LoginForm';
import Main from './components/Main/Main';
import { useDispatch } from 'react-redux';
import NavBar from './components/NavBar/NavBar';
import RegForm from './components/RegForm/RegForm.';
import ProtectedRoute from './components/ProtectRoute/ProtectRoute';
import { checkUser } from './components/redux/actions/userAction';

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = dispatch(checkUser());

  return (
    <>
      <div className="wrapper">
        <NavBar />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Main />
              </ProtectedRoute>
            }
          />
          <Route path="/registration" element={<RegForm />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
