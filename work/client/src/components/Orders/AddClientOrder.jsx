import { useEffect, useMemo } from 'react';
import { useProjectContext } from '../contexts/Context';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Table from '../Table/Table';

function AddClientOrder() {
  const { COLUMNS_ORDERS, latestProducts } = useProjectContext();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <>
      <Table
        COLUMN_DATA={COLUMNS_ORDERS}
        dataOfTable={latestProducts}
        // userAccess={userAccess}
        onClickButton={() => {
          navigate('/addClientOrder');
        }}
        buttonText={'Add new order'}
        tableName={'Orders'}
      />
    </>
  );
}
export default AddClientOrder;
