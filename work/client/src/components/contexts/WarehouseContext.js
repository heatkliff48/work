import { updateOrderStatus } from '#components/redux/actions/ordersAction.js';
import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useProductsContext } from './ProductContext';

const WarehouseContext = createContext();

const WarehouseContextProvider = ({ children }) => {
  const dispatch = useDispatch();

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
    { Header: 'Quantity of pallets', accessor: 'quantity', sortType: 'number' },
    { Header: 'Quantity of cakes', accessor: 'quantity_cakes', sortType: 'number' },
    {
      Header: 'Quantity in batch, cakes',
      accessor: 'quantity_in_batch',
      sortType: 'number',
    },
    {
      Header: 'Quantity in warehouse, pallets',
      accessor: 'quantity_in_warehouse',
      sortType: 'number',
    },
  ];

  const COLUMNS_LIST_OF_ORDERED_PRODUCTION_OEM = [
    { Header: 'Date of shipping', accessor: 'shipping_date', sortType: 'string' },
    { Header: 'Product article', accessor: 'product_article', sortType: 'string' },
    { Header: 'Order article', accessor: 'order_article', sortType: 'string' },
    { Header: 'Quantity of pallets', accessor: 'quantity', sortType: 'number' },
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

  const order_status = [7, 8, 9, 10];

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
  const [filteredWarehouseByProduct, setFilteredWarehouseByProduct] = useState([]);

  const batchOutside = useSelector((state) => state.batchOutside);
  const list_of_orders = useSelector((state) => state.orders);
  const productsOfOrders = useSelector((state) => state.productsOfOrders);
  const { latestProducts } = useProductsContext();

  useEffect(() => {
    const data = list_of_ordered_production
      ?.filter((el) => {
        // Определение статуса заказа
        const orderStatus = list_of_orders?.find(
          (order) => order.article === el.order_article
        )?.status;

        // Исключение заказов с указанными статусами
        return ![7, 8, 9, 10].includes(orderStatus);
      })
      .map((el) => {
        // Рассчитать количество тортов
        const quantity_cakes = Math.ceil(el.quantity / 3);

        // Найти ID заказа
        const orderId = list_of_orders.find(
          (order) => order.article === el.order_article
        )?.id;

        // Найти ID продукта
        const productId = latestProducts.find(
          (product) => product.article === el.product_article
        )?.id;

        // Фильтровать продукты заказа
        const arrOfOrderProduct = productsOfOrders.filter(
          (elem) => elem.order_id === orderId && elem.product_id === productId
        );

        // const quantity_in_warehouse = arrOfOrderProduct.reduce((sum, elem) => {
        //   const reserved = list_of_reserved_products.find(
        //     (res_prod) => res_prod.orders_products_id === elem.id
        //   );
        //   return sum + (reserved ? reserved.quantity : 0);
        // }, 0);

        const quantity_in_warehouse = arrOfOrderProduct.reduce((sum, elem) => {
          // Filter to get all matching reserved products
          const reservedProducts = list_of_reserved_products.filter(
            (res_prod) => res_prod.orders_products_id === elem.id
          );

          // Sum up the 'quantity' of all matching reserved products
          const totalReservedQuantity = reservedProducts.reduce(
            (resSum, res_prod) => resSum + res_prod.quantity,
            0
          );

          return sum + totalReservedQuantity;
        }, 0);

        // Рассчитать количество в партии
        const quantity_in_batch =
          batchOutside.find((batch) => batch.id_list_of_ordered_production === el.id)
            ?.quantity_pallets / 3 || 0;

        return {
          ...el,
          quantity_cakes,
          quantity_in_batch,
          quantity_in_warehouse,
        };
      })
      .reduce((uniqueItems, item) => {
        if (
          !uniqueItems.some(
            (el) =>
              el.product_article === item.product_article &&
              el.order_article === item.order_article
          )
        ) {
          uniqueItems.push(item);
        }
        return uniqueItems;
      }, []);

    setListOfOrderedCakes(data);

    const groupedOrders = list_of_ordered_production.reduce((acc, item) => {
      const orderId = list_of_orders.find(
        (order) => order.article === item.order_article
      )?.id;

      const productId = latestProducts.find(
        (product) => product.article === item.product_article
      )?.id;

      const key = item.order_article;

      if (!acc[key]) {
        acc[key] = {
          orderId,
          products: [],
        };
      }

      const prodOrdId = productsOfOrders.filter(
        (elem) => elem.order_id === orderId && elem.product_id === productId
      );

      const reservedQuantities = prodOrdId.map((prod) => {
        const reserved = list_of_reserved_products.find(
          (res_prod) => res_prod.orders_products_id === prod.id
        );
        return reserved ? reserved.quantity : 0;
      });

      acc[key].products.push({
        product_article: item.product_article,
        total_quantity: item.quantity,
        total_quantity_in_warehouse: reservedQuantities.reduce(
          (sum, qty) => sum + qty,
          0
        ),
      });

      return acc;
    }, {});

    Object.values(groupedOrders).forEach((group) => {
      const order = list_of_orders.find((el) => el.id === group.orderId);
      if (order_status.includes(order?.status)) return;

      const allMatch = group.products.every(
        (product) => product.total_quantity <= product.total_quantity_in_warehouse
      );

      if (allMatch) {
        dispatch(
          updateOrderStatus({
            order_id: group.orderId,
            status: 7,
          })
        );
      }
    });
  }, [
    list_of_ordered_production,
    list_of_reserved_products,
    batchOutside,
    list_of_orders,
    productsOfOrders,
  ]);

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
        filteredWarehouseByProduct,
        setFilteredWarehouseByProduct,
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
};

export default WarehouseContextProvider;

const useWarehouseContext = () => useContext(WarehouseContext);
export { useWarehouseContext };
