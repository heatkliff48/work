import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Table from '../Table/Table';
import AddClientOrderModal from './modal/AddClientOrderModal';
import { useOrderContext } from '../contexts/OrderContext';
import { useEffect } from 'react';

import {
  getOrders,
  getCurrentProductsOfOrders,
} from '#components/redux/actions/ordersAction.js';
import { useProjectContext } from '#components/contexts/Context.js';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';

function OrdersTable() {
  const {
    COLUMNS_ORDERS,
    getCurrentOrderInfoHandler,
    setProductOfOrder,
    setNewOrder,
    ordersDataList,
    setOrdersDataList,
    status_list,
    usersInfo,
  } = useOrderContext();
  const { clientModalOrder, setClientModalOrder } = useModalContext();
  const { setCurrentClient } = useProjectContext();
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();

  const orders = useSelector((state) => state.orders);
  const clients = useSelector((state) => state.clients);
  const deliveryAddresses = useSelector((state) => state.deliveryAddresses);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Orders');
      setUserAccess(access);

      if (!access?.canRead) {
        navigate('/'); // Перенаправление на главную страницу, если нет прав на чтение
      }
    }
  }, [user, roles]);

  useEffect(() => {
    if (orders && clients && deliveryAddresses) {
      const newArray = orders.map((order) => {
        const { id, article, status, shipping_date, person_in_charge } = order;
        const client = clients.find((client) => client.id === order.owner);
        const deliveryAddress = deliveryAddresses.find(
          (address) =>
            address.id === order.del_adr_id && address.client_id === order.owner
        );

        return {
          id,
          article,
          status:
            status_list?.find((stat) => stat.accessor == status)?.Header || status,
          owner: client ? client.c_name : '',
          del_adr_id: deliveryAddress ? deliveryAddress.street : '',
          shipping_date,
          person_in_charge:
            person_in_charge != 0
              ? usersInfo.find((user) => user.id === person_in_charge)?.fullName
              : 'None',
        };
      });

      setOrdersDataList(newArray);
    }
  }, [orders, clients, deliveryAddresses]);

  useEffect(() => {
    dispatch(getOrders());
  }, [deliveryAddresses]);

  useEffect(() => {
    //CLEAR data
    setProductOfOrder({});
    setNewOrder({});
    setCurrentClient({});
  }, [clientModalOrder]);

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
        userAccess={userAccess}
        onClickButton={() => {
          setClientModalOrder(!clientModalOrder);
        }}
        buttonText={'Add new order'}
        tableName={'Orders'}
        handleRowClick={(row) => {
          getCurrentOrderInfoHandler(row.original);
          dispatch(getCurrentProductsOfOrders(row.original.id));
          navigate('/order_card');
        }}
      />
    </>
  );
}
export default OrdersTable;
