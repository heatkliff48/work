import './App.css';
import { Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm/LoginForm';
import Main from './components/Main/Main';
// import { useDispatch } from 'react-redux';
import NavBar from './components/NavBar/NavBar';
import RegForm from './components/RegForm/RegForm';
// import ProtectedRoute from './components/ProtectRoute/ProtectRoute';

function App() {
  // const dispatch = useDispatch();

  return (
    <>
      <div className="wrapper">
        <NavBar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/registration" element={<RegForm />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
