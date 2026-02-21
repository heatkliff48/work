import { useProjectContext } from '#components/contexts/Context.js';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { getCurrentProductsOfOrders } from '#components/redux/actions/ordersAction.js';
import Table from '#components/Table/Table';
import { useOrderContext } from '#components/contexts/OrderContext';
import AddClientOrderModal from '#components/Orders/modal/AddClientOrderModal';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getOrderToWarehouse } from '#components/redux/actions/orderToWarehouseAction.js';
import AddProductOrderToWarehouseModal from './AddProductOrderToWarehouseModal';

function OrdersToWarehouseTable() {
  const {
    getCurrentOrderInfoHandler,
    setProductOfOrder,
    setNewOrder,
    ordersDataList,
    randomOrderCheck,
    setRandomOrderCheck,
  } = useOrderContext();
  const { clientModalOrder, setClientModalOrder } = useModalContext();
  const { setCurrentClient } = useProjectContext();
  const { roles, checkUserAccess, userAccess, setUserAccess } =
    useUsersContext();

  const COLUMNS_ORDERS_TO_WAREHOUSE = [
    {
      Header: 'Ref.',
      accessor: 'product_article',
      disableSortBy: true,
    },
    {
      Header: 'Description',
      accessor: 'description',
      sortType: 'string',
    },
    {
      Header: 'Quantity of pallets',
      accessor: 'quantity_pallets',
    },
    {
      Header: 'Real quantity, m2',
      accessor: 'quantity_real_m2',
    },
    {
      Header: 'Produced',
      accessor: 'quantity_produced',
    },
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const list_of_orders_to_warehouse = useSelector(
    (state) => state.orderToWarehouse,
  );

  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Orders');
      setUserAccess(access);

      if (!access?.canRead) {
        navigate('/'); // Перенаправление на главную страницу, если нет прав на чтение
      }
      dispatch(getOrderToWarehouse());
    }
  }, [user, roles]);

  useEffect(() => {
    setProductOfOrder({});
    setNewOrder({});
    setCurrentClient({});
    setRandomOrderCheck(false);
  }, [clientModalOrder]);

  return (
    <>
      {clientModalOrder && (
        <AddProductOrderToWarehouseModal
          isOpen={clientModalOrder}
          toggle={() => setClientModalOrder(!clientModalOrder)}
        />
      )}
      <Table
        COLUMN_DATA={COLUMNS_ORDERS_TO_WAREHOUSE}
        dataOfTable={list_of_orders_to_warehouse}
        userAccess={userAccess}
        onClickButton={() => {
          setClientModalOrder(!clientModalOrder);
        }}
        buttonText={'Add new order'}
        tableName={'Orders to warehouse'}
        handleRowClick={() => {}}
      />
    </>
  );
}
export default OrdersToWarehouseTable;
