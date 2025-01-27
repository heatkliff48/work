import { getOrders } from '#components/redux/actions/ordersAction.js';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
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
    {
      Header: 'Person in charge of the order',
      accessor: 'person_in_charge',
      Filter: DropdownFilter,
      sortType: 'person_in_charge',
    },
  ];

  const COLUMNS_ORDER_PRODUCT = [
    {
      Header: 'Product id',
      accessor: 'product_id',
      disableSortBy: true,
    },
    {
      Header: 'Quantity, m2',
      accessor: 'quantity_m2',
      sortType: 'number',
    },
    {
      Header: 'Quantity of pallets',
      accessor: 'quantity_palet',
      sortType: 'number',
    },
    {
      Header: 'Real quantity, m2',
      accessor: 'quantity_real',
      sortType: 'number',
    },
    {
      Header: 'Price, EURO per m2',
      accessor: 'price_m2',
      sortType: 'number',
    },
    {
      Header: 'Discount, %',
      accessor: 'discount',
      defaultValue: 0,
    },
    {
      Header: 'Final price, EURO',
      accessor: 'final_price',
      sortType: 'number',
    },
  ];

  const status_list = [
    {
      Header: 'Initial contact',
      accessor: 1,
    },
    {
      Header: 'Inquiry in progress',
      accessor: 2,
    },
    {
      Header: 'Proposal approved by us',
      accessor: 3,
    },
    {
      Header: 'Proposal accepted by client',
      accessor: 4,
    },
    {
      Header: 'Contracted order', // date
      accessor: 5,
    },
    {
      Header: 'Order allowed for production',
      accessor: 6,
    },
    {
      Header: 'Order produced',
      accessor: 7,
    },
    {
      Header: 'Shipping allowed',
      accessor: 8,
    },
    {
      Header: 'Order shipped',
      accessor: 9,
    },
    {
      Header: 'Order completed',
      accessor: 10,
    },
  ];

  const dispatch = useDispatch();
  const [currentOrder, setCurrentOrder] = useState();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productOfOrder, setProductOfOrder] = useState({});
  const [newOrder, setNewOrder] = useState();
  const [autoclave, setAutoclave] = useState([]);
  const [ordersDataList, setOrdersDataList] = useState([]);
  const [orderCartData, setOrderCartData] = useState({});
  const [isOrderReady, setIsOrderReady] = useState(false);
  const [quantityPallets, setQuantityPallets] = useState({});
  const [personsInChargeList, setPersonsInChargeList] = useState([]);

  const list_of_orders = useSelector((state) => state.orders);
  const productsOfOrders = useSelector((state) => state.productsOfOrders);
  const clients = useSelector((state) => state.clients);
  const deliveryAddresses = useSelector((state) => state.deliveryAddresses);
  const contactInfos = useSelector((state) => state.contactInfo);
  const autoclaveData = useSelector((state) => state.autoclave);
  const usersInfo = useSelector((state) => state.usersInfo);
  const usersMainInfo = useSelector((state) => state.usersMainInfo);

  useEffect(() => {
    dispatch(getOrders());
  }, [isOrderReady]);

  useEffect(() => {
    const filteredUsersList = usersMainInfo.filter(
      (user) => user.role === 2 || user.role === 16 || user.role === 17
    );

    const tempPersonsInChargeList = [
      {
        value: 0,
        label: 'None',
      },
    ];

    filteredUsersList.forEach((element) => {
      const label = usersInfo.find((user) => user.id === element.id)?.fullName;
      const value = element.id;

      tempPersonsInChargeList.push({ value, label });
    });

    setPersonsInChargeList(tempPersonsInChargeList);
  }, [usersMainInfo]);

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
        person_in_charge: order?.person_in_charge,
      };

      localStorage.setItem('orderCartData', JSON.stringify(currentOrder));
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
        autoclaveData,
        autoclave,
        setAutoclave,
        quantityPallets,
        setQuantityPallets,
        personsInChargeList,
        setPersonsInChargeList,
        usersInfo,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContextProvider;

const useOrderContext = () => useContext(OrderContext);
export { useOrderContext };
