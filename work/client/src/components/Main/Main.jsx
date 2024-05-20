// import axios from 'axios';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Table from '../Table/Table';

function Main() {
  // const url = axios.create({
  //   baseURL: process.env.REACT_APP_URL,
  //   withCredentials: true,
  // });

  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
    }
  }, [navigate, user]);
  return (
    <div>
      <Table />
    </div>
  );
}
export default Main;
