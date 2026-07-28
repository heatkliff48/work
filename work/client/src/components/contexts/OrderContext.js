// import { useNavigate } from 'react-router-dom';
import { DropdownFilter } from '#components/Table/filters';
import { TextSearchFilter } from '#components/Table/filters.js';
import {
  addAccountingDataList,
  getOrders,
  updAccountingDataList,
} from '#components/redux/actions/ordersAction.js';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

const OrderContext = createContext();

const OrderContextProvider = ({ children }) => {
  const COLUMNS_ORDERS = [
    {
      Header: 'Order number',
      accessor: 'article',
      disableSortBy: true,
    },
    {
      Header: 'Name of owner',
      accessor: 'owner',
      sortType: 'string',
    },
    {
      Header: 'Project name', // 'Delivery address',
      accessor: 'project_name', // del_adr_id
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
    },
  ];

  const COLUMNS_ACCOUNTING = [
    {
      Header: 'Order number',
      accessor: 'orders_article',
      disableSortBy: true,
    },
    {
      Header: 'Status of order',
      accessor: 'orders_status',
      disableSortBy: true,
    },
  ];

  const COLUMNS_ORDER_PRODUCT = [
    {
      Header: 'Description',
      accessor: 'product_title',
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
      Header: 'Price, EURO per m3',
      accessor: 'price_m3',
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

  const COLUMNS_ORDER_DRY_MIXES = [
    {
      Header: 'Product ID',
      accessor: 'dry_mixed_article',
      disableSortBy: true,
    },
    {
      Header: 'Quantity, Ud',
      accessor: 'quantity_ud',
      sortType: 'number',
    },
    {
      Header: 'Quantity of pallets',
      accessor: 'quantity_palet_dry',
      sortType: 'number',
    },
    {
      Header: 'Real quantity, ud',
      accessor: 'quantity_real_ud',
      sortType: 'number',
    },
    {
      Header: 'Total, kg',
      accessor: 'total',
      sortType: 'number',
    },
    {
      Header: 'Discount, %',
      accessor: 'discount',
      defaultValue: 0,
    },
    {
      Header: 'PVP',
      accessor: 'pvp',
      defaultValue: 0,
    },
    {
      Header: 'Final price, EURO',
      accessor: 'final_price',
      sortType: 'number',
    },
  ];

  const COLUMNS_ORDER_ANCHOR = [
    {
      Header: 'Product ID',
      accessor: 'anchor_article',
      disableSortBy: true,
    },
    {
      Header: 'Quantity, Ud',
      accessor: 'quantity_ud',
      sortType: 'number',
    },
    // {
    //   Header: 'Quantity of pallets',
    //   accessor: 'quantity_palet_anchor',
    //   sortType: 'number',
    // },
    {
      Header: 'Real quantity, ud',
      accessor: 'quantity_real_ud',
      sortType: 'number',
    },
    {
      Header: 'Total, kg',
      accessor: 'total',
      sortType: 'number',
    },
    {
      Header: 'Discount, %',
      accessor: 'discount',
      defaultValue: 0,
    },
    {
      Header: 'PVP',
      accessor: 'pvp',
      defaultValue: 0,
    },
    {
      Header: 'Final price, EURO',
      accessor: 'final_price',
      sortType: 'number',
    },
  ];

  const COLUMNS_ORDER_TOOL = [
    {
      Header: 'Product ID',
      accessor: 'tool_article',
      disableSortBy: true,
    },
    {
      Header: 'Quantity, Ud',
      accessor: 'quantity_ud',
      sortType: 'number',
    },
    {
      Header: 'Total, Ud',
      accessor: 'total',
      sortType: 'number',
    },
    {
      Header: 'Discount, %',
      accessor: 'discount',
      defaultValue: 0,
    },
    {
      Header: 'PVP',
      accessor: 'pvp',
      defaultValue: 0,
    },
    {
      Header: 'Final price, EURO',
      accessor: 'final_price',
      sortType: 'number',
    },
  ];

  const COLUMNS_ORDER_RELATED_MATERIAL = [
    {
      Header: 'Product ID',
      accessor: 'rel_mat_article',
      disableSortBy: true,
    },
    {
      Header: 'Quantity, Ud',
      accessor: 'quantity_ud',
      sortType: 'number',
    },
    {
      Header: 'Total, Ud',
      accessor: 'total',
      sortType: 'number',
    },
    {
      Header: 'Discount, %',
      accessor: 'discount',
      defaultValue: 0,
    },
    {
      Header: 'PVP',
      accessor: 'pvp',
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
    // {
    //   Header: 'Inquiry in progress',
    //   accessor: 2,
    // },
    // {
    //   Header: 'Proposal approved by us',
    //   accessor: 3,
    // },
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

  const filterKeysOrder = useMemo(
    () => [
      'id',
      'order_id',
      'client_id',
      'product_id',
      'createdAt',
      'updatedAt',
      'bitrix_id',
      'bitrix_client_id',
    ],
    [],
  );

  const dispatch = useDispatch();
  const [newOrder, setNewOrder] = useState();
  const [currentOrder, setCurrentOrder] = useState();
  const [isOrderReady, setIsOrderReady] = useState(false);
  const [storedData, setStoredData] = useState(null);
  const [accDataList, setAccDataList] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderCartData, setOrderCartData] = useState({});
  const [productOfOrder, setProductOfOrder] = useState({});
  const [quantityPallets, setQuantityPallets] = useState({});
  const [batchOrderIDs, setBatchOrderIDs] = useState([]);
  const [ordersDataList, setOrdersDataList] = useState([]);
  const [personsInChargeList, setPersonsInChargeList] = useState([]);
  const [productionBatchDesigner, setProductonBatchDesigner] = useState([]);
  const [randomOrderCheck, setRandomOrderCheck] = useState(false);
  const [randomFillComplete, setRandomFillComplete] = useState(false);

  const resetOrderState = () => {
    setNewOrder();
    setCurrentOrder();
    setIsOrderReady(false);
    setStoredData(null);
    setAccDataList(null);
    setSelectedProduct(null);
    setOrderCartData({});
    setProductOfOrder({});
    setQuantityPallets({});
    setBatchOrderIDs([]);
    setOrdersDataList([]);
    setPersonsInChargeList([]);
    setProductonBatchDesigner([]);
    setRandomOrderCheck(false);
    setRandomFillComplete(false);
  };

  const list_of_orders = useSelector((state) => state.orders);
  const accountingDataList = useSelector((state) => state.accountingDataList);
  const productsOfOrders = useSelector((state) => state.productsOfOrders);
  const dryMixedProductsOfOrders = useSelector(
    (state) => state.dryMixedProductsOfOrders,
  );

  const anchorProductsOfOrders = useSelector(
    (state) => state.anchorProductsOfOrders,
  );

  const toolProductsOfOrders = useSelector((state) => state.toolProductsOfOrders);

  const relMatProductsOfOrders = useSelector(
    (state) => state.relMatProductsOfOrders,
  );

  const clients = useSelector((state) => state.clients);
  const deliveryAddresses = useSelector((state) => state.deliveryAddresses);
  const contactInfos = useSelector((state) => state.contactInfo);
  const usersInfo = useSelector((state) => state.usersInfo);
  const usersMainInfo = useSelector((state) => state.usersMainInfo);

  const accountingAccessStatusList = [5, 7, 9];
  const accountingStatusList = [
    {
      Header: 'Allowed for production by accounting',
      accessor: 1,
    },
    {
      Header: 'Allowed to shipping by accounting',
      accessor: 2,
    },
    {
      Header: 'Allowed to close by accounting',
      accessor: 3,
    },
  ];

  const getAccountingStatus = (status) => {
    switch (status) {
      case 5:
        return 0;
      case 7:
        return 1;
      case 9:
        return 2;

      default:
        break;
    }
  };

  useEffect(() => {
    dispatch(getOrders());
  }, [isOrderReady]);

  useEffect(() => {
    if (
      !list_of_orders ||
      list_of_orders?.length == 0 ||
      !Array.isArray(list_of_orders)
    )
      return;

    list_of_orders?.forEach((el) => {
      const haveAproved = accDataList?.find(
        (acc) => acc.orders_article == el.article,
      );

      if (
        (el.status == 7 || el.status == 10 || el.status == 9) &&
        haveAproved?.aproved
      ) {
        dispatch(
          updAccountingDataList({
            orders_article: el?.article,
            aproved: false,
          }),
        );
      }
    });
  }, [list_of_orders, accDataList]);

  useEffect(() => {
    const filteredUsersList = usersMainInfo.filter(
      (user) => user.role === 2 || user.role === 16 || user.role === 17,
    );

    const tempPersonsInChargeList = [
      {
        value: 0,
        label: 'None',
      },
    ];

    filteredUsersList?.forEach((element) => {
      const label = usersInfo.find((user) => user.id === element.id)?.fullName;
      const value = element.id;

      tempPersonsInChargeList.push({ value, label });
    });

    setPersonsInChargeList(tempPersonsInChargeList);
  }, [usersMainInfo]);

  useEffect(() => {
    if (
      !list_of_orders ||
      list_of_orders?.length == 0 ||
      !Array.isArray(list_of_orders)
    )
      return;

    const order = list_of_orders.find((el) => el.id == orderCartData.id);
    setOrderCartData((prev) => {
      const secondaryContact = order?.secondary_contact
        ? contactInfos.find((contact) => contact.id === order.secondary_contact)
        : order?.secondary_contact;

      return { ...prev, secondaryContact };
    });
  }, [list_of_orders]);

  const getCurrentOrderInfoHandler = useCallback(
    (order_info) => {
      if (
        !list_of_orders ||
        list_of_orders?.length == 0 ||
        !Array.isArray(list_of_orders)
      )
        return;
      const orderId = order_info?.id ?? order_info?.order_id;
      const order = list_of_orders.find((el) => el.id === orderId);
      if (!order) return;

      const client = clients.find((client) => client.id === order?.owner);
      const deliveryAddress = deliveryAddresses.find(
        (address) =>
          address.id === order?.del_adr_id && address.client_id === order?.owner,
      );
      const contactInfo = contactInfos.find(
        (contact) =>
          contact.id === order?.contact_id && contact.client_id === order?.owner,
      );

      const secondaryContact = order?.secondary_contact
        ? contactInfos.find((contact) => contact.id == order.secondary_contact)
        : order?.secondary_contact;

      const currentOrder = {
        id: order?.id,
        article: order?.article,
        status: order?.status,
        owner: client,
        deliveryAddress,
        description: order?.description,
        contactInfo: contactInfo,
        secondaryContact,
        shipping_date: order?.shipping_date,
        person_in_charge: order?.person_in_charge,
        delivery: order?.delivery,
        main_order: order?.main_order ?? null,
        region: order?.region ?? null,
      };

      localStorage.setItem('orderCartData', JSON.stringify(currentOrder));
      setOrderCartData(currentOrder);
    },
    [list_of_orders, clients, deliveryAddresses],
  );

  useEffect(() => {
    if (
      !list_of_orders ||
      list_of_orders?.length == 0 ||
      !Array.isArray(list_of_orders)
    )
      return;
    list_of_orders?.forEach((order) => {
      if (
        accountingAccessStatusList.find((el) => el == order.status) &&
        !accountingDataList?.some((el) => el.orders_article == order.article)
      ) {
        dispatch(
          addAccountingDataList({
            orders_article: order.article,
            orders_status: order.status,
            aproved: false,
          }),
        );
      }
    });
  }, [list_of_orders]);

  useEffect(() => {
    if (
      !list_of_orders ||
      list_of_orders?.length == 0 ||
      !Array.isArray(list_of_orders)
    )
      return;
    if (list_of_orders && clients && deliveryAddresses) {
      const newArray = list_of_orders.map((order) => {
        const { id, article, status, shipping_date, person_in_charge } = order;
        const client = clients.find((client) => client.id === order.owner);
        const deliveryAddress = deliveryAddresses.find(
          (address) =>
            address.id === order.del_adr_id && address.client_id === order.owner,
        );

        return {
          id,
          article,
          description: order?.description,
          status:
            status_list?.find((stat) => stat.accessor == status)?.Header || status,
          owner: client ? client.c_name : '',
          project_name: deliveryAddress ? deliveryAddress.project_name : '',
          shipping_date,
          person_in_charge:
            person_in_charge != 0
              ? usersInfo.find((user) => user.id === person_in_charge)?.fullName
              : 'None',
        };
      });

      const uniqueArray = newArray.filter(
        (obj, index, self) => index === self.findIndex((el) => el.id === obj.id),
      );

      setOrdersDataList(uniqueArray);
    }
  }, [list_of_orders, clients, deliveryAddresses]);

  return (
    <OrderContext.Provider
      value={{
        COLUMNS_ORDERS,
        COLUMNS_ACCOUNTING,
        COLUMNS_ORDER_PRODUCT,
        COLUMNS_ORDER_DRY_MIXES,
        COLUMNS_ORDER_ANCHOR,
        COLUMNS_ORDER_TOOL,
        COLUMNS_ORDER_RELATED_MATERIAL,
        currentOrder,
        setCurrentOrder,
        newOrder,
        setNewOrder,
        list_of_orders,
        productsOfOrders,
        dryMixedProductsOfOrders,
        anchorProductsOfOrders,
        toolProductsOfOrders,
        relMatProductsOfOrders,
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
        quantityPallets,
        setQuantityPallets,
        personsInChargeList,
        setPersonsInChargeList,
        usersInfo,
        productionBatchDesigner,
        setProductonBatchDesigner,
        batchOrderIDs,
        setBatchOrderIDs,
        accountingDataList,
        accountingStatusList,
        storedData,
        setStoredData,
        accDataList,
        setAccDataList,
        getAccountingStatus,
        deliveryAddresses,
        randomOrderCheck,
        setRandomOrderCheck,
        randomFillComplete,
        setRandomFillComplete,
        filterKeysOrder,
        resetOrderState
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContextProvider;

const useOrderContext = () => useContext(OrderContext);
export { useOrderContext };
