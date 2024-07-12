import { useEffect, useMemo } from 'react';
import { useProjectContext } from '../contexts/Context';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Table from '../Table/Table';

function Orders() {
  const { COLUMNS_ORDERS, roles, checkUserAccess, userAccess, setUserAccess } =
    useProjectContext();
  const list_of_orders = useSelector((state) => state.orders);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const handleRowClick = (row) => {
  //   if (userAccess.canRead) {
  //     setProductCardData(row.original);
  //     setModalProductCard(!modalProductCard);
  //   }
  // };

  // useEffect(() => {
  //   if (userAccess.canRead) {
  //     dispatch(getAllProducts());
  //   }
  // }, [userAccess.canRead]);

  // useEffect(() => {
  //   if (user && roles.length > 0) {
  //     const access = checkUserAccess(user, roles, 'Products');
  //     setUserAccess(access);

  //     if (!access.canRead) {
  //       navigate('/'); // Перенаправление на главную страницу, если нет прав на чтение
  //     }
  //   }
  // }, [user, roles]);

  // if (!userAccess.canRead) {
  //   return <div>У вас нет прав для просмотра этой страницы.</div>;
  // }

  return (
    <>
      <Table
        COLUMN_DATA={COLUMNS_ORDERS}
        dataOfTable={list_of_orders}
        // userAccess={userAccess}
        onClickButton={() => {
          navigate('/addNewOrder');
        }}
        buttonText={'Add new order'}
        tableName={'Orders'}
      />
    </>
  );
}
export default Orders;
