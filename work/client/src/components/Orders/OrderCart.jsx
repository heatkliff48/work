import React, {
  useEffect,
  useMemo,
  useCallback,
  useState,
  useRef,
} from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import FilesMain from '#components/FileUpload/Order/FilesMain.jsx';
import ListOfOrderedProductionReserveModal from '#components/Warehouse/ListOfOrderedProduction/ListOfOrderedProductionReserveModal.jsx';
import { useProjectContext } from '#components/contexts/Context.js';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import {
  addDataShipOrder,
  addDescription,
  addNewDeliveryPrice,
  addSecondaryContact,
  deleteAccountingData,
  deleteOrder,
  delSecondaryContact,
  getDeleteProductOfOrder,
  getDeleteRelMatProductOfOrder,
  updAccountingDataList,
  updateOrderInCharge,
  updateOrderStatus,
  updatePayment,
} from '#components/redux/actions/ordersAction.js';
import {
  addNewListOfOrderedProduction,
  addNewListOfOrderedProductionOEM,
  updateRemainingStock,
} from '#components/redux/actions/warehouseAction.js';
import PDFgenerate from './OrdersPDF.jsx';
import ShowOrderContactEditModal from './modal/OrderCartContactEditModal.jsx';
import ShowOrderDeliveryEditModal from './modal/OrderCartDeliveryEditModal.jsx';
import OrderProductCardInfoModal from './modal/OrderProductCardInfoModal.jsx';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import ListOfReservedProductsModal from '#components/Warehouse/ListOfReservedProducts/ListOfReservedProductsModal.jsx';
import BlocksJournalTableOrder from './product_table_order/BlocksJournalTableOrder.jsx';
import DryMixesJournalTableOrder from './product_table_order/DryMixesJournalTableOrder.jsx';
import { useProductsTypeJournalContext } from '#components/contexts/ProductsTypeJournalContext.js';
import AnchorJournalTableOrder from './product_table_order/AnchorJournalTableOrder.jsx';
import ToolJournalTableOrder from './product_table_order/ToolJournalTableOrder.jsx';
import {
  getDeleteAnchorProductOfOrder,
  getDeleteDryMixedProductOfOrder,
  getDeleteToolProductOfOrder,
} from '#components/redux/actions/ordersAction.js';
import ClientsContactInfo from '#components/Clients/ClientsContactInfo/ClientsContactInfo.js';
import {
  updateAnchorsWarehouse,
  updateDryMixesWarehouse,
  updateRelatedMaterialsWarehouse,
  updateToolsWarehouse,
} from '#components/redux/actions/productsTypeWarehouseAction.js';
import { addNewRelatedMaterialsBackorder } from '#components/redux/actions/relatedMaterialsBackorderListAction.js';
import RelatedMaterialJournalTableOrder from './product_table_order/RelatedMaterialJournalTableOrder.jsx';
import LiberarModal from './modal/LiberarModal.jsx';
import { statusThemeFor } from './ordersCells.jsx';

import '#components/Styles/order-card.css';
import './ordersView.css';

const OrderCart = React.memo(() => {
  const {
    orderCartData,
    setOrderCartData,
    status_list,
    list_of_orders,
    setSelectedProduct,
    setProductOfOrder,
    personsInChargeList,
    accountingDataList,
    productsOfOrders,
    dryMixedProductsOfOrders,
    anchorProductsOfOrders,
    toolProductsOfOrders,
    relMatProductsOfOrders,
    deliveryAddresses,
    filterKeysOrder,
  } = useOrderContext();

  const {
    productInfoModalOrder,
    setProductInfoModalOrder,
    warehouseInfoModal,
    setWarehouseInfoModal,
    setWarehouseInfoCurIdModal,
  } = useModalContext();
  const { displayNames, user } = useProjectContext();

  const { roles, checkUserAccess, userAccess, setUserAccess } =
    useUsersContext();
  const { latestProducts } = useProductsContext();
  const { latestDryMix, latestAnchors, latestTools, latestRelatedMaterials } =
    useProductsTypeJournalContext();
  const {
    warehouse_data,
    dry_mixes_warehouse_data,
    related_materials_warehouse_data,
    anchors_warehouse_data,
    tools_warehouse_data,
    list_of_reserved_products,
    ordered_production_oem_status,
    filteredWarehouseByProduct,
    setFilteredWarehouseByProduct,
  } = useWarehouseContext();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reservedProducts = useSelector((state) => state.reservedProducts);

  const [selectedPersonInCharge, setSelectedPersonInCharge] = useState();
  const [dataValue, setDataValue] = useState(new Date());
  const [newDescription, setNewDescription] = useState('');
  const [formatDataValue, setFormatDataValue] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddSecCont, setIsAddSecCont] = useState(false);
  const [aproveAccounting, setAproveAccounting] = useState(false);
  const [reserveModalShow, setReserveModalShow] = useState(false);
  const [liberarModalShow, setLiberarModalShow] = useState(false);
  const [ordersStatus, setOrdersStatus] = useState([]);
  const [orderStatusAccess, setOrderStatusAccess] = useState({
    canRead: true,
    canWrite: false,
  });
  const [deleteOrderAccess, setDeleteOrderAccess] = useState({
    canRead: true,
    canWrite: false,
  });
  const [vatValue, setVatValue] = useState({
    vat_euro_origin: 0,
    vat_procent: orderCartData?.region == 'peninsular_spain' ? 21 : 0,
    vat_euro: 0,
    vat_result: 0,
    vat_result_del: 0,
  });

  const PAYMENT_METHOD_OPTIONS = [
    { value: 'prepayment', label: 'Prepago' },
    { value: 'bank_transfer', label: 'Transferencia bancaria' },
    { value: 'promissory_note', label: 'Pagaré' },
    { value: 'confirming', label: 'Confirming' },
    { value: 'confirming_without_recourse', label: 'Confirming sin recurso' },
  ];

  const cardStatusTheme = useMemo(
    () => statusThemeFor(orderCartData?.status),
    [orderCartData?.status],
  );
  const cardStatusLabel = useMemo(
    () =>
      status_list.find((s) => s.accessor === orderCartData?.status)?.Header ||
      '',
    [status_list, orderCartData?.status],
  );

  const [currentOrderedProduct, setCurrentOrderedProduct] = useState({});

  const [productLists, setProductLists] = useState({
    products: [],
    dryMixes: [],
    anchors: [],
    tools: [],
    related_materials: [],
  });

  const getCorrectProductId = (arrName) => {
    switch (arrName) {
      case 'products':
        return 'product_id';

      case 'dryMixes':
        return 'dry_mixed_id';

      case 'anchors':
        return 'anchor_id';

      case 'tools':
        return 'tool_id';

      case 'related_materials':
        return 'rel_mat_id';

      default:
        break;
    }
  };

  const haveShipDate = useMemo(() => {
    return orderCartData?.shipping_date ?? false;
  }, [orderCartData]);

  const filterAndMapData = useCallback(
    (data, filterKeysOrder) =>
      Object.entries(data || {})
        .filter(([key]) => !filterKeysOrder?.includes(key))
        .map(([key, value]) => {
          if (!key || key === 'warehouse_id') return null;

          // Если значение — объект, преобразуем его в строку
          let displayValue = value;
          if (displayValue && typeof displayValue === 'object') {
            displayValue = JSON.stringify(displayValue);
          }

          return (
            <div className="data-text" key={key}>
              <p>
                {displayNames[key] || key}: {displayValue}
              </p>
            </div>
          );
        }),
    [orderCartData],
  );

  const handleDateChange = useCallback(
    (date) => {
      const currentDate = new Date();
      if (date < currentDate) {
        alert('The selected date cannot be before than the current date');
        return;
      }
      setDataValue(date);
      const formattedDate = date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      setFormatDataValue(formattedDate);
    },
    [dataValue],
  );

  const onEditHandler = () => {
    setNewDescription(orderCartData?.description);
    setIsEditing(true);
  };

  const handleDayBeforShipping = useCallback(() => {
    const currentDate = new Date();
    const shippingDateString = orderCartData?.shipping_date;

    const shippingDate = new Date(
      shippingDateString.split('.').reverse().join('-'),
    );

    const timeDiff = shippingDate.getTime() - currentDate.getTime();
    const daysUntil = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysUntil;
  }, [orderCartData?.shipping_date]);

  const onSaveDescription = (str) => {
    dispatch(addDescription({ order_id: orderCartData.id, description: str }));
    setIsEditing(false);
  };

  const addSecondaryContactHandler = () => {
    setIsAddSecCont(true);
  };

  const haveSecondaryContact = useMemo(() => {
    return orderCartData?.secondaryContact ?? false;
  }, [orderCartData?.secondaryContact]);

  const addSecCntFunc = (secCnt) => {
    dispatch(
      addSecondaryContact({
        secondary_contact: secCnt,
        order_id: orderCartData.id,
      }),
    );

    setIsAddSecCont(false);
  };

  const addProductArticleToOrderList = useCallback(
    (productsOfOrders, productsTable, arrayName) => {
      if (
        !productsOfOrders ||
        !productsTable ||
        !arrayName ||
        !orderCartData?.id
      )
        return [];

      const updatedOrderProducts = productsOfOrders
        .filter((el) => el.order_id == orderCartData.id)
        .map((orderProduct) => {
          const id = getCorrectProductId(arrayName);

          // const { project_name } = deliveryAddresses.find(
          //   (el) => el.client_id == orderCartData.owner.id
          // );

          const product = productsTable.find(
            (p) => p.id === orderProduct?.[id],
          );

          return product
            ? {
                product_article: product.article,
                // project_name,
                description:
                  arrayName == 'products'
                    ? product.description
                    : arrayName == 'tools' || arrayName == 'related_materials'
                      ? `${product?.name}`
                      : arrayName == 'anchors'
                        ? `${product?.name} Sacos de ${product?.pallet_weight}kg`
                        : `${product?.name} BAUBLOCK Sacos de ${product?.pallet_weight}kg`,
                ...orderProduct,
              }
            : { ...orderProduct, product_article: 'Unknown' };
        });

      return updatedOrderProducts;
    },
    [orderCartData?.id], // Добавляем зависимость
  );

  const updatedProductListOrder = useMemo(() => {
    console.log(productsOfOrders, 'productsOfOrders OrderCart.jsx line 325');
    return addProductArticleToOrderList(
      productsOfOrders,
      latestProducts,
      'products',
    );
  }, [productsOfOrders, latestProducts, addProductArticleToOrderList]);

  const blocksTotalQuantityRealM2 = useMemo(() => {
    return (updatedProductListOrder || []).reduce(
      (acc, el) => acc + (Number(el?.quantity_real) || 0),
      0,
    );
  }, [updatedProductListOrder]);

  const deliveryPricePerM2 = useMemo(() => {
    const deliveryM2Total = Number(orderCartData?.delivery_m2 || 0);
    if (!deliveryM2Total || !blocksTotalQuantityRealM2) return 0;
    return deliveryM2Total / blocksTotalQuantityRealM2;
  }, [orderCartData?.delivery_m2, blocksTotalQuantityRealM2]);

  const blocksListWithDeliveryM2 = useMemo(() => {
    return (updatedProductListOrder || []).map((product) => {
      const price_m2 = Number(product?.price_m2 || 0);
      const quantity_m2 = Number(product?.quantity_m2 || 0);
      const quantity_real = Number(product?.quantity_real || 0);
      const discount = Number(product?.discount || 0);

      const final_price = (price_m2 * quantity_m2 * (100 - discount)) / 100;

      const delivery_m2_share =
        (deliveryPricePerM2 * quantity_real * (100 - discount)) / 100;

      const price_m2_with_delivery = price_m2 + deliveryPricePerM2;

      return {
        ...product,
        price_m2_with_delivery: Number(price_m2_with_delivery.toFixed(2)),
        final_price: Number(final_price.toFixed(2)),
        delivery_m2_share: Number(delivery_m2_share.toFixed(2)),
        final_price_with_delivery: Number(
          (final_price + delivery_m2_share).toFixed(2),
        ),
      };
    });
  }, [updatedProductListOrder, deliveryPricePerM2]);

  useEffect(() => {
    if (blocksListWithDeliveryM2.length > 0) {
      setProductLists((prevState) => ({
        ...prevState,
        products: blocksListWithDeliveryM2,
      }));
    }
  }, [blocksListWithDeliveryM2]);

  const updatedDryMixesListOrder = useMemo(() => {
    return addProductArticleToOrderList(
      dryMixedProductsOfOrders,
      latestDryMix,
      'dryMixes',
    );
  }, [dryMixedProductsOfOrders, latestDryMix, addProductArticleToOrderList]);

  // Обновляем состояние отдельно
  useEffect(() => {
    if (updatedDryMixesListOrder.length > 0) {
      setProductLists((prevState) => ({
        ...prevState,
        dryMixes: updatedDryMixesListOrder,
      }));
    }
  }, [updatedDryMixesListOrder]);

  const updatedAnchorsListOrder = useMemo(() => {
    return addProductArticleToOrderList(
      anchorProductsOfOrders,
      latestAnchors,
      'anchors',
    );
  }, [anchorProductsOfOrders, latestAnchors, addProductArticleToOrderList]);

  useEffect(() => {
    if (updatedAnchorsListOrder.length > 0) {
      setProductLists((prevState) => ({
        ...prevState,
        anchors: updatedAnchorsListOrder,
      }));
    }
  }, [updatedAnchorsListOrder]);

  const updatedToolsListOrder = useMemo(() => {
    return addProductArticleToOrderList(
      toolProductsOfOrders,
      latestTools,
      'tools',
    );
  }, [toolProductsOfOrders, latestTools, addProductArticleToOrderList]);

  useEffect(() => {
    if (updatedToolsListOrder.length > 0) {
      setProductLists((prevState) => ({
        ...prevState,
        tools: updatedToolsListOrder,
      }));
    }
  }, [updatedToolsListOrder]);

  const updatedRelatedMaterialsListOrder = useMemo(() => {
    return addProductArticleToOrderList(
      relMatProductsOfOrders,
      latestRelatedMaterials,
      'related_materials',
    );
  }, [
    relMatProductsOfOrders,
    latestRelatedMaterials,
    addProductArticleToOrderList,
  ]);

  useEffect(() => {
    if (updatedRelatedMaterialsListOrder.length > 0) {
      setProductLists((prevState) => ({
        ...prevState,
        related_materials: updatedRelatedMaterialsListOrder,
      }));
    }
  }, [updatedRelatedMaterialsListOrder]);

  const handleInputChange = (e) => {
    setVatValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onProductClickHandler = (sel_prod) => {
    if (orderCartData?.status < 3) {
      const product =
        sel_prod.product_article.slice(2, 3) == 'N'
          ? latestProducts.find((el) => el.article === sel_prod.product_article)
          : sel_prod.product_article.slice(2, 3) == 'M'
            ? latestDryMix.find((el) => el.article === sel_prod.product_article)
            : sel_prod.product_article.slice(2, 3) == 'P'
              ? latestRelatedMaterials.find(
                  (el) => el.article === sel_prod.product_article,
                )
              : sel_prod.product_article.slice(2, 3) == 'F'
                ? latestAnchors.find(
                    (el) => el.article === sel_prod.product_article,
                  )
                : latestTools.find(
                    (el) => el.article === sel_prod.product_article,
                  );

      setSelectedProduct(product);
      setProductOfOrder({ ...sel_prod, product_id: product?.id });
      setProductInfoModalOrder(!productInfoModalOrder);
    }
  };

  const statusByAccessor = useMemo(
    () =>
      Object.fromEntries(
        (status_list ?? []).map((item) => [item.accessor, item]),
      ),
    [status_list],
  );

  const statusChangeHandler = (status) => {
    const currentStatusIndex = status_list.findIndex(
      (item) => item.accessor === orderCartData?.status,
    );

    const newStatusIndex = status_list.findIndex(
      (item) => item.accessor === status.accessor,
    );

    if (currentStatusIndex === -1 || newStatusIndex === -1) {
      return alert('Unknown order status');
    }

    if (newStatusIndex !== currentStatusIndex + 1) {
      return alert('This status cannot be set');
    }

    if (!aproveAccounting) {
      return alert("Please await accounting's verification");
    }

    const order_id = orderCartData?.id;
    const hasShippingDate =
      orderCartData?.shipping_date?.length > 0
        ? orderCartData?.shipping_date
        : formatDataValue;

    if (status.accessor > statusByAccessor[4].accessor && !hasShippingDate) {
      alert('Please select the shipping date.');
      return;
    } else if (status.accessor === statusByAccessor[5].accessor) {
      dispatch(
        addDataShipOrder({
          order_id,
          shipping_date: hasShippingDate ?? formatDataValue,
        }),
      );
    }

    // blocks
    updatedProductListOrder?.forEach((product) => {
      const loc = latestProducts.find(
        (el) => el.article == product.product_article,
      )?.placeOfProduction;

      const haveProductReserve = list_of_reserved_products.find(
        (el) => el.orders_products_id == product.id,
      );
      if (
        status.accessor === statusByAccessor[6].accessor &&
        loc === 'Spain' &&
        !haveProductReserve
      ) {
        const reservedProduct = productsOfOrders.find(
          (orderedProduct) =>
            orderedProduct.order_id === product.order_id &&
            orderedProduct.product_id === product.product_id,
        );

        let remainingToAllocate = reservedProduct.quantity_palet || 0; // Сколько нужно зарезервировать для этого товара
        const matchingWarehouseProducts =
          warehouse_data?.filter(
            (warehouseItem) =>
              warehouseItem.product_article === product?.product_article,
          ) || []; // Если warehouse_data undefined, используем пустой массив

        // Проходим по складу и "забираем" остатки
        for (const warehouseItem of matchingWarehouseProducts) {
          if (
            remainingToAllocate > 0 &&
            warehouseItem.free_quantity_remaining > 0
          ) {
            const taken = Math.min(
              warehouseItem.free_quantity_remaining,
              remainingToAllocate,
            );

            // Обновляем данные склада
            dispatch(
              updateRemainingStock({
                warehouse_id: warehouseItem?.id,
                free_quantity_remaining:
                  warehouseItem.free_quantity_remaining - taken,
                ordered_quantity: (warehouseItem.ordered_quantity || 0) + taken,
              }),
            );
            remainingToAllocate -= taken;
          }
        }
        const quantity_in_warehouse =
          reservedProduct.quantity_palet - remainingToAllocate; // Сколько реально зарезервировали
        dispatch(
          addNewListOfOrderedProduction({
            shipping_date: orderCartData?.shipping_date,
            product_article: product?.product_article,
            order_article: orderCartData?.article,
            quantity: product?.quantity_palet,
            quantity_in_warehouse,
          }),
        );
      } else if (
        status.accessor === statusByAccessor[6].accessor &&
        !haveProductReserve
      ) {
        dispatch(
          addNewListOfOrderedProductionOEM({
            shipping_date: orderCartData?.shipping_date,
            product_article: product?.product_article,
            order_article: orderCartData?.article,
            quantity: product?.quantity_palet,
            status: ordered_production_oem_status[0].accessor,
          }),
        );
      }
    });

    // dry mix

    updatedDryMixesListOrder?.forEach((product) => {
      const loc = latestDryMix.find(
        (el) => el.article == product.product_article,
      )?.place_of_production;

      if (status.accessor === statusByAccessor[6].accessor && loc === 'ES') {
        const reservedProduct = dryMixedProductsOfOrders.find(
          (orderedProduct) =>
            orderedProduct.order_id === product.order_id &&
            orderedProduct.dry_mixed_id === product.dry_mixed_id,
        );

        let remainingToAllocate = reservedProduct.quantity_palet_dry || 0; // Сколько нужно зарезервировать для этого товара

        const matchingWarehouseProducts =
          dry_mixes_warehouse_data?.filter(
            (warehouseItem) =>
              warehouseItem.product_article === product?.product_article,
          ) || []; // Если dry_mixes_warehouse_data undefined, используем пустой массив

        // Проходим по складу и "забираем" остатки
        for (const warehouseItem of matchingWarehouseProducts) {
          if (
            remainingToAllocate > 0 &&
            warehouseItem.free_quantity_remaining > 0
          ) {
            const taken = Math.min(
              warehouseItem.free_quantity_remaining,
              remainingToAllocate,
            );

            // Обновляем данные склада
            dispatch(
              updateDryMixesWarehouse({
                id: warehouseItem?.id,
                free_quantity_remaining:
                  warehouseItem.free_quantity_remaining - taken,
                ordered_quantity: (warehouseItem.ordered_quantity || 0) + taken,
              }),
            );
            remainingToAllocate -= taken;
          }
        }

        const quantity_in_warehouse =
          reservedProduct.quantity_palet_dry - remainingToAllocate; // Сколько реально зарезервировали

        dispatch(
          addNewRelatedMaterialsBackorder({
            shipping_date: orderCartData?.shipping_date,
            product_article: product?.product_article,
            order_article: orderCartData?.article,
            quantity: product?.quantity_palet_dry,
            quantity_in_warehouse,
          }),
        );
      }
    });

    // fastners

    updatedAnchorsListOrder?.forEach((product) => {
      const loc = latestAnchors.find(
        (el) => el.article == product.product_article,
      )?.place_of_production;

      if (status.accessor === statusByAccessor[6].accessor && loc === 'ES') {
        const reservedProduct = anchorProductsOfOrders.find(
          (orderedProduct) =>
            orderedProduct.order_id === product.order_id &&
            orderedProduct.anchor_id === product.anchor_id,
        );

        let remainingToAllocate = reservedProduct.quantity_palet_anchor || 0; // Сколько нужно зарезервировать для этого товара

        const matchingWarehouseProducts =
          anchors_warehouse_data?.filter(
            (warehouseItem) =>
              warehouseItem.product_article === product?.product_article,
          ) || []; // Если anchors_warehouse_data undefined, используем пустой массив

        // Проходим по складу и "забираем" остатки
        for (const warehouseItem of matchingWarehouseProducts) {
          if (
            remainingToAllocate > 0 &&
            warehouseItem.free_quantity_remaining > 0
          ) {
            const taken = Math.min(
              warehouseItem.free_quantity_remaining,
              remainingToAllocate,
            );

            // Обновляем данные склада
            dispatch(
              updateAnchorsWarehouse({
                id: warehouseItem?.id,
                free_quantity_remaining:
                  warehouseItem.free_quantity_remaining - taken,
                ordered_quantity: (warehouseItem.ordered_quantity || 0) + taken,
              }),
            );
            remainingToAllocate -= taken;
          }
        }

        const quantity_in_warehouse =
          reservedProduct.quantity_palet_anchor - remainingToAllocate; // Сколько реально зарезервировали

        dispatch(
          addNewRelatedMaterialsBackorder({
            shipping_date: orderCartData?.shipping_date,
            product_article: product?.product_article,
            order_article: orderCartData?.article,
            quantity: product?.quantity_palet_anchor,
            quantity_in_warehouse,
          }),
        );
      }
    });

    // tools

    updatedToolsListOrder?.forEach((product) => {
      const loc = latestTools.find(
        (el) => el.article == product.product_article,
      )?.place_of_production;

      if (status.accessor === statusByAccessor[6].accessor && loc === 'ES') {
        const reservedProduct = toolProductsOfOrders.find(
          (orderedProduct) =>
            orderedProduct.order_id === product.order_id &&
            orderedProduct.tool_id === product.tool_id,
        );

        let remainingToAllocate = reservedProduct.quantity_ud || 0; // Сколько нужно зарезервировать для этого товара

        const matchingWarehouseProducts =
          tools_warehouse_data?.filter(
            (warehouseItem) =>
              warehouseItem.product_article === product?.product_article,
          ) || []; // Если tools_warehouse_data undefined, используем пустой массив

        // Проходим по складу и "забираем" остатки
        for (const warehouseItem of matchingWarehouseProducts) {
          if (
            remainingToAllocate > 0 &&
            warehouseItem.free_quantity_remaining > 0
          ) {
            const taken = Math.min(
              warehouseItem.free_quantity_remaining,
              remainingToAllocate,
            );

            // Обновляем данные склада
            dispatch(
              updateToolsWarehouse({
                id: warehouseItem?.id,
                free_quantity_remaining:
                  warehouseItem.free_quantity_remaining - taken,
                ordered_quantity: (warehouseItem.ordered_quantity || 0) + taken,
              }),
            );
            remainingToAllocate -= taken;
          }
        }

        const quantity_in_warehouse =
          reservedProduct.quantity_ud - remainingToAllocate; // Сколько реально зарезервировали

        dispatch(
          addNewRelatedMaterialsBackorder({
            shipping_date: orderCartData?.shipping_date,
            product_article: product?.product_article,
            order_article: orderCartData?.article,
            quantity: product?.quantity_ud,
            quantity_in_warehouse,
          }),
        );
      }
    });

    // related material
    updatedRelatedMaterialsListOrder?.forEach((product) => {
      const loc = latestRelatedMaterials.find(
        (el) => el.article == product.product_article,
      )?.place_of_production;

      if (status.accessor === statusByAccessor[6].accessor && loc === 'ES') {
        const reservedProduct = relMatProductsOfOrders.find(
          (orderedProduct) =>
            orderedProduct.order_id === product.order_id &&
            orderedProduct.rel_mat_id === product.rel_mat_id,
        );

        let remainingToAllocate = reservedProduct.quantity_ud || 0; // Сколько нужно зарезервировать для этого товара

        const matchingWarehouseProducts =
          related_materials_warehouse_data?.filter(
            (warehouseItem) =>
              warehouseItem.product_article === product?.product_article,
          ) || []; // Если related_materials_warehouse_data undefined, используем пустой массив

        // Проходим по складу и "забираем" остатки
        for (const warehouseItem of matchingWarehouseProducts) {
          if (
            remainingToAllocate > 0 &&
            warehouseItem.free_quantity_remaining > 0
          ) {
            const taken = Math.min(
              warehouseItem.free_quantity_remaining,
              remainingToAllocate,
            );

            // Обновляем данные склада
            dispatch(
              updateRelatedMaterialsWarehouse({
                id: warehouseItem?.id,
                free_quantity_remaining:
                  warehouseItem.free_quantity_remaining - taken,
                ordered_quantity: (warehouseItem.ordered_quantity || 0) + taken,
              }),
            );
            remainingToAllocate -= taken;
          }
        }

        const quantity_in_warehouse =
          reservedProduct.quantity_ud - remainingToAllocate; // Сколько реально зарезервировали

        dispatch(
          addNewRelatedMaterialsBackorder({
            shipping_date: orderCartData?.shipping_date,
            product_article: product?.product_article,
            order_article: orderCartData?.article,
            quantity: product?.quantity_ud,
            quantity_in_warehouse,
          }),
        );
      }
    });

    // Добавляем новый статус в массив
    setOrdersStatus((prev) => [...prev, status.accessor]);

    if (status.accessor == 7 || status.accessor == 9) {
      dispatch(
        updAccountingDataList({
          orders_article: orderCartData?.article,
          aproved: false,
        }),
      );
    }
    if (status.accessor == 10) {
      dispatch(deleteAccountingData(orderCartData?.article));
    }

    dispatch(
      updateOrderStatus({
        order_id,
        status: status.accessor,
      }),
    );
  };

  const deleteHandler = (product) => {
    const res_prod = list_of_reserved_products.find(
      (el) => el.orders_products_id === product.id,
    );
    if (res_prod) {
      const confirmed = window.confirm(
        'Этот продукт зарезервирован на складе. Всё равно удалить?',
      );
      if (!confirmed) return;
    }
    if (product?.product_article.charAt(0) === 'T') {
      dispatch(getDeleteProductOfOrder(product?.id));
    } else if (product?.product_article.charAt(2) === 'M') {
      dispatch(getDeleteDryMixedProductOfOrder(product?.id));
    } else if (product?.product_article.charAt(2) === 'F') {
      dispatch(getDeleteAnchorProductOfOrder(product?.id));
    } else if (product?.product_article.charAt(2) === 'T') {
      dispatch(getDeleteToolProductOfOrder(product?.id));
    } else if (product?.product_article.charAt(2) === 'P') {
      dispatch(getDeleteRelMatProductOfOrder(product?.id));
    }
  };

  const final_price_product = useMemo(() => {
    const allProducts = [
      ...productLists['products'],
      ...productLists['dryMixes'],
      ...productLists['anchors'],
      ...productLists['tools'],
      ...productLists['related_materials'],
    ];

    return allProducts.reduce(
      (acc, el) =>
        acc +
        (el?.final_price ||
          el?.final_price_dry ||
          el?.final_price_anchor ||
          el?.final_price_tool ||
          el?.final_price_rel_mat ||
          0),
      0,
    );
  }, [
    productLists.products,
    productLists.dryMixes,
    productLists.anchors,
    productLists.tools,
    productLists.related_materials,
  ]);

  useEffect(() => {
    const delivery = Number(orderCartData?.delivery || 0);
    const delivery_m2 = Number(orderCartData?.delivery_m2 || 0);
    const vatPercent = Number(vatValue.vat_procent || 0);

    if (!final_price_product || !vatPercent) {
      setVatValue((prev) => ({
        ...prev,
        vat_euro_origin: 0,
        vat_result: 0,
        vat_euro: 0,
        vat_result_del: delivery + delivery_m2,
        vat_procent: orderCartData?.region == 'peninsular_spain' ? 21 : 0,
      }));
      return;
    }

    const vat_euro = ((vatPercent * final_price_product) / 100).toFixed(2);
    const vat_result = (final_price_product + Number(vat_euro)).toFixed(2);

    const vat_result_del = (
      Number(vat_result) +
      (delivery + delivery_m2) * (1 + vatPercent / 100)
    ).toFixed(2);

    setVatValue((prev) => ({
      ...prev,
      vat_euro_origin: final_price_product,
      vat_result,
      vat_euro,
      vat_result_del,
    }));
  }, [
    final_price_product,
    vatValue.vat_procent,
    orderCartData?.delivery,
    orderCartData?.delivery_m2,
  ]);

  const deliveryFunc = async () => {
    const delivery = Number(orderCartData?.delivery || 0);

    dispatch(
      addNewDeliveryPrice({
        order_id: orderCartData.id,
        delivery,
      }),
    );
  };

  const deliveryM2Func = async () => {
    const delivery_m2 = Number(orderCartData?.delivery_m2 || 0);

    dispatch(
      addNewDeliveryPrice({
        order_id: orderCartData.id,
        delivery_m2,
      }),
    );
  };

  const hasHydratedFromStorage = useRef(false);

  useEffect(() => {
    const storedData = localStorage.getItem('orderCartData')
      ? JSON.parse(localStorage.getItem('orderCartData'))
      : null;

    if (!storedData?.id) return;

    const updatedOrderCartData = list_of_orders.find(
      (order) => order.id === storedData.id,
    );

    // Подтягиваем сохранённые данные из localStorage только один раз
    // (например, после перезагрузки страницы), а не при каждом обновлении
    // list_of_orders — иначе свежие delivery/delivery_m2 будут затёрты
    // устаревшим снапшотом.
    if (!hasHydratedFromStorage.current) {
      setOrderCartData(storedData);
      hasHydratedFromStorage.current = true;
    }

    if (!orderCartData?.shipping_date && updatedOrderCartData?.shipping_date) {
      setOrderCartData((prev) => ({
        ...prev,
        shipping_date: updatedOrderCartData.shipping_date,
      }));
    }

    // delivery и delivery_m2 всегда синхронизируем из свежих данных Redux
    // (source of truth после сохранения на бэке), а не из localStorage
    if (updatedOrderCartData?.delivery !== undefined) {
      setOrderCartData((prev) => ({
        ...prev,
        delivery: updatedOrderCartData.delivery,
      }));
    }

    if (updatedOrderCartData?.delivery_m2 !== undefined) {
      setOrderCartData((prev) => ({
        ...prev,
        delivery_m2: updatedOrderCartData.delivery_m2,
      }));
    }

    if (updatedOrderCartData && updatedOrderCartData !== orderCartData) {
      setOrderCartData((prev) => ({
        ...prev,
        status: updatedOrderCartData.status,
      }));
    }

    if (!ordersStatus.includes(updatedOrderCartData?.status))
      setOrdersStatus((prev) => [...prev, updatedOrderCartData?.status]);

    setOrderCartData((prev) => ({
      ...prev,
      description: updatedOrderCartData?.description,
    }));
  }, [list_of_orders]);

  // Отдельно зеркалим АКТУАЛЬНЫЙ orderCartData в localStorage (например, чтобы
  // переживать перезагрузку страницы), вместо повторного сохранения устаревшего
  // снапшота, прочитанного из него же самого.
  useEffect(() => {
    if (orderCartData?.id) {
      localStorage.setItem('orderCartData', JSON.stringify(orderCartData));
    }
  }, [orderCartData]);

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Orders');
      setUserAccess(access);

      const statusAccess = checkUserAccess(user, roles, 'Orders_status');
      setOrderStatusAccess(statusAccess);

      const deleteAccess = checkUserAccess(user, roles, 'Del_orders');
      setDeleteOrderAccess(deleteAccess);

      if (!access?.canRead) {
        navigate('/');
      }
    }
  }, [user, roles]);

  const handleSelectChange = (selectedOption) => {
    setSelectedPersonInCharge((prev) => ({
      ...prev,
      person_in_charge: selectedOption.value,
    }));
    const order_id = orderCartData?.id;
    dispatch(
      updateOrderInCharge({
        order_id,
        person_in_charge: selectedOption.value,
      }),
    );
  };

  const getSelectedOption = () => {
    const options = personsInChargeList;
    if (!options) return null;
    const personInChargeOption = options.find(
      (option) => option.value === orderCartData?.person_in_charge,
    );
    return personInChargeOption || options[0];
  };

  const handlePaymentMethodChange = (selectedOption) => {
    setOrderCartData((prev) => ({
      ...prev,
      payment_method: selectedOption.value,
    }));

    dispatch(
      updatePayment({
        order_id: orderCartData?.id,
        payment_method: selectedOption.value,
      }),
    );
  };

  const getSelectedPaymentMethodOption = () => {
    const paymentMethodOption = PAYMENT_METHOD_OPTIONS.find(
      (option) => option.value == orderCartData?.payment_method,
    );
    return paymentMethodOption || PAYMENT_METHOD_OPTIONS[0];
  };

  const productHandler = (product) => {
    const reservedProduct = productsOfOrders.find(
      (orderedProduct) =>
        orderedProduct.order_id === product.order_id &&
        orderedProduct.product_id === product.product_id,
    );

    if (reservedProduct) {
      const filteredWarehouseID = reservedProducts.filter(
        (entry) => entry.orders_products_id === reservedProduct.id,
      );
      const filteredWarehouse = warehouse_data.filter((entry) =>
        filteredWarehouseID.some(
          (warehouseIDs) => warehouseIDs.warehouse_id === entry.id,
        ),
      );
      const articles = {
        product_article: product.product_article,
        order_article: orderCartData.article,
      };
      setCurrentOrderedProduct(articles);
      setFilteredWarehouseByProduct(filteredWarehouse);
      setReserveModalShow(true);
    }
  };

  useEffect(() => {
    const result = accountingDataList.find(
      (el) => el.orders_article == orderCartData?.article,
    )?.aproved;

    setAproveAccounting(result ?? true);
  }, [accountingDataList]);

  useEffect(() => {
    if (orderCartData?.id) {
      const updatedOrder = list_of_orders.find(
        (order) => order.id === orderCartData.id,
      );
      if (updatedOrder?.secondaryContact) {
        setOrderCartData((prev) => ({
          ...prev,
          secondaryContact: updatedOrder.secondaryContact,
        }));
      }
    }
  }, [list_of_orders, orderCartData?.id]);

  // const randomDateChange = async () => {
  //   const today = new Date();
  //   const randomDays = Math.floor(Math.random() * 365) + 1; // от 1 до 365 дней вперед
  //   const randomDate = new Date(today);
  //   randomDate.setDate(today.getDate() + randomDays);

  //   const formattedDate = randomDate
  //     .toLocaleDateString('ru-RU', {
  //       day: '2-digit',
  //       month: '2-digit',
  //       year: 'numeric',
  //     })
  //     .replace(/\//g, '.');

  //   handleDateChange(randomDate);

  //   await dispatch(
  //     addDataShipOrder({
  //       order_id: orderCartData?.id,
  //       shipping_date: formattedDate,
  //     })
  //   );

  //   await dispatch(
  //     updateOrderStatus({
  //       order_id: orderCartData?.id,
  //       status: 6,
  //     })
  //   );
  // };

  // useEffect(() => {
  //   if (!randomOrderCheck) return;
  //   setProductModalOrder(true);
  //   // randomDateChange();
  // }, [randomOrderCheck, updatedProductListOrder]);

  // useEffect(() => {
  // console.log('randomFillComplete', randomFillComplete);
  // if (!randomFillComplete || updatedProductListOrder.length < 1) return;
  // const status = {
  //   Header: 'Order allowed for production',
  //   accessor: 6,
  // };

  // statusChangeHandler(status, true);
  // console.log('STATUS CHANGE ----------------------------');

  // pipelineFillForRandom();

  //   setRandomFillComplete(false);
  // }, [randomFillComplete, updatedProductListOrder]);

  return (
    <>
      {productInfoModalOrder && (
        <OrderProductCardInfoModal
          isOpen={productInfoModalOrder}
          toggle={() => setProductInfoModalOrder(!productInfoModalOrder)}
        />
      )}
      {warehouseInfoModal && (
        <ListOfReservedProductsModal
          isOpen={warehouseInfoModal}
          toggle={() => setWarehouseInfoModal(!warehouseInfoModal)}
        />
      )}
      {liberarModalShow && (
        <LiberarModal
          show={liberarModalShow}
          onHide={() => setLiberarModalShow(false)}
          orderCartData={orderCartData}
          productLists={productLists}
          onSuccess={() => navigate('/orders')}
        />
      )}
      {reserveModalShow && (
        <ListOfOrderedProductionReserveModal
          show={reserveModalShow}
          onHide={() => setReserveModalShow(false)}
          listOfOrderedProductionReserveData={filteredWarehouseByProduct}
          currentOrderedProduct={currentOrderedProduct}
          handleRowClick={(row) => {
            setWarehouseInfoCurIdModal(row.original.id);
            setReserveModalShow(!reserveModalShow);
            // без этого лочится скролл, я хз почему
            document.body.style.overflow = 'auto';
            document.body.style.paddingRight = '0px';
            setWarehouseInfoModal(!warehouseInfoModal);
          }}
        />
      )}

      <div className="ord-card">
        <div className="ord-card__head">
          <div className="ord-card__head-left">
            <h1 className="ord-card__article">{orderCartData?.article}</h1>
            {cardStatusLabel && (
              <span
                className="ord-pill"
                style={{
                  background: cardStatusTheme.bg,
                  color: cardStatusTheme.color,
                }}
              >
                <span
                  className="ord-pill__dot"
                  style={{ background: cardStatusTheme.dot }}
                />
                {cardStatusLabel}
              </span>
            )}
          </div>
          <div className="ord-card__actions">
            {deleteOrderAccess?.canWrite && orderCartData?.status < 3 && (
              <button
                type="button"
                className="ord-btn ord-btn--danger-outline"
                onClick={() => {
                  dispatch(deleteOrder(orderCartData?.id));
                  navigate('/orders');
                }}
              >
                Delete order
              </button>
            )}
            {orderCartData.main_order == null && orderCartData?.status == 4 && (
              <button
                type="button"
                className="ord-btn ord-btn--ghost"
                onClick={() => setLiberarModalShow(true)}
              >
                Liberar
              </button>
            )}
          </div>
        </div>

        <div className="ord-grid">
          <div>
            <div className="ord-tiles">
              <div className="ord-tile">
                <div className="ord-tile__label">Client information</div>
                {filterAndMapData(orderCartData?.owner, filterKeysOrder)}
              </div>

              <div className="ord-tile">
                <div className="ord-tile__head">
                  <div className="ord-tile__label">Contact person</div>
                  {userAccess?.canWrite && orderCartData?.status < 3 && (
                    <ShowOrderContactEditModal />
                  )}
                </div>
                {filterAndMapData(orderCartData?.contactInfo, filterKeysOrder)}
              </div>

              <div className="ord-tile">
                <div className="ord-tile__head">
                  <div className="ord-tile__label">Delivery address</div>
                  {userAccess?.canWrite && orderCartData?.status < 3 && (
                    <ShowOrderDeliveryEditModal />
                  )}
                </div>
                {filterAndMapData(
                  orderCartData?.deliveryAddress,
                  filterKeysOrder,
                )}
              </div>

              <div className="ord-tile">
                <div className="ord-tile__label">Description</div>
                {orderCartData?.description && !isEditing ? (
                  <>
                    <div className="ord-tile__body-text">
                      {orderCartData.description}
                    </div>
                    <button
                      type="button"
                      className="ord-btn ord-btn--ghost ord-btn--sm"
                      style={{ marginTop: 10 }}
                      onClick={onEditHandler}
                    >
                      Edit
                    </button>
                  </>
                ) : (
                  <div className="ord-desc-edit">
                    <textarea
                      placeholder="Enter description..."
                      value={newDescription}
                      disabled={
                        !checkUserAccess(user, roles, 'orders_description_edit')
                          ?.canWrite
                      }
                      onChange={(e) => setNewDescription(e.target.value)}
                    />
                    {checkUserAccess(user, roles, 'orders_description_edit')
                      ?.canWrite && (
                      <button
                        type="button"
                        className="ord-btn ord-btn--primary ord-btn--sm"
                        onClick={() => onSaveDescription(newDescription)}
                      >
                        Save
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="ord-tile" style={{ marginBottom: 16 }}>
              <div className="ord-tile__head">
                <div className="ord-tile__label">Secondary contacts</div>
                {haveSecondaryContact && (
                  <button
                    type="button"
                    className="ord-btn ord-btn--ghost ord-btn--sm"
                    onClick={() => {
                      dispatch(delSecondaryContact(orderCartData?.id));
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
              {haveSecondaryContact ? (
                filterAndMapData(
                  orderCartData?.secondaryContact,
                  filterKeysOrder,
                )
              ) : isAddSecCont ? (
                <>
                  <ClientsContactInfo
                    clickFunk={addSecCntFunc}
                    fullContact={true}
                  />
                </>
              ) : (
                <button
                  type="button"
                  className="ord-btn ord-btn--ghost ord-btn--sm"
                  onClick={() => addSecondaryContactHandler()}
                >
                  Add secondary contact
                </button>
              )}
            </div>

            <BlocksJournalTableOrder
              productListOrder={blocksListWithDeliveryM2}
              onProductClickHandler={onProductClickHandler}
              filterAndMapData={filterAndMapData}
              filterKeys={filterKeysOrder}
              productHandler={productHandler}
              deleteHandler={deleteHandler}
              displayNames={displayNames}
            />
            <DryMixesJournalTableOrder
              productListOrder={updatedDryMixesListOrder}
              onProductClickHandler={onProductClickHandler}
              filterAndMapData={filterAndMapData}
              filterKeys={filterKeysOrder}
              deleteHandler={deleteHandler}
              displayNames={displayNames}
            />
            <AnchorJournalTableOrder
              productListOrder={updatedAnchorsListOrder}
              onProductClickHandler={onProductClickHandler}
              filterAndMapData={filterAndMapData}
              filterKeys={filterKeysOrder}
              deleteHandler={deleteHandler}
              displayNames={displayNames}
            />
            <ToolJournalTableOrder
              productListOrder={updatedToolsListOrder}
              onProductClickHandler={onProductClickHandler}
              filterAndMapData={filterAndMapData}
              filterKeys={filterKeysOrder}
              deleteHandler={deleteHandler}
              displayNames={displayNames}
            />
            <RelatedMaterialJournalTableOrder
              productListOrder={updatedRelatedMaterialsListOrder}
              onProductClickHandler={onProductClickHandler}
              filterAndMapData={filterAndMapData}
              filterKeys={filterKeysOrder}
              deleteHandler={deleteHandler}
              displayNames={displayNames}
              vatValue={vatValue}
              setVatValue={setVatValue}
            />
          </div>

          <div>
            <div className="ord-summary-card">
              <div className="ord-summary-card__title">Order summary</div>
              <div className="ord-summary-rows">
                <div className="ord-summary-row">
                  <span className="ord-summary-row__label">VAT origin, €</span>
                  <span className="ord-summary-row__value">
                    {vatValue.vat_euro_origin}
                  </span>
                </div>
                <div className="ord-summary-row">
                  <span className="ord-summary-row__label">VAT, %</span>
                  <span className="ord-summary-row__value">
                    {vatValue.vat_procent}
                  </span>
                  {/* <input
                    type="text"
                    id="vat_procent"
                    name="vat_procent"
                    className="ord-summary-input"
                    value={vatValue.vat_procent}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    onBlur={() => {
                      if (vatValue.vat_procent.trim() === '') {
                        setVatValue((prev) => ({
                          ...prev,
                          vat_procent: 21,
                        }));
                      }
                    }}
                    readOnly={orderCartData?.status < 5 ? true : true}
                  /> */}
                </div>
                <div className="ord-summary-row">
                  <span className="ord-summary-row__label">VAT, €</span>
                  <span className="ord-summary-row__value">
                    {vatValue.vat_euro}
                  </span>
                </div>
                <div className="ord-summary-row">
                  <span className="ord-summary-row__label">Payment method</span>
                  <span style={{ minWidth: 220 }}>
                    <Select
                      value={getSelectedPaymentMethodOption(
                        orderCartData?.payment_method,
                      )}
                      onChange={(v) => {
                        handlePaymentMethodChange(v);
                      }}
                      options={PAYMENT_METHOD_OPTIONS}
                      isDisabled={orderCartData?.status < 5 ? false : true}
                    />
                  </span>
                </div>
                <div className="ord-summary-row">
                  <span className="ord-summary-row__label">Delivery price</span>
                  <span
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <input
                      type="text"
                      id="delivery"
                      name="delivery"
                      className="ord-summary-input"
                      value={orderCartData.delivery ?? 0}
                      onChange={(e) => {
                        setOrderCartData((prev) => ({
                          ...prev,
                          delivery: Number(e.target.value),
                        }));
                      }}
                      readOnly={orderCartData?.status < 5 ? false : true}
                      disabled={
                        orderCartData?.status >= 5 ||
                        !checkUserAccess(
                          user,
                          roles,
                          'orders_save_delivery_price',
                        )?.canWrite
                      }
                    />
                    {checkUserAccess(user, roles, 'orders_description_edit')
                      ?.canWrite &&
                      orderCartData?.status < 5 && (
                        <button
                          type="button"
                          className="ord-btn ord-btn--ghost ord-btn--sm"
                          onClick={() => {
                            deliveryFunc();
                          }}
                        >
                          Save
                        </button>
                      )}
                  </span>
                </div>
                <div className="ord-summary-row">
                  <span className="ord-summary-row__label">
                    Delivery price for m2 full
                  </span>
                  <span
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <input
                      type="text"
                      id="delivery_m2"
                      name="delivery_m2"
                      className="ord-summary-input"
                      value={orderCartData.delivery_m2 ?? 0}
                      onChange={(e) => {
                        setOrderCartData((prev) => ({
                          ...prev,
                          delivery_m2: Number(e.target.value),
                        }));
                      }}
                      readOnly={orderCartData?.status < 5 ? false : true}
                      disabled={
                        orderCartData?.main_order ||
                        !checkUserAccess(
                          user,
                          roles,
                          'orders_save_delivery_price',
                        )?.canWrite
                      }
                    />
                    {checkUserAccess(user, roles, 'orders_description_edit')
                      ?.canWrite &&
                      orderCartData?.status < 5 &&
                      !orderCartData?.main_order && (
                        <button
                          type="button"
                          className="ord-btn ord-btn--ghost ord-btn--sm"
                          onClick={() => {
                            deliveryM2Func();
                          }}
                        >
                          Save
                        </button>
                      )}
                  </span>
                </div>
                <div className="ord-summary-divider" />
                <div className="ord-summary-row ord-summary-row--total">
                  <span className="ord-summary-row__label">Result</span>
                  <span className="ord-summary-row__value">
                    {vatValue.vat_result}
                  </span>
                </div>
                {vatValue.vat_result_del > 0 ? (
                  <div className="ord-summary-row ord-summary-row--total ord-summary-row--accent">
                    <span className="ord-summary-row__label">
                      Result with delivery
                    </span>
                    <span className="ord-summary-row__value">
                      {vatValue.vat_result_del}
                    </span>
                  </div>
                ) : null}
              </div>

              {orderCartData.status >= 4 ? (
                <div className="ord-summary-block">
                  {haveShipDate ? (
                    <div className="ord-tile__body-text">
                      Shipping date: {haveShipDate} ({handleDayBeforShipping()}{' '}
                      days before shipment)
                    </div>
                  ) : (
                    <div className="ord-field">
                      <label className="ord-field__label">Shipping date</label>
                      <DatePicker
                        id="data_pcker"
                        selected={dataValue}
                        onChange={(date) => handleDateChange(date)}
                        dateFormat="dd.MM.yyyy"
                        className="ord-liberar-date"
                      />
                    </div>
                  )}
                </div>
              ) : null}

              {checkUserAccess(user, roles, 'orders_change_person_in_charge')
                ?.canWrite && (
                <div className="ord-summary-block">
                  <div className="ord-field__label">Person in charge</div>
                  <Select
                    defaultValue={getSelectedOption(
                      orderCartData?.person_in_charge,
                    )}
                    onChange={(v) => {
                      handleSelectChange(v);
                    }}
                    options={personsInChargeList}
                    isDisabled={orderCartData?.status < 3 ? false : true}
                  />
                </div>
              )}

              <div className="ord-summary-block">
                <div className="ord-tile__label" style={{ marginBottom: 8 }}>
                  Files
                </div>
                <FilesMain userAccess={userAccess} />
              </div>

              <div className="ord-summary-block">
                <div className="ord-tile__label" style={{ marginBottom: 8 }}>
                  PDF &amp; Bitrix
                </div>
                <PDFgenerate
                  orderData={orderCartData}
                  productList={productLists}
                  vatValue={vatValue}
                />
              </div>
            </div>

            {orderStatusAccess?.canRead && (
              <div className="ord-status-card">
                <div className="ord-status-card__title">Order status</div>
                {!aproveAccounting && (
                  <div className="ord-status-warn">
                    Awaiting accounting approval
                  </div>
                )}
                <div className="ord-steps">
                  {(() => {
                    const currentStatusIndex = status_list.findIndex(
                      (item) => item.accessor === orderCartData?.status,
                    );
                    return status_list.map((item, idx) => {
                      const isDone = item.accessor < orderCartData?.status;
                      const isCurrent = item.accessor === orderCartData?.status;
                      const isDisabled =
                        !orderStatusAccess?.canWrite ||
                        item?.accessor == 7 ||
                        item?.accessor == 9;
                      const isNext =
                        currentStatusIndex !== -1 &&
                        idx === currentStatusIndex + 1 &&
                        !isDisabled;
                      return (
                        <div key={item.accessor} className="ord-step">
                          <div className="ord-step__rail">
                            <input
                              id={item.accessor}
                              type="checkbox"
                              className={
                                'ord-step__checkbox' +
                                (isDone ? ' ord-step__checkbox--done' : '') +
                                (isCurrent
                                  ? ' ord-step__checkbox--current'
                                  : '') +
                                (isNext ? ' ord-step__checkbox--next' : '')
                              }
                              checked={item.accessor === orderCartData?.status}
                              onChange={() => {
                                statusChangeHandler(item);
                              }}
                              disabled={isDisabled} //
                            />
                            {idx < status_list.length - 1 && (
                              <div
                                className={
                                  'ord-step__line' +
                                  (isDone ? ' ord-step__line--done' : '')
                                }
                              />
                            )}
                          </div>
                          <div
                            className={
                              'ord-step__label' +
                              (isCurrent
                                ? ' ord-step__label--current'
                                : isDone
                                  ? ' ord-step__label--done'
                                  : isNext
                                    ? ' ord-step__label--next'
                                    : '')
                            }
                          >
                            {item.Header}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
});
export default OrderCart;
