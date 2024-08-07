import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Table from '../Table/Table';
import AddClientOrderModal from './AddClientOrderModal';
import { useOrderContext } from '../contexts/OrderContext';
import { useCallback, useEffect } from 'react';
import { getAllDeliveryAddresses } from '#components/redux/actions/clientAction.js';

import {
  getOrders,
  getProductsOfOrders,
} from '#components/redux/actions/ordersAction.js';

function OrdersTable() {
  const {
    COLUMNS_ORDERS,
    getCurrentOrderInfoHandler,
    clientModalOrder,
    setClientModalOrder,
    setProductOfOrder,
    setNewOrder,
    ordersDataList,
    setOrdersDataList,
  } = useOrderContext();
  const orders = useSelector((state) => state.orders);
  const clients = useSelector((state) => state.clients);
  const deliveryAddresses = useSelector((state) => state.deliveryAddresses);

  const dispatch = useDispatch();

  // const user = useSelector((state) => state.user);
  const navigate = useNavigate();

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
    if (orders && clients && deliveryAddresses) {
      const newArray = orders.map((order) => {
        const client = clients.find((client) => client.id === order.owner);
        const deliveryAddress = deliveryAddresses.find(
          (address) =>
            address.id === order.del_adr_id && address.client_id === order.owner
        );

        return {
          id: order.id,
          article: order.article,
          status: order.status,
          owner: client ? client.c_name : '',
          del_adr_id: deliveryAddress ? deliveryAddress.street : '',
        };
      });

      setOrdersDataList(newArray);
    }
  }, [orders, clients, deliveryAddresses]);

  useEffect(() => {
    dispatch(getAllDeliveryAddresses);
    dispatch(getOrders());
  }, [deliveryAddresses]);

  useEffect(() => {
    //CLEAR data
    setProductOfOrder({});
    setNewOrder({});
  }, []);

  return (
    <>
      {clientModalOrder && (
        <AddClientOrderModal
          isOpen={clientModalOrder}
          toggle={() => setClientModalOrder(!clientModalOrder)}
        />
      )}
      <Table
        COLUMN_DATA={COLUMNS_ORDERS}
        dataOfTable={ordersDataList}
        // userAccess={userAccess}
        onClickButton={() => {
          setClientModalOrder(!clientModalOrder);
        }}
        buttonText={'Add new order'}
        tableName={'Orders'}
        handleRowClick={(row) => {
          getCurrentOrderInfoHandler(row.original);
          dispatch(getProductsOfOrders(row.original.id));
          navigate('/order_card');
        }}
      />
      <div>There place for vac and other huiny</div>
    </>
  );
}
export default OrdersTable;
