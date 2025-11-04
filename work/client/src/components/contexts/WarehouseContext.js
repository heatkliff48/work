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
  updAnchorReservedProducts,
  updateAnchorWarehouseQuantitys,
  updateDryMixedWarehouseQuantitys,
  updateRelMatWarehouseQuantitys,
  updateToolWarehouseQuantitys,
  updateWarehouseQuantitys,
  updDryMixedReservedProducts,
  updRelMatReservedProducts,
  updReservedProducts,
  updToolReservedProducts,
} from '#components/redux/actions/warehouseAction.js';
import { useProductsContext } from './ProductContext';
import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewAldabaran } from '#components/redux/actions/aldabaranAction.js';

const WarehouseContext = createContext();

const WarehouseContextProvider = ({ children }) => {
  const dispatch = useDispatch();

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
    (state) => state.relatedMaterialsWarehouse
  );
  const anchors_warehouse_data = useSelector((state) => state.anchorsWarehouse);
  const tools_warehouse_data = useSelector((state) => state.toolsWarehouse);

  const warehouseMap = {
    product: warehouse_data,
    dryMixed: dry_mixes_warehouse_data,
    anchor: anchors_warehouse_data,
    tool: tools_warehouse_data,
    relMat: related_materials_warehouse_data,
  };

  const list_of_reserved_products = useSelector((state) => state.reservedProducts);

  const list_of_dry_mix_reserved_products = useSelector(
    (state) => state.reservedDryMixedProducts
  );

  const list_of_anchor_reserved_products = useSelector(
    (state) => state.reservedAnchorProducts
  );

  const list_of_tool_reserved_products = useSelector(
    (state) => state.reservedToolProducts
  );

  const list_of_rel_mat_reserved_products = useSelector(
    (state) => state.reservedRelMatProducts
  );

  const list_of_ordered_production = useSelector(
    (state) => state.listOfOrderedProduction
  );
  const list_of_ordered_production_oem = useSelector(
    (state) => state.listOfOrderedProductionOEM
  );
  const related_materials_backorder_list = useSelector(
    (state) => state.relatedMaterialsBackorderList
  );

  const raw_materials_warehouse = useSelector(
    (state) => state.rawMaterialsWarehouse
  );

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
  const [filteredWarehouseByProduct, setFilteredWarehouseByProduct] = useState([]);

  const batchOutside = useSelector((state) => state.batchOutside);
  const list_of_orders = useSelector((state) => state.orders);
  const productsOfOrders = useSelector((state) => state.productsOfOrders);
  const dryMixedProductsOfOrders = useSelector(
    (state) => state.dryMixedProductsOfOrders
  );

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

  const getProductsByOrder = (orderId, productsOfType, productArr) => {
    return productsOfType
      .filter((prod) => prod.order_id === orderId)
      .map((prod) => {
        const productId =
          prod.product_id ||
          prod.dry_mixed_id ||
          prod.anchor_id ||
          prod.tool_id ||
          prod.rel_mat_id;

        const lProduct = productArr?.find((lp) => lp.id === productId);

        const quantity =
          prod?.quantity_palet ||
          prod?.quantity_ud ||
          prod?.quantity_palet_dry ||
          prod?.quantity_palet_anchor;

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

  const saveHandler = () => {
    const newReserved = [];
    const wh_arr = [];

    let orderId;

    wmoctProduct.forEach((el) => {
      const { orders_products_id, order_id } = el;
      orderId = order_id;

      const type = getProductType(el.article);
      const warehouse_arr = warehouseMap[type];
      const reserved_arr = reservedMap[type];

      el?.batches?.forEach((elem) => {
        const wh = warehouse_arr.find((el) => el.article == elem.batchId);

        const haveReserve = reserved_arr.find(
          (el) =>
            el.warehouse_id == wh.id && el.orders_products_id == orders_products_id
        );

        const obj = {
          article: el.article,
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
            type,
          });
        }

        if (haveReserve && haveReserve.quantity != elem.allocated) {
          const quantity = haveReserve.quantity - elem.allocated;

          wh_arr.push({
            warehouse_id: wh.id,
            total_quantity: wh.total_quantity + quantity,
            ordered_quantity: wh.ordered_quantity + quantity,
            type,
          });

          switch (type) {
            case 'product':
              dispatch(updReservedProducts(obj));
              break;

            case 'relMat':
              dispatch(updRelMatReservedProducts(obj));
              break;

            case 'tool':
              dispatch(updToolReservedProducts(obj));
              break;

            case 'dryMixed':
              dispatch(updDryMixedReservedProducts(obj));
              break;

            case 'anchor':
              dispatch(updAnchorReservedProducts(obj));
              break;

            default:
              break;
          }
        }
      });
    });

    wh_arr.forEach((el) => {
      const { warehouse_id, total_quantity, ordered_quantity, type } = el;
      switch (type) {
        case 'product':
          dispatch(
            updateWarehouseQuantitys({
              warehouse_id,
              total_quantity,
              ordered_quantity,
            })
          );
          break;

        case 'dryMixed':
          updateDryMixedWarehouseQuantitys({
            warehouse_id,
            total_quantity,
            ordered_quantity,
          });
          break;

        case 'anchor':
          updateAnchorWarehouseQuantitys({
            warehouse_id,
            total_quantity,
            ordered_quantity,
          });
          break;

        case 'tool':
          updateToolWarehouseQuantitys({
            warehouse_id,
            total_quantity,
            ordered_quantity,
          });
          break;

        case 'relmat':
          updateRelMatWarehouseQuantitys({
            warehouse_id,
            total_quantity,
            ordered_quantity,
          });
          break;

        default:
          break;
      }
    });

    const allShipped = wmoctProduct.every((el) => el.qty_total === el.shipped);

    if (allShipped) {
      const article = list_of_orders.find((el) => el.id == orderId)?.article;
      dispatch(
        updateOrderStatus({
          order_id: orderId,
          status: 9,
        })
      );

      dispatch(
        updAccountingDataList({
          orders_article: article,
          aproved: false,
        })
      );
    }

    const pad = (n) => String(n).padStart(2, '0');

    const now = new Date();
    const dateTimeStr =
      `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
      `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    dispatch(addNewAldabaran({ num: aldabaranNum, data: dateTimeStr }));

    const grouped = {
      product: [],
      relMat: [],
      tool: [],
      dryMixed: [],
      anchor: [],
    };

    newReserved.forEach((item) => {
      const { article, warehouse_id, orders_products_id, quantity } = item;

      const obj = { warehouse_id, orders_products_id, quantity };

      if (article.startsWith('T.')) {
        grouped.product.push(obj);
      } else if (article.startsWith('X.P')) {
        grouped.relMat.push(obj);
      } else if (article.startsWith('X.T')) {
        grouped.tool.push(obj);
      } else if (article.startsWith('X.M')) {
        grouped.dryMixed.push(obj);
      } else if (article.startsWith('X.F')) {
        grouped.anchor.push(obj);
      }
    });

    Object.entries(grouped).forEach(([key, items]) => {
      switch (key) {
        case 'product':
          dispatch(addNewReservedProducts(items));
          break;

        case 'relMat':
          dispatch(addNewRelMatReservedProducts(items));
          break;

        case 'tool':
          dispatch(addNewToolReservedProducts(items));
          break;

        case 'dryMixed':
          dispatch(addNewDryMixedReservedProducts(items));
          break;

        case 'anchor':
          dispatch(addNewAnchorReservedProducts(items));
          break;

        default:
          break;
      }
    });

    setWmoctProductShippedBD([]);
    setSelectedOrder(null);
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

  // Обратная операция: "забрать" n массивов, начиная с приоритетного source
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
          (order) => order.article === el.order_article
        )?.status;

        return ![7, 8, 9, 10].includes(orderStatus);
      })
      .map((el) => {
        const product = latestProducts.find(
          (prod) => prod.article === el.product_article
        );

        const arraysPerPalletRaw = Math.floor(
          (product?.m3InArray ?? 0) / (product?.volumeBlockOnPallet ?? 1)
        );
        const arraysPerPallet = arraysPerPalletRaw > 0 ? arraysPerPalletRaw : 1;

        const quantity_cakes = Math.ceil(
          (Number(el.quantity) || 0) / arraysPerPallet
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
        (p) => p.article == batch.product_article
      )?.m3InArray;

      const volumeBlockOnPallet = latestProducts?.find(
        (p) => p.article == batch.product_article
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
              el.order_article === item.order_article
          )
        ) {
          uniqueItems.push(item);
        }
        return uniqueItems;
      }, []);

    // const data = list_of_ordered_production
    //   ?.filter((el) => {
    //     // Определение статуса заказа
    //     const orderStatus = list_of_orders?.find(
    //       (order) => order.article === el.order_article
    //     )?.status;

    //     // Исключение заказов с указанными статусами
    //     return ![7, 8, 9, 10].includes(orderStatus);
    //   })
    //   .map((el) => {
    //     const product = latestProducts.find(
    //       (prod) => prod.article === el.product_article
    //     );

    //     // Рассчитать количество тортов
    //     const quantity_cakes = Math.ceil(
    //       el.quantity / Math.floor(product?.m3InArray / product?.volumeBlockOnPallet)
    //     );

    //     // Рассчитать количество в партии
    //     const quantity_in_batch =
    //       batchOutside.find((batch) => batch.id_list_of_ordered_production === el.id)
    //         ?.quantity_pallets / 3 || 0;

    //     return {
    //       ...el,
    //       quantity_cakes,
    //       quantity_in_batch,
    //       // quantity_in_warehouse,
    //     };
    //   })
    //   .reduce((uniqueItems, item) => {
    //     if (
    //       !uniqueItems.some(
    //         (el) =>
    //           el.product_article === item.product_article &&
    //           el.order_article === item.order_article
    //       )
    //     ) {
    //       uniqueItems.push(item);
    //     }
    //     return uniqueItems;
    //   }, []);

    setListOfOrderedCakes(data);

    const dryMixOrderedData = related_materials_backorder_list
      ?.filter((el) => {
        // Определение статуса заказа
        const orderStatus = list_of_orders?.find(
          (order) => order.article === el.order_article
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
              el.order_article === item.order_article
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
          (item) => Number(item.quantity) === Number(item.quantity_in_warehouse)
        )
      )
      .map(([orderArticle]) => orderArticle);

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
        dispatch(
          updAccountingDataList({
            orders_article: order_article,
            aproved: false,
          })
        );
      }
    });

    let groupedOrders = processOrders(list_of_ordered_production, {});

    groupedOrders = processOrders(list_of_ordered_production_oem, groupedOrders);

    groupedOrders = processOrders(related_materials_backorder_list, groupedOrders);

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
        dispatch(
          updAccountingDataList({
            orders_article: order.article,
            aproved: false,
          })
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
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
};

export default WarehouseContextProvider;

const useWarehouseContext = () => useContext(WarehouseContext);
export { useWarehouseContext };
