// import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Main() {
  // const url = axios.create({
  //   baseURL: process.env.REACT_APP_URL,
  //   withCredentials: true,
  // });

  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (!user) {
      navigate('/sign-it');
    }
  }, [navigate, user]);

  return (
    <div>
      <p>MAIN PAGE</p>
      <button onClick={() => navigate('/products')}>Products</button>
    </div>
  );
}
export default Main;
