import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Table from '../Table/Table';
import AddClientOrderModal from './AddClientOrderModal';
import { useOrderContext } from '../contexts/OrderContext';
import { useEffect } from 'react';

function OrdersTable() {
  const {
    COLUMNS_ORDERS,
    clientModalOrder,
    setClientModalOrder,
    setProductOfOrder,
    setProductListOrder,
    setNewOrder,
  } = useOrderContext();
  const orders = useSelector((state) => state.orders);


  // const user = useSelector((state) => state.user);
  // const dispatch = useDispatch();
  // const navigate = useNavigate();

  // const handleRowClick = (row) => {
  //   if (userAccess.canRead) {
  //     setProductCardData(row.original);
  //     setModalProductCard(!modalProductCard);
  //   }
  // };

  // useEffect(() => {
  //   if (userAccess.canRead) {
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

  useEffect(() => {
    setProductListOrder([]);
    setProductOfOrder({});
    setNewOrder({});
  }, []);

  return (
    <>
      <AddClientOrderModal
        isOpen={clientModalOrder}
        toggle={() => setClientModalOrder(!clientModalOrder)}
      />
      <Table
        COLUMN_DATA={COLUMNS_ORDERS}
        dataOfTable={orders}
        // userAccess={userAccess}
        onClickButton={() => {
          setClientModalOrder(!clientModalOrder);
        }}
        buttonText={'Add new order'}
        tableName={'Orders'}
        handleRowClick={(row) => {}}
      />
      <div>There place for vac and other huiny</div>
    </>
  );
}
export default OrdersTable;
