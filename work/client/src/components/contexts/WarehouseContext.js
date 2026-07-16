import {
  updAccountingDataList,
  updateOrderStatus,
} from '#components/redux/actions/ordersAction.js';
import {
  addNewAnchorReservedProducts,
  addNewDryMixedReservedProducts,
  addNewRelMatReservedProducts,
  addNewReservedProducts,
  addNewToolReservedProducts,
  changeStatusWarehouseManagerTrailer,
  deleteWarehouseManagerTrailer,
  updAnchorReservedProducts,
  updateWarehouseQuantitys,
  updDryMixedReservedProducts,
  updRelMatReservedProducts,
  updReservedProducts,
  updToolReservedProducts,
} from '#components/redux/actions/warehouseAction.js';
import { useNavigate } from 'react-router-dom';
import { useProductsContext } from './ProductContext';
import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewAldabaran } from '#components/redux/actions/aldabaranAction.js';

const WarehouseContext = createContext();

const WarehouseContextProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const COLUMNS_WAREHOUSE = [
    {
      Header: 'Warehouse ID',
      accessor: 'article',
      sortType: 'string',
    },
    {
      Header: 'Product ID',
      accessor: 'product_article',
      sortType: 'string',
    },
    {
      Header: 'Free quantity remaining, pallet',
      accessor: 'free_quantity_remaining',
      sortType: 'number',
    },
    {
      Header: 'Total quantity, pallet',
      accessor: 'total_quantity',
      sortType: 'number',
    },
    {
      Header: 'Ordered quantity, pallet',
      accessor: 'ordered_quantity',
      sortType: 'number',
    },
    {
      Header: 'Total m3',
      accessor: 'total_m3',
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
    {
      Header: 'Quantity on sorting',
      accessor: 'sorting',
      sortType: 'number',
    },
    {
      Header: 'Batch ID',
      accessor: 'batch_id',
      sortType: 'number',
    },
    {
      Header: 'Production date',
      accessor: 'production_date',
    },
  ];

  const COLUMNS_WAREHOUSE_AUX = [
    {
      Header: 'Warehouse ID',
      accessor: 'article',
      sortType: 'string',
    },
    {
      Header: 'Product ID',
      accessor: 'product_article',
      sortType: 'string',
    },
    {
      Header: 'Free quantity remaining, pallet',
      accessor: 'free_quantity_remaining',
      sortType: 'number',
    },
    {
      Header: 'Total quantity, pallet',
      accessor: 'total_quantity',
      sortType: 'number',
    },
    {
      Header: 'Ordered quantity, pallet',
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

  const COLUMNS_WAREHOUSE_ADD_MODAL = [
    {
      Header: 'Warehouse ID',
      accessor: 'article',
      sortType: 'string',
    },
    {
      Header: 'Product',
      accessor: 'product_article',
      sortType: 'string',
    },
    {
      Header: 'Product',
      accessor: 'description',
      sortType: 'string',
    },
    {
      Header: 'Quantity OK, pallet',
      accessor: 'quantity_ok',
      sortType: 'number',
    },
    {
      Header: 'Quantity sorting, pallet',
      accessor: 'quantity_sorting',
      sortType: 'number',
    },
    {
      Header: 'Warehouse location',
      accessor: 'warehouse_loc',
      sortType: 'string',
    },
    {
      Header: 'Batch ID',
      accessor: 'batch_id',
      sortType: 'number',
    },
  ];

  const COLUMNS_RAW_MATERIALS_WAREHOUSE = [
    {
      Header: 'Material type',
      accessor: 'material_type',
      sortType: 'string',
    },
    {
      Header: 'Remaining quantity',
      accessor: 'remaining_quantity',
      sortType: 'number',
    },
    {
      Header: 'Last updated',
      accessor: 'last_updated',
      sortType: 'string',
    },
  ];

  const COLUMNS_LIST_OF_ORDERED_PRODUCTION = [
    {
      Header: 'Date of shipping',
      accessor: 'shipping_date',
      sortType: 'string',
    },
    {
      Header: 'Product article',
      accessor: 'product_article',
      sortType: 'string',
    },
    { Header: 'Order article', accessor: 'order_article', sortType: 'string' },
    { Header: 'Quantity of pallets', accessor: 'quantity', sortType: 'number' },
    {
      Header: 'Quantity of cakes',
      accessor: 'quantity_cakes',
      sortType: 'number',
    },
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
    {
      Header: 'Date of shipping',
      accessor: 'shipping_date',
      sortType: 'string',
    },
    {
      Header: 'Product article',
      accessor: 'product_article',
      sortType: 'string',
    },
    { Header: 'Order article', accessor: 'order_article', sortType: 'string' },
    { Header: 'Quantity of pallets', accessor: 'quantity', sortType: 'number' },
    { Header: 'Status', accessor: 'status', sortType: 'string' },
  ];

  const COLUMNS_RELATED_MATERIALS_BACKORDER_LIST = [
    {
      Header: 'Date of shipping',
      accessor: 'shipping_date',
      sortType: 'string',
    },
    {
      Header: 'Product article',
      accessor: 'product_article',
      sortType: 'string',
    },
    { Header: 'Order article', accessor: 'order_article', sortType: 'string' },
    { Header: 'Quantity', accessor: 'quantity', sortType: 'number' },
    {
      Header: 'Quantity in warehouse, pallets',
      accessor: 'quantity_in_warehouse',
      sortType: 'number',
    },
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
  const autoclave_calendar = useSelector((state) => state.autoclave_calendar);
  const dry_mixes_warehouse_data = useSelector((state) => state.dryMixesWarehouse);
  const related_materials_warehouse_data = useSelector(
    (state) => state.relatedMaterialsWarehouse,
  );
  const anchors_warehouse_data = useSelector((state) => state.anchorsWarehouse);
  const tools_warehouse_data = useSelector((state) => state.toolsWarehouse);
  const order_dispatch_data = useSelector((state) => state.orderDispatch);

  const warehouseMap = {
    product: warehouse_data,
    dryMixed: dry_mixes_warehouse_data,
    anchor: anchors_warehouse_data,
    tool: tools_warehouse_data,
    relMat: related_materials_warehouse_data,
  };

  const list_of_reserved_products = useSelector((state) => state.reservedProducts);

  const list_of_dry_mix_reserved_products = useSelector(
    (state) => state.reservedDryMixedProducts,
  );

  const list_of_anchor_reserved_products = useSelector(
    (state) => state.reservedAnchorProducts,
  );

  const list_of_tool_reserved_products = useSelector(
    (state) => state.reservedToolProducts,
  );

  const list_of_rel_mat_reserved_products = useSelector(
    (state) => state.reservedRelMatProducts,
  );

  const list_of_ordered_production = useSelector(
    (state) => state.listOfOrderedProduction,
  );
  const list_of_ordered_production_oem = useSelector(
    (state) => state.listOfOrderedProductionOEM,
  );
  const related_materials_backorder_list = useSelector(
    (state) => state.relatedMaterialsBackorderList,
  );

  const raw_materials_warehouse = useSelector(
    (state) => state.rawMaterialsWarehouse,
  );

  const warehouse_sand_slurry = useSelector((state) => state.warehouseSandSlurry);

  const reservedMap = {
    product: list_of_reserved_products,
    dryMixed: list_of_dry_mix_reserved_products,
    anchor: list_of_anchor_reserved_products,
    tool: list_of_tool_reserved_products,
    relMat: list_of_rel_mat_reserved_products,
  };

  const aldabaran = useSelector((state) => state.aldabaran);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [aldabaranNum, setAldabaranNum] = useState(null);

  const [currentBatchId, setCurrentBatchId] = useState(0);
  const [qualityManagerChange, setQualityManagerChange] = useState(false);
  const [currentBatch, setCurrentBatch] = useState();
  const [wmoctProduct, setWmoctProduct] = useState();
  const [filteredProducts, setFilteredProducts] = useState();
  const [additionalInfoPDF, setAdditionalInfoPDF] = useState({});
  const [currentOrderedProducts, setCurrentOrderedProducts] = useState({});
  const [listOfOrderedCakes, setListOfOrderedCakes] = useState([]);
  const [wmoctProductShippedBD, setWmoctProductShippedBD] = useState([]);
  const [listOfOrderedAuxilary, setListOfOrderedAuxilary] = useState([]);
  const [wmoctProductDeltaForPdf, setWmoctProductDeltaForPdf] = useState([]);
  const [filteredWarehouseByProduct, setFilteredWarehouseByProduct] = useState([]);

  const batchOutside = useSelector((state) => state.batchOutside);
  const list_of_orders = useSelector((state) => state.orders);
  const productsOfOrders = useSelector((state) => state.productsOfOrders);
  const dryMixedProductsOfOrders = useSelector(
    (state) => state.dryMixedProductsOfOrders,
  );

  const { latestProducts } = useProductsContext();

  const getProductsByOrder = (orderId, productsOfType, productArr) => {
    return productsOfType
      .filter((prod) => prod.order_id == orderId)
      .map((prod) => {
        const productId =
          prod.product_id ||
          prod.dry_mixed_id ||
          prod.anchor_id ||
          prod.tool_id ||
          prod.rel_mat_id;

        const quantity =
          prod?.quantity_palet ||
          prod?.quantity_palet_dry ||
          prod?.quantity_palet_anchor ||
          prod?.quantity_ud;

        const lProduct = productArr?.find((lp) => lp.id === productId);

        return `${lProduct?.article || '???'}: ${quantity}, `;
      });
  };

  function getProductType(article) {
    if (article.startsWith('T.')) return 'product';
    if (article.startsWith('X.P')) return 'relMat';
    if (article.startsWith('X.T')) return 'tool';
    if (article.startsWith('X.M')) return 'dryMixed';
    if (article.startsWith('X.F')) return 'anchor';
    return 'UNKNOWN';
  }

  const getWarehouseArticle = (product) => {
    let versionNumber = '0001';
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const day = new Date().getDate();

    const certificate = product?.certificate?.slice(0, 1);
    const density = product?.density?.toString().slice(0, 1);

    const articleId = warehouse_data.length === 0 ? 1 : warehouse_data.length + 1;
    versionNumber = `0000000${articleId}`.slice(-6);

    const warehouseArticle = `S00${certificate}${density}${year}${month}${day}${versionNumber}`;

    return warehouseArticle;
  };

  // const saveHandler = () => {
  //   const newReserved = [];
  //   const wh_arr = [];

  //   let orderId;

  //   wmoctProduct.forEach((el) => {
  //     const { orders_products_id, order_id } = el;
  //     orderId = order_id;

  //     const type = getProductType(el.article);
  //     const warehouse_arr = warehouseMap[type];
  //     const reserved_arr = reservedMap[type];

  //     el?.batches?.forEach((elem) => {
  //       const wh = warehouse_arr.find(
  //         (elwh) =>
  //           elwh.article == elem.batchId && elwh.product_article == el.article,
  //       );

  //       const haveReserve = reserved_arr.find(
  //         (el) =>
  //           el.warehouse_id == wh.id && el.orders_products_id == orders_products_id,
  //       );

  //       const prevQty = (haveReserve?.quantity ?? elem?.minAllocated ?? 0) || 0;

  //       const obj = {
  //         article: el.article,
  //         warehouse_id: wh.id,
  //         orders_products_id,
  //         quantity: elem.allocated,
  //       };

  //       if (prevQty === 0 && elem.allocated > 0) {
  //         newReserved.push(obj);
  //         console.log(`New reserved added for ${type}:`, obj);
  //       }

  //       if (!haveReserve) {
  //         wh_arr.push({
  //           warehouse_id: wh.id,
  //           product_article: wh.product_article,
  //           total_quantity: wh.total_quantity - elem.allocated,
  //           ordered_quantity: wh.ordered_quantity - elem.allocated,
  //           type,
  //         });
  //       }

  //       if (haveReserve && haveReserve.quantity != elem.allocated) {
  //         const quantity = haveReserve.quantity - elem.allocated;

  //         wh_arr.push({
  //           warehouse_id: wh.id,
  //           product_article: wh.product_article,
  //           total_quantity: wh.total_quantity + quantity,
  //           ordered_quantity: wh.ordered_quantity + quantity,
  //           type,
  //         });

  //         switch (type) {
  //           case 'product':
  //             dispatch(updReservedProducts(obj));
  //             break;

  //           case 'relMat':
  //             dispatch(updRelMatReservedProducts(obj));
  //             break;

  //           case 'tool':
  //             dispatch(updToolReservedProducts(obj));
  //             break;

  //           case 'dryMixed':
  //             dispatch(updDryMixedReservedProducts(obj));
  //             break;

  //           case 'anchor':
  //             dispatch(updAnchorReservedProducts(obj));
  //             break;

  //           default:
  //             break;
  //         }
  //       }
  //     });
  //   });

  //   dispatch(updateWarehouseQuantitys(wh_arr));

  //   const allShipped = wmoctProduct.every((el) => el.qty_total === el.shipped);

  //   console.log('allShipped WarehouseContext.js line 494', allShipped)
  //   if (allShipped) {
  //     const article = list_of_orders.find((el) => el.id == orderId)?.article;
  //     dispatch(
  //       updateOrderStatus({
  //         order_id: orderId,
  //         status: 9,
  //       }),
  //     );

  //     dispatch(
  //       updAccountingDataList({
  //         orders_article: article,
  //         aproved: false,
  //       }),
  //     );
  //   }

  //   const pad = (n) => String(n).padStart(2, '0');

  //   const now = new Date();
  //   const dateTimeStr =
  //     `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
  //     `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  //   // dispatch(addNewAldabaran({ num: aldabaranNum, data: dateTimeStr }));

  //   const grouped = {
  //     product: [],
  //     relMat: [],
  //     tool: [],
  //     dryMixed: [],
  //     anchor: [],
  //   };

  //   newReserved.forEach((item) => {
  //     const { article, warehouse_id, orders_products_id, quantity } = item;

  //     const obj = { warehouse_id, orders_products_id, quantity };

  //     if (article.startsWith('T.')) {
  //       grouped.product.push(obj);
  //     } else if (article.startsWith('X.P')) {
  //       grouped.relMat.push(obj);
  //     } else if (article.startsWith('X.T')) {
  //       grouped.tool.push(obj);
  //     } else if (article.startsWith('X.M')) {
  //       grouped.dryMixed.push(obj);
  //     } else if (article.startsWith('X.F')) {
  //       grouped.anchor.push(obj);
  //     }
  //   });

  //   Object.entries(grouped).forEach(([key, items]) => {
  //     if (typeof items !== 'undefined' && items.length > 0) {
  //       switch (key) {
  //         case 'product':
  //           dispatch(addNewReservedProducts(items));
  //           break;

  //         case 'relMat':
  //           dispatch(addNewRelMatReservedProducts(items));
  //           break;

  //         case 'tool':
  //           dispatch(addNewToolReservedProducts(items));
  //           break;

  //         case 'dryMixed':
  //           dispatch(addNewDryMixedReservedProducts(items));
  //           break;

  //         case 'anchor':
  //           dispatch(addNewAnchorReservedProducts(items));
  //           break;

  //         default:
  //           break;
  //       }
  //     }
  //   });

  //   setWmoctProductShippedBD([]);
  //   setSelectedOrder(null);
  // };

  const normalizeProductType = (type) => {
    if (type === 'dryMix') return 'dryMixed';
    return type;
  };

  const saveHandler = async () => {
    if (!Array.isArray(wmoctProduct) || wmoctProduct.length === 0) return;

    const getWarehouseProductArticle = (warehouseItem) => {
      return (
        warehouseItem?.product_article ||
        warehouseItem?.dry_mixed_article ||
        warehouseItem?.anchor_article ||
        warehouseItem?.tool_article ||
        warehouseItem?.rel_mat_article ||
        ''
      );
    };

    const getAddReserveAction = (type) => {
      switch (type) {
        case 'product':
          return addNewReservedProducts;

        case 'relMat':
          return addNewRelMatReservedProducts;

        case 'tool':
          return addNewToolReservedProducts;

        case 'dryMixed':
          return addNewDryMixedReservedProducts;

        case 'anchor':
          return addNewAnchorReservedProducts;

        default:
          return null;
      }
    };

    const getUpdateReserveAction = (type) => {
      switch (type) {
        case 'product':
          return updReservedProducts;

        case 'relMat':
          return updRelMatReservedProducts;

        case 'tool':
          return updToolReservedProducts;

        case 'dryMixed':
          return updDryMixedReservedProducts;

        case 'anchor':
          return updAnchorReservedProducts;

        default:
          return null;
      }
    };

    const orderId = Number(selectedOrder?.order_id ?? wmoctProduct[0]?.order_id);

    const trailer = Number(selectedOrder?.trailer ?? wmoctProduct[0]?.trailer);

    if (!orderId || !trailer) {
      console.error('orderId or trailer is missing:', {
        orderId,
        trailer,
        selectedOrder,
      });

      return false;
    }

    const makeDispatchReserveKey = (type, orderDispatchId) => {
      return `${normalizeProductType(type)}_${Number(orderDispatchId)}`;
    };

    const newReservedGrouped = {
      product: [],
      relMat: [],
      tool: [],
      dryMixed: [],
      anchor: [],
    };

    const warehouseUpdatesMap = new Map();

    const reservedByDispatch = new Map();

    Object.entries(reservedMap).forEach(([type, reservedArr]) => {
      const normalizedType = normalizeProductType(type);

      (reservedArr || []).forEach((reservedItem) => {
        const orderDispatchId = Number(reservedItem.order_dispatch_id);

        if (!orderDispatchId) return;

        const key = makeDispatchReserveKey(normalizedType, orderDispatchId);

        const previous = reservedByDispatch.get(key) || 0;

        reservedByDispatch.set(key, previous + Number(reservedItem.quantity || 0));
      });
    });

    wmoctProduct.forEach((product) => {
      const type = normalizeProductType(
        product.product_type || getProductType(product.article),
      );

      const warehouseArr = warehouseMap[type] || [];
      const reservedArr = reservedMap[type] || [];

      const ordersProductsId = Number(product.orders_products_id);

      const orderDispatchId = Number(product.order_dispatch_id);

      if (!ordersProductsId) {
        console.warn('orders_products_id is missing:', product);
        return;
      }

      if (!orderDispatchId) {
        console.warn(
          'order_dispatch_id is missing. Reserve cannot be linked to trailer:',
          product,
        );
        return;
      }

      product?.batches?.forEach(async (batch) => {
        const allocated = Number(batch.allocated || 0);
        const minAllocated = Number(batch.minAllocated || 0);

        const delta = allocated - minAllocated;

        if (delta <= 0) return;

        const warehouseItem =
          warehouseArr.find((wh) => Number(wh.id) === Number(batch.warehouseId)) ||
          warehouseArr.find((wh) => {
            const productArticle = getWarehouseProductArticle(wh);

            return (
              wh.article === batch.batchId && productArticle === product.article
            );
          });

        if (!warehouseItem) {
          console.warn('Warehouse item not found:', {
            product,
            batch,
            type,
          });
          return;
        }

        const existingReserve = reservedArr.find(
          (reservedItem) =>
            Number(reservedItem.warehouse_id) === Number(warehouseItem.id) &&
            Number(reservedItem.orders_products_id) === Number(ordersProductsId) &&
            Number(reservedItem.order_dispatch_id) === Number(orderDispatchId),
        );

        if (existingReserve) {
          const nextQuantity = Number(existingReserve.quantity || 0) + delta;

          const updateAction = getUpdateReserveAction(type);

          if (updateAction) {
            await dispatch(
              updateAction({
                article: product.article,
                warehouse_id: warehouseItem.id,
                orders_products_id: ordersProductsId,
                order_dispatch_id: orderDispatchId,
                quantity: nextQuantity,
              }),
            );
          }
        } else {
          newReservedGrouped[type].push({
            warehouse_id: warehouseItem.id,
            orders_products_id: ordersProductsId,
            order_dispatch_id: orderDispatchId,
            quantity: delta,
          });
        }

        const reservedKey = makeDispatchReserveKey(type, orderDispatchId);

        const previousReserved = reservedByDispatch.get(reservedKey) || 0;

        reservedByDispatch.set(reservedKey, previousReserved + delta);

        const warehouseUpdateKey = `${type}_${Number(warehouseItem.id)}`;

        const previousWarehouseUpdate = warehouseUpdatesMap.get(
          warehouseUpdateKey,
        ) || {
          warehouseItem,
          type,
          delta: 0,
        };

        previousWarehouseUpdate.delta += delta;

        warehouseUpdatesMap.set(warehouseUpdateKey, previousWarehouseUpdate);
      });
    });

    const wh_arr = Array.from(warehouseUpdatesMap.values()).map(
      ({ warehouseItem, type, delta }) => ({
        warehouse_id: warehouseItem.id,
        product_article: getWarehouseProductArticle(warehouseItem),
        total_quantity: Math.max(
          Number(warehouseItem.total_quantity || 0) - delta,
          0,
        ),
        ordered_quantity: Math.max(
          Number(warehouseItem.ordered_quantity || 0) - delta,
          0,
        ),
        type,
      }),
    );

    if (wh_arr.length > 0) {
      await dispatch(updateWarehouseQuantitys(wh_arr));
    }

    Object.entries(newReservedGrouped).forEach(async ([type, items]) => {
      if (!items.length) return;

      const addAction = getAddReserveAction(type);

      if (addAction) {
        await dispatch(addAction(items));
      }
    });

    const createReservationCheck = (dispatchRows) =>
      dispatchRows.map((dispatchRow) => {
        const orderDispatchId = Number(dispatchRow.id);

        const type = normalizeProductType(dispatchRow.product_table);

        const plannedQuantity = Number(dispatchRow.quantity || 0);

        const key = makeDispatchReserveKey(type, orderDispatchId);

        const reservedQuantity = Number(reservedByDispatch.get(key) || 0);

        return {
          orderDispatchId,
          orderId: Number(dispatchRow.orderId),
          trailer: Number(dispatchRow.trailer),
          article: dispatchRow.article,
          type,
          plannedQuantity,
          reservedQuantity,
          missing: Math.max(plannedQuantity - reservedQuantity, 0),
        };
      });

    const dispatchRowsForTrailer = (order_dispatch_data || []).filter(
      (item) => Number(item.orderId) === orderId && Number(item.trailer) === trailer,
    );

    const trailerReservationCheck = createReservationCheck(dispatchRowsForTrailer);

    const allTrailerReserved =
      trailerReservationCheck.length > 0 &&
      trailerReservationCheck.every(
        (item) =>
          item.orderDispatchId > 0 && item.reservedQuantity >= item.plannedQuantity,
      );

    console.table(trailerReservationCheck);

    console.log('allTrailerReserved:', {
      orderId,
      trailer,
      allTrailerReserved,
    });

    if (allTrailerReserved) {
      await dispatch(
        changeStatusWarehouseManagerTrailer({
          orderId,
          trailer,
          status: 2,
        }),
      );
    }

    const dispatchRowsForOrder = (order_dispatch_data || []).filter(
      (item) => Number(item.orderId) === Number(orderId),
    );

    const reservationCheck = dispatchRowsForOrder.map((dispatchRow) => {
      const orderDispatchId = Number(dispatchRow.id);

      const type = normalizeProductType(dispatchRow.product_table);

      const plannedQuantity = Number(dispatchRow.quantity || 0);

      const key = makeDispatchReserveKey(type, orderDispatchId);

      const reservedQuantity = reservedByDispatch.get(key) || 0;

      return {
        orderDispatchId,
        trailer: Number(dispatchRow.trailer),
        article: dispatchRow.article,
        type,
        plannedQuantity,
        reservedQuantity,
        missing: Math.max(plannedQuantity - reservedQuantity, 0),
      };
    });

    const dispatchRowsWithoutId = reservationCheck.filter(
      (item) => !item.orderDispatchId,
    );

    const missingReservations = reservationCheck.filter((item) => item.missing > 0);

    const allOrderReserved =
      dispatchRowsForOrder.length > 0 &&
      dispatchRowsWithoutId.length === 0 &&
      missingReservations.length === 0;

    console.table(reservationCheck);

    console.log('dispatchRowsWithoutId:', dispatchRowsWithoutId);

    console.log('missingReservations:', missingReservations);

    console.log('allOrderReserved:', allOrderReserved);

    const pad = (n) => String(n).padStart(2, '0');

    const now = new Date();
    const dateTimeStr =
      `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
      `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const aldabaran_data = {
      num: aldabaranNum,
      data: dateTimeStr,
      ...additionalInfoPDF,
    };

    dispatch(addNewAldabaran({ num: aldabaranNum, data: dateTimeStr }));

    if (allOrderReserved) {
      const order = list_of_orders.find(
        (item) => Number(item.id) === Number(orderId),
      );

      const article = order?.article;

      if (!article) {
        return false;
      }

      try {
        await dispatch(
          updateOrderStatus({
            order_id: orderId,
            status: 9,
          }),
        );

        await dispatch(
          updAccountingDataList({
            orders_article: article,
            aproved: false,
          }),
        );

        await dispatch(
          changeStatusWarehouseManagerTrailer({
            orderId,
            status: 4,
          }),
        );

        navigate('/warehouse_manager');

        // await dispatch(deleteWarehouseManagerTrailer(orderId));
      } catch (error) {
        console.error('Failed to complete warehouse order:', error);

        return false;
      }
    }

    return true;
  };

  const distributeToSources = (sources, amount, onEachUpdate) => {
    let remaining = amount;
    const out = sources.map((s) => ({ ...s }));

    for (const s of out) {
      if (remaining <= 0) break;
      const residue =
        s.cakes_residue ??
        Math.max((s.total_cakes || 0) - (s.cakes_in_batch || 0), 0);
      const take = Math.min(residue, remaining);
      if (take <= 0) continue;

      s.cakes_in_batch = (s.cakes_in_batch || 0) + take;
      s.cakes_residue = Math.max(residue - take, 0);
      remaining -= take;

      onEachUpdate?.(s, take);
    }

    return { sources: out, placed: amount - remaining, leftover: remaining };
  };

  const collectFromSources = (sources, amount, onEachUpdate) => {
    let remaining = amount;
    const out = sources.map((s) => ({ ...s }));

    for (const s of out) {
      if (remaining <= 0) break;
      const canGive = Math.min(s.cakes_in_batch || 0, remaining);
      if (canGive <= 0) continue;

      s.cakes_in_batch = (s.cakes_in_batch || 0) - canGive;
      const residue =
        s.cakes_residue ??
        Math.max((s.total_cakes || 0) - (s.cakes_in_batch || 0), 0);
      s.cakes_residue = (residue || 0) + canGive;
      remaining -= canGive;

      onEachUpdate?.(s, -canGive);
    }

    return { sources: out, taken: amount - remaining, leftover: remaining };
  };

  // Надёжный парсер дат
  const toTime = (d) => {
    if (d == null) return Number.MAX_SAFE_INTEGER; // пустое => в конец
    if (typeof d === 'number') return d; // уже ms
    if (d instanceof Date) return d.getTime(); // Date -> ms
    if (typeof d === 'string') {
      // 1) пробуем стандартный парсер (ISO и пр.)
      const t = Date.parse(d);
      if (!Number.isNaN(t)) return t;

      // 2) формат DD.MM.YYYY
      const m = d.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
      if (m) {
        const [, dd, mm, yyyy] = m;
        return new Date(+yyyy, +mm - 1, +dd).getTime(); // локальная дата
        // если нужен UTC: Date.UTC(+yyyy, +mm - 1, +dd)
      }
    }
    return Number.MAX_SAFE_INTEGER; // всё непонятное — в конец
  };

  useEffect(() => {
    if (!Array.isArray(latestProducts) || latestProducts.length === 0) return;
    if (!Array.isArray(list_of_orders) || list_of_orders.length === 0) return;
    // Построение базового списка заказов без quantity_in_batch (пока)
    const baseOrders = list_of_ordered_production
      .filter((el) => {
        const orderStatus = list_of_orders.find(
          (order) => order.article === el.order_article,
        )?.status;

        return ![7, 8, 9, 10].includes(orderStatus);
      })
      .map((el) => {
        const product = latestProducts.find(
          (prod) => prod.article === el.product_article,
        );

        const arraysPerPalletRaw = Math.floor(
          (product?.m3InArray ?? 0) / (product?.volumeBlockOnPallet ?? 1),
        );
        const arraysPerPallet = arraysPerPalletRaw > 0 ? arraysPerPalletRaw : 1;

        const quantity_cakes = Math.ceil(
          (Number(el.quantity) || 0) / arraysPerPallet,
        );

        return {
          ...el,
          quantity_cakes,
          quantity_in_batch: 0,
          shipping_ts: toTime(el.shipping_date),
        };
      });

    const byArticle = new Map();
    const idSetByArticle = new Map();

    for (const item of baseOrders) {
      if (!byArticle.has(item.product_article)) {
        byArticle.set(item.product_article, []);
        idSetByArticle.set(item.product_article, new Set());
      }
      byArticle.get(item.product_article).push(item);
      idSetByArticle.get(item.product_article).add(item.id);
    }

    // Сортировка внутри каждой группы по shipping_date (возрастание)
    for (const list of byArticle.values()) {
      list.sort((a, b) => a.shipping_ts - b.shipping_ts || a.id - b.id); // стабильный тай-брейк по id
    }

    const producedByArticle = new Map();

    for (const batch of batchOutside) {
      const m3InArray = latestProducts?.find(
        (p) => p.article == batch.product_article,
      )?.m3InArray;

      const volumeBlockOnPallet = latestProducts?.find(
        (p) => p.article == batch.product_article,
      )?.volumeBlockOnPallet;

      const producedUnits =
        (Number(batch.quantity_pallets) || 0) /
        Math.floor(m3InArray / volumeBlockOnPallet);

      // пытаемся взять напрямую по product_article
      let art = batch.product_article;

      // если нет product_article — маппим по принадлежности id к группе
      if (!art) {
        for (const [pa, idSet] of idSetByArticle.entries()) {
          if (
            batch.id_list_of_ordered_production &&
            idSet.has(batch.id_list_of_ordered_production)
          ) {
            art = pa;
            break;
          }
        }
      }

      if (!art) continue;

      producedByArticle.set(art, (producedByArticle.get(art) || 0) + producedUnits);
    }

    // Распределение произведённого: идём по заказам (после сортировки) и "раздаём"
    for (const [article, orders] of byArticle.entries()) {
      let remaining = producedByArticle.get(article) || 0;

      for (const order of orders) {
        if (remaining <= 0) {
          order.quantity_in_batch = 0;
          continue;
        }

        const need = Number(order.quantity_cakes) || 0;
        const alloc = Math.min(need, remaining);

        order.quantity_in_batch = alloc;
        remaining -= alloc;
      }
    }

    // Финальный массив data
    const data = Array.from(byArticle.values())
      .flat()
      // если тебе всё ещё нужно уникализировать по (product_article, order_article)
      .reduce((uniqueItems, item) => {
        if (
          !uniqueItems.some(
            (el) =>
              el.product_article === item.product_article &&
              el.order_article === item.order_article,
          )
        ) {
          uniqueItems.push(item);
        }
        return uniqueItems;
      }, []);

    setListOfOrderedCakes(data);

    const dryMixOrderedData = related_materials_backorder_list
      ?.filter((el) => {
        // Определение статуса заказа
        const orderStatus = list_of_orders?.find(
          (order) => order.article === el.order_article,
        )?.status;

        // Исключение заказов с указанными статусами
        return ![7, 8, 9, 10].includes(orderStatus);
      })
      .map((el) => {
        return {
          ...el,
        };
      })
      .reduce((uniqueItems, item) => {
        if (
          !uniqueItems.some(
            (el) =>
              el.product_article === item.product_article &&
              el.order_article === item.order_article,
          )
        ) {
          uniqueItems.push(item);
        }
        return uniqueItems;
      }, []);

    setListOfOrderedAuxilary(dryMixOrderedData);

    const combinedList = [
      ...related_materials_backorder_list,
      ...list_of_ordered_production,
    ];

    // Группируем все позиции по order_article
    const ordersMap = combinedList.reduce((acc, item) => {
      if (!acc.has(item.order_article)) {
        acc.set(item.order_article, []);
      }
      acc.get(item.order_article).push(item);
      return acc;
    }, new Map());

    const fullyReservedOrders = Array.from(ordersMap.entries())
      .filter(([orderArticle, items]) =>
        items.every(
          (item) => Number(item.quantity) === Number(item.quantity_in_warehouse),
        ),
      )
      .map(([orderArticle]) => orderArticle);

    fullyReservedOrders.forEach((order_article) => {
      const currOrder = list_of_orders.find(
        (order) => order.article === order_article,
      );

      if (currOrder?.id && !order_status.includes(currOrder?.status)) {
        dispatch(
          updateOrderStatus({
            order_id: currOrder.id,
            status: 7,
          }),
        );
        dispatch(
          updAccountingDataList({
            orders_article: order_article,
            aproved: false,
          }),
        );
      }
    });
  }, [
    latestProducts,
    list_of_orders,
    list_of_reserved_products,
    list_of_ordered_production,
    list_of_ordered_production_oem,
    batchOutside,
    productsOfOrders,
    dryMixedProductsOfOrders,
    related_materials_backorder_list,
    qualityManagerChange,
  ]);

  return (
    <WarehouseContext.Provider
      value={{
        COLUMNS_WAREHOUSE,
        COLUMNS_WAREHOUSE_AUX,
        COLUMNS_WAREHOUSE_ADD_MODAL,
        COLUMNS_RAW_MATERIALS_WAREHOUSE,
        COLUMNS_LIST_OF_ORDERED_PRODUCTION,
        COLUMNS_LIST_OF_ORDERED_PRODUCTION_OEM,
        COLUMNS_RELATED_MATERIALS_BACKORDER_LIST,
        warehouse_data,
        dry_mixes_warehouse_data,
        related_materials_warehouse_data,
        anchors_warehouse_data,
        tools_warehouse_data,
        list_of_reserved_products,
        autoclave_calendar,
        list_of_dry_mix_reserved_products,
        list_of_anchor_reserved_products,
        list_of_tool_reserved_products,
        list_of_rel_mat_reserved_products,
        list_of_ordered_production,
        list_of_ordered_production_oem,
        related_materials_backorder_list,
        ordered_production_oem_status,
        raw_materials_warehouse,
        filteredProducts,
        getProductsByOrder,
        setFilteredProducts,
        currentOrderedProducts,
        setCurrentOrderedProducts,
        currentBatchId,
        setCurrentBatchId,
        currentBatch,
        setCurrentBatch,
        listOfOrderedCakes,
        setListOfOrderedCakes,
        listOfOrderedAuxilary,
        setListOfOrderedAuxilary,
        filteredWarehouseByProduct,
        setFilteredWarehouseByProduct,
        wmoctProduct,
        setWmoctProduct,
        wmoctProductShippedBD,
        setWmoctProductShippedBD,
        saveHandler,
        distributeToSources,
        collectFromSources,
        selectedOrder,
        setSelectedOrder,
        additionalInfoPDF,
        setAdditionalInfoPDF,
        aldabaranNum,
        setAldabaranNum,
        aldabaran,
        getProductType,
        qualityManagerChange,
        setQualityManagerChange,
        getWarehouseArticle,
        wmoctProductDeltaForPdf,
        setWmoctProductDeltaForPdf,
        warehouseMap,
        batchOutside,
        warehouse_sand_slurry,
        order_dispatch_data,
        normalizeProductType,
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
};

export default WarehouseContextProvider;

const useWarehouseContext = () => useContext(WarehouseContext);
export { useWarehouseContext };
