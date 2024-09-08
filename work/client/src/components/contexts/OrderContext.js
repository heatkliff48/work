import { getOrders } from '#components/redux/actions/ordersAction.js';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
import { DropdownFilter } from '#components/Table/filters';

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
      Filter: DropdownFilter,
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

  const status_list = [
    {
      Header: 'Order approved',
      accessor: 'approved',
    },
    {
      Header: 'The order is accepted by the client',
      accessor: 'accepted',
    },
    {
      Header: 'The order is allowed to be transferred to production',
      accessor: 'transferred',
    },
    {
      Header: 'The order has been completed',
      accessor: 'completed',
    },
    {
      Header: 'Shipment allowed',
      accessor: 'shipment',
    },
    {
      Header: 'Order shipped',
      accessor: 'shipped',
    },
  ];

  const dispatch = useDispatch();
  const [currentOrder, setCurrentOrder] = useState();
  const [clientModalOrder, setClientModalOrder] = useState(false);
  const [productModalOrder, setProductModalOrder] = useState(false);
  const [productInfoModalOrder, setProductInfoModalOrder] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productOfOrder, setProductOfOrder] = useState({});
  const [newOrder, setNewOrder] = useState();
  const [ordersDataList, setOrdersDataList] = useState([]);
  const [orderCartData, setOrderCartData] = useState({});
  const [isOrderReady, setIsOrderReady] = useState(false);

  const list_of_orders = useSelector((state) => state.orders);
  const productsOfOrders = useSelector((state) => state.productsOfOrders);
  const clients = useSelector((state) => state.clients);
  const deliveryAddresses = useSelector((state) => state.deliveryAddresses);
  const contactInfos = useSelector((state) => state.contactInfo);

  useEffect(() => {
    // dispatch(getOrders());
  }, [dispatch, isOrderReady]);

  const getCurrentOrderInfoHandler = useCallback(
    (order_info) => {
      const order = list_of_orders.find((el) => el.article === order_info?.article);
      const client = clients.find((client) => client.id === order?.owner);
      const deliveryAddress = deliveryAddresses.find(
        (address) =>
          address.id === order?.del_adr_id && address.client_id === order?.owner
      );
      const contactInfo = contactInfos.find(
        (contact) =>
          contact.id === order?.contact_id && contact.client_id === order?.owner
      );

      const currentOrder = {
        id: order?.id,
        article: order?.article,
        status: order?.status,
        owner: client,
        deliveryAddress,
        contactInfo,
        shipping_date: order?.shipping_date,
      };

      localStorage.setItem('orderCartData', JSON.stringify(currentOrder));
      console.log('currentOrder', currentOrder);
      setOrderCartData(currentOrder);
    },
    [list_of_orders, clients, deliveryAddresses]
  );

  return (
    <OrderContext.Provider
      value={{
        COLUMNS_ORDERS,
        COLUMNS_ORDER_PRODUCT,
        currentOrder,
        setCurrentOrder,
        clientModalOrder,
        setClientModalOrder,
        productModalOrder,
        setProductModalOrder,
        newOrder,
        setNewOrder,
        list_of_orders,
        productsOfOrders,
        status_list,
        productOfOrder,
        setProductOfOrder,
        ordersDataList,
        setOrdersDataList,
        orderCartData,
        setOrderCartData,
        getCurrentOrderInfoHandler,
        isOrderReady,
        setIsOrderReady,
        selectedProduct,
        setSelectedProduct,
        productInfoModalOrder,
        setProductInfoModalOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContextProvider;

const useOrderContext = () => useContext(OrderContext);
export { useOrderContext };
