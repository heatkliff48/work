// import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Main() {
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
      <button onClick={() => navigate('/orders')}>Orders</button>
    </div>
  );
}
export default Main;
