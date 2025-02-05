
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Statistics() {
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  // const user = useSelector((state) => state.user);

  // const { roles, checkUserAccess } = useUsersContext();

  // useEffect(() => {
  //   if (!user) {
  //     navigate('/sign-in');
  //   }
  // }, [user]);

  return (
    <div>
      <p>STATISTICS PAGE</p>
      <button onClick={() => navigate('/stock_balance')}>Stock Balance</button>
    </div>
  );
}
export default Statistics;
