import { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const WarehouseContext = createContext();

const WarehouseContextProvider = ({ children }) => {
  const COLUMNS_WAREHOUSE = [
    {
      Header: 'Article of warehouse',
      accessor: 'article',
      sortType: 'string',
    },
    {
      Header: 'Article of product',
      accessor: 'product_article',
      sortType: 'string',
    },
    {
      Header: 'Remaining stock',
      accessor: 'remaining_stock',
      sortType: 'number',
    },
    {
      Header: 'Warehouse location',
      accessor: 'warehouse_loc',
      sortType: 'string',
    },
    {
      Header: 'Type',
      accessor: 'type',
      sortType: 'string',
    },
  ];

  const COLUMNS_LIST_OF_ORDERED_PRODUCTION = [
    { Header: 'Date of shipping', accessor: 'shipping_date', sortType: 'string' },
    { Header: 'Product article', accessor: 'product_article', sortType: 'string' },
    { Header: 'Order article', accessor: 'order_article', sortType: 'string' },
    { Header: 'Quantity', accessor: 'quantity', sortType: 'number' },
    { Header: 'Quantity, cakes', accessor: 'quantity_cakes', sortType: 'number' },
    {
      Header: 'Quantity in batch',
      accessor: 'quantity_in_batch',
      sortType: 'number',
    },
    {
      Header: 'quantity in warehouse',
      accessor: 'quantity_in_warehouse',
      sortType: 'number',
    },
  ];

  const COLUMNS_LIST_OF_ORDERED_PRODUCTION_OEM = [
    { Header: 'Date of shipping', accessor: 'shipping_date', sortType: 'string' },
    { Header: 'Product article', accessor: 'product_article', sortType: 'string' },
    { Header: 'Order article', accessor: 'order_article', sortType: 'string' },
    { Header: 'Quantity', accessor: 'quantity', sortType: 'number' },
    { Header: 'Status', accessor: 'status', sortType: 'string' },
  ];

  const ordered_production_oem_status = [
    {
      Header: 'Not startered',
      accessor: 'not_start',
    },
    {
      Header: 'Ordered',
      accessor: 'ordered',
    },
    {
      Header: 'Shipped',
      accessor: 'shipped',
    },
    {
      Header: 'Done',
      accessor: 'done',
    },
  ];

  const warehouse_data = useSelector((state) => state.warehouse);
  const list_of_reserved_products = useSelector((state) => state.reservedProducts);
  const list_of_ordered_production = useSelector(
    (state) => state.listOfOrderedProduction
  );
  const list_of_ordered_production_oem = useSelector(
    (state) => state.listOfOrderedProductionOEM
  );
  const [filteredProducts, setFilteredProducts] = useState();
  const [currentOrderedProducts, setCurrentOrderedProducts] = useState({});
  const [currentBatchId, setCurrentBatchId] = useState(0);
  const [listOfOrderedCakes, setListOfOrderedCakes] = useState([]);

  const batchOutside = useSelector((state) => state.batchOutside);
  const list_of_orders = useSelector((state) => state.orders);
  const productsOfOrders = useSelector((state) => state.productsOfOrders);

  useEffect(() => {

    const data = list_of_ordered_production.map((el) => {
      const quantity_cakes = (el.quantity / 3).toFixed(2);
      const orderId = list_of_orders.find(
        (order) => order.article === el.order_article
      )?.id;

      const prodOrdId = productsOfOrders.filter((elem) => elem.order_id === orderId);

      const quantity_in_warehouse = list_of_reserved_products.find((res_prod) =>
        prodOrdId.find((prod) => res_prod.orders_products_id === prod.id)
      )?.quantity;

      const quantity_in_batch = (
        batchOutside.find((batch) => batch.id_list_of_ordered_production === el.id)
          ?.quantity_pallets / 3
      ).toFixed(2);

      return {
        ...el,
        quantity_cakes,
        quantity_in_batch,
        quantity_in_warehouse,
      };
    });
    setListOfOrderedCakes(data);

    const groupedOrders = list_of_ordered_production.reduce((acc, item) => {
      if (!acc[item.order_article]) {
        acc[item.order_article] = [];
      }
      acc[item.order_article].push(item);
      return acc;
    }, {});

    Object.entries(groupedOrders).forEach(([orderArticle, products]) => {
      const allMatch = products.every((product) => {
        const quantity_in_warehouse = list_of_reserved_products.find((res_prod) =>
          productsOfOrders
            .filter(
              (prod) =>
                prod.order_id ===
                list_of_orders.find(
                  (order) => order.article === product.order_article
                )?.id
            )
            .some((prod) => res_prod.orders_products_id === prod.id)
        )?.quantity;

        return quantity_in_warehouse === product.quantity;
      });

      if (allMatch) {
      }
    });
  }, [list_of_ordered_production, list_of_reserved_products, batchOutside]);

  return (
    <WarehouseContext.Provider
      value={{
        COLUMNS_WAREHOUSE,
        COLUMNS_LIST_OF_ORDERED_PRODUCTION,
        COLUMNS_LIST_OF_ORDERED_PRODUCTION_OEM,
        warehouse_data,
        list_of_reserved_products,
        list_of_ordered_production,
        list_of_ordered_production_oem,
        ordered_production_oem_status,
        filteredProducts,
        setFilteredProducts,
        currentOrderedProducts,
        setCurrentOrderedProducts,
        currentBatchId,
        setCurrentBatchId,
        listOfOrderedCakes,
        setListOfOrderedCakes,
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
};

export default WarehouseContextProvider;

const useWarehouseContext = () => useContext(WarehouseContext);
export { useWarehouseContext };
