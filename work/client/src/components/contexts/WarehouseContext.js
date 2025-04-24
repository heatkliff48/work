import { updateOrderStatus } from '#components/redux/actions/ordersAction.js';
import {
  addNewReservedProducts,
  updateWarehouseQuantitys,
  updReservedProducts,
} from '#components/redux/actions/warehouseAction.js';
import { useNavigate } from 'react-router-dom';
import { useProductsContext } from './ProductContext';
import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const WarehouseContext = createContext();

const WarehouseContextProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      Header: 'Free quantity remaining',
      accessor: 'free_quantity_remaining',
      sortType: 'number',
    },
    {
      Header: 'Total quantity',
      accessor: 'total_quantity',
      sortType: 'number',
    },
    {
      Header: 'Ordered quantity',
      accessor: 'ordered_quantity',
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

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [filteredProducts, setFilteredProducts] = useState();
  const [currentOrderedProducts, setCurrentOrderedProducts] = useState({});
  const [currentBatchId, setCurrentBatchId] = useState(0);
  const [currentBatch, setCurrentBatch] = useState();
  const [listOfOrderedCakes, setListOfOrderedCakes] = useState([]);
  const [filteredWarehouseByProduct, setFilteredWarehouseByProduct] = useState([]);
  const [wmoctProduct, setWmoctProduct] = useState();
  const [wmoctProductShippedBD, setWmoctProductShippedBD] = useState([]);

  const batchOutside = useSelector((state) => state.batchOutside);
  const list_of_orders = useSelector((state) => state.orders);
  const productsOfOrders = useSelector((state) => state.productsOfOrders);
  const { latestProducts } = useProductsContext();

  const processOrders = (orderedProduction, groupedOrders) => {
    return orderedProduction.reduce((acc, item) => {
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
        return list_of_reserved_products.reduce((sum, res_prod) => {
          return res_prod.orders_products_id === prod.id
            ? sum + res_prod.quantity
            : sum;
        }, 0);
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
    }, groupedOrders);
  };

  const saveHandler = () => {
    const newReserved = [];
    const wh_arr = [];

    let orderId;

    console.log('wmoctProduct', wmoctProduct);
    wmoctProduct.forEach((el) => {
      const { orders_products_id, order_id } = el;
      orderId = order_id;

      el?.batches?.forEach((elem) => {
        const wh = warehouse_data.find((el) => el.article == elem.batchId);

        const haveReserve = list_of_reserved_products.find(
          (el) =>
            el.warehouse_id == wh.id && el.orders_products_id == orders_products_id
        );

        const obj = {
          warehouse_id: wh.id,
          orders_products_id,
          quantity: elem.allocated,
        };

        if (!haveReserve) {
          newReserved.push(obj);
          wh_arr.push({
            warehouse_id: wh.id,
            total_quantity: wh.total_quantity - elem.allocated,
            ordered_quantity: wh.ordered_quantity - elem.allocated,
          });
        }

        if (haveReserve && haveReserve.quantity != elem.allocated) {
          const quantity = haveReserve.quantity - elem.allocated;

          wh_arr.push({
            warehouse_id: wh.id,
            total_quantity: wh.total_quantity + quantity,
            ordered_quantity: wh.ordered_quantity + quantity,
          });
          dispatch(updReservedProducts(obj));
        }
      });
    });

    wh_arr.forEach((el) => {
      dispatch(updateWarehouseQuantitys(el));
    });

    const allShipped = wmoctProduct.every((el) => el.qty_total === el.shipped);

    if (allShipped) {
      dispatch(
        updateOrderStatus({
          order_id: orderId,
          status: 9,
        })
      );
    }

    dispatch(addNewReservedProducts(newReserved));
    setWmoctProductShippedBD([]);
    setSelectedOrder(null);
  };

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

        // // Найти ID заказа
        // const orderId = list_of_orders.find(
        //   (order) => order.article === el.order_article
        // )?.id;

        // // Найти ID продукта
        // const productId = latestProducts.find(
        //   (product) => product.article === el.product_article
        // )?.id;

        // // Фильтровать продукты заказа
        // const arrOfOrderProduct = productsOfOrders.filter(
        //   (elem) => elem.order_id === orderId && elem.product_id === productId
        // );

        // const quantity_in_warehouse = arrOfOrderProduct.reduce((sum, elem) => {
        //   // Filter to get all matching reserved products
        //   const reservedProducts = list_of_reserved_products?.filter(
        //     (res_prod) => res_prod?.orders_products_id === elem.id
        //   );

        //   // Sum up the 'quantity' of all matching reserved products
        //   const totalReservedQuantity = reservedProducts.reduce(
        //     (resSum, res_prod) => resSum + res_prod.quantity,
        //     0
        //   );

        //   return sum + totalReservedQuantity;
        // }, 0);

        // const quantity_in_warehouse = arrOfOrderProduct.reduce((sum, elem) => {
        //   let remainingToAllocate = elem.quantity_palet || 0; // Сколько нужно зарезервировать для этого товара

        //   const matchingWarehouseProducts =
        //     warehouse_data?.filter(
        //       (warehouseItem) => warehouseItem.product_article === el.product_article
        //     ) || []; // Если warehouse_data undefined, используем пустой массив

        //   // Проходим по складу и "забираем" остатки
        //   for (const warehouseItem of matchingWarehouseProducts) {
        //     if (
        //       remainingToAllocate > 0 &&
        //       warehouseItem.free_quantity_remaining > 0
        //     ) {
        //       const taken = Math.min(
        //         warehouseItem.free_quantity_remaining,
        //         remainingToAllocate
        //       );

        //       // Обновляем данные склада
        //       dispatch(
        //         updateRemainingStock({
        //           warehouse_id: warehouseItem?.id,
        //           free_quantity_remaining:
        //             warehouseItem.free_quantity_remaining - taken,
        //           ordered_quantity: (warehouseItem.ordered_quantity || 0) + taken,
        //         })
        //       );

        //       warehouseItem.free_quantity_remaining -= taken;
        //       warehouseItem.ordered_quantity =
        //         (warehouseItem.ordered_quantity || 0) + taken;

        //       remainingToAllocate -= taken;
        //     }
        //   }

        //   return sum + (elem.quantity_palet - remainingToAllocate); // Сколько реально зарезервировали
        // }, 0);

        // Рассчитать количество в партии
        const quantity_in_batch =
          batchOutside.find((batch) => batch.id_list_of_ordered_production === el.id)
            ?.quantity_pallets / 3 || 0;

        return {
          ...el,
          quantity_cakes,
          quantity_in_batch,
          // quantity_in_warehouse,
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

    // Группируем все позиции по order_article
    const ordersMap = list_of_ordered_production.reduce((acc, item) => {
      if (!acc.has(item.order_article)) {
        acc.set(item.order_article, []);
      }
      acc.get(item.order_article).push(item);
      return acc;
    }, new Map());

    // Проверяем каждый заказ на полную резервацию
    const fullyReservedOrders = Array.from(ordersMap.entries())
      .filter(([orderArticle, items]) => {
        // Проверяем, что ВСЕ позиции заказа имеют quantity === quantity_in_warehouse
        return items.every((item) => item.quantity === item.quantity_in_warehouse);
      })
      .map(([orderArticle]) => orderArticle); // Извлекаем только order_article

    fullyReservedOrders.forEach((order_article) => {
      const currOrder = list_of_orders.find(
        (order) => order.article === order_article
      );

      if (currOrder?.id && !order_status.includes(currOrder?.status)) {
        dispatch(
          updateOrderStatus({
            order_id: currOrder.id,
            status: 7,
          })
        );
      }
    });

    let groupedOrders = processOrders(list_of_ordered_production, {});

    groupedOrders = processOrders(list_of_ordered_production_oem, groupedOrders);

    Object.values(groupedOrders)?.forEach((group) => {
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
        currentBatch,
        setCurrentBatch,
        listOfOrderedCakes,
        setListOfOrderedCakes,
        filteredWarehouseByProduct,
        setFilteredWarehouseByProduct,
        wmoctProduct,
        setWmoctProduct,
        wmoctProductShippedBD,
        setWmoctProductShippedBD,
        saveHandler,
        selectedOrder,
        setSelectedOrder,
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
};

export default WarehouseContextProvider;

const useWarehouseContext = () => useContext(WarehouseContext);
export { useWarehouseContext };
