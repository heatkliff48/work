import { getOrders } from '#components/redux/actions/ordersAction.js';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const OrderContext = createContext();

const OrderContextProvider = ({ children }) => {
  const COLUMNS_ORDERS = [
    {
      Header: 'Article',
      accessor: 'article',
      disableSortBy: true,
    },
    {
      Header: 'Name of owner',
      accessor: 'owner',
      sortType: 'string',
    },
    {
      Header: 'Delivery address',
      accessor: 'del_adr_id',
      sortType: 'string',
    },
    {
      Header: 'Status of order',
      accessor: 'status',
      sortType: 'string',
    },
  ];

  const COLUMNS_ORDER_PRODUCT = [
    {
      Header: 'Profuct id',
      accessor: 'product_id',
      disableSortBy: true,
    },
    {
      Header: 'Quantity, m2',
      accessor: 'quantity_m2',
      sortType: 'number',
    },
    {
      Header: 'Quantity of palet',
      accessor: 'quantity_palet',
      sortType: 'number',
    },
    {
      Header: 'Real quantity',
      accessor: 'quantity_real',
      sortType: 'number',
    },
    {
      Header: 'Price, m2',
      accessor: 'price_m2',
      sortType: 'number',
    },
    {
      Header: 'Discount, %',
      accessor: 'discount',
      defaultValue: 0,
    },
    {
      Header: 'Final price',
      accessor: 'final_price',
      sortType: 'number',
    },
  ];

  const status_table = {
    NotReady: 'Not ready',
    InProcess: 'In process',
    Ready: 'Ready',
  };

  const dispatch = useDispatch();
  // const navigate = useNavigate();

  const [clientModalOrder, setClientModalOrder] = useState(false);
  const [productModalOrder, setProductModalOrder] = useState(false);
  const [productListOrder, setProductListOrder] = useState([]);
  const [productOfOrder, setProductOfOrder] = useState({});
  const [newOrder, setNewOrder] = useState();
  const [ordersDataList, setOrdersDataList] = useState([]);
  const [orderCartData, setOrderCartData] = useState({});

  const list_of_orders = useSelector((state) => state.orders);
  useEffect(() => {
    dispatch(getOrders());
  }, []);

  return (
    <OrderContext.Provider
      value={{
        COLUMNS_ORDERS,
        COLUMNS_ORDER_PRODUCT,
        clientModalOrder,
        setClientModalOrder,
        productModalOrder,
        setProductModalOrder,
        productListOrder,
        setProductListOrder,
        newOrder,
        setNewOrder,
        list_of_orders,
        status_table,
        productOfOrder,
        setProductOfOrder,
        ordersDataList,
        setOrdersDataList,
        orderCartData,
        setOrderCartData,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContextProvider;

const useOrderContext = () => useContext(OrderContext);
export { useOrderContext };
