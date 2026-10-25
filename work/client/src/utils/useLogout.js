import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearAccountingDataList } from '#components/redux/actions/ordersAction.js';
import { delUser } from '#components/redux/actions/userAction';

export default function useLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useCallback(() => {
    dispatch(clearAccountingDataList());
    dispatch(delUser());
    window.localStorage.clear();
    navigate('/sign-in');
  }, [dispatch, navigate]);
}
