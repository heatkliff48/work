import axios from 'axios';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Main() {
  const url = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true,
  });

  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    console.log('USER', user);
    if (!user) {
      navigate('/sign-up');
    }
  }, [navigate, user]);
  return (
    <div>
      <p>HELLO WORLD!!!</p>
    </div>
  );
}
export default Main;
