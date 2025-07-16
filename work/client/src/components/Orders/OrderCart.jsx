import React, { useEffect, useMemo, useCallback, useState } from 'react';
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
import { Button } from 'reactstrap';
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
  } = useOrderContext();
  const {
    productInfoModalOrder,
    setProductInfoModalOrder,
    warehouseInfoModal,
    setWarehouseInfoModal,
    setWarehouseInfoCurIdModal,
  } = useModalContext();
  const { displayNames, user } = useProjectContext();

  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();
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
    vat_procent: 21,
    vat_euro: 0,
    vat_result: 0,
  });

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

  const filterKeys = useMemo(
    () => [
      'id',
      'order_id',
      'dry_mixed_id',
      'client_id',
      'product_id',
      'createdAt',
      'updatedAt',
    ],
    []
  );

  const haveShipDate = useMemo(() => {
    return orderCartData?.shipping_date ?? false;
  }, [orderCartData]);

  const filterAndMapData = useCallback(
    (data, filterKeys) =>
      Object.entries(data || {})
        .filter(([key]) => !filterKeys?.includes(key))
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
    [orderCartData]
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
    [dataValue]
  );

  const onEditHandler = () => {
    setNewDescription(orderCartData?.description);
    setIsEditing(true);
  };

  const handleDayBeforShipping = useCallback(() => {
    const currentDate = new Date();
    const shippingDateString = orderCartData?.shipping_date;

    const shippingDate = new Date(shippingDateString.split('.').reverse().join('-'));

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
      addSecondaryContact({ secondary_contact: secCnt, order_id: orderCartData.id })
    );

    setIsAddSecCont(false);
  };

  const addProductArticleToOrderList = useCallback(
    (productsOfOrders, productsTable, arrayName) => {
      if (!productsOfOrders || !productsTable || !arrayName || !orderCartData?.id)
        return [];

      const updatedOrderProducts = productsOfOrders
        .filter((el) => el.order_id == orderCartData.id)
        .map((orderProduct) => {
          const id = getCorrectProductId(arrayName);

          const product = productsTable.find((p) => p.id === orderProduct?.[id]);

          return product
            ? { product_article: product.article, ...orderProduct }
            : { ...orderProduct, product_article: 'Unknown' };
        });

      return updatedOrderProducts;
    },
    [orderCartData?.id] // Добавляем зависимость
  );

  const updatedProductListOrder = useMemo(() => {
    return addProductArticleToOrderList(
      productsOfOrders,
      latestProducts,
      'products'
    );
  }, [productsOfOrders, latestProducts, addProductArticleToOrderList]);

  useEffect(() => {
    if (updatedProductListOrder.length > 0) {
      setProductLists((prevState) => ({
        ...prevState,
        products: updatedProductListOrder,
      }));
    }
  }, [updatedProductListOrder]);

  const updatedDryMixesListOrder = useMemo(() => {
    return addProductArticleToOrderList(
      dryMixedProductsOfOrders,
      latestDryMix,
      'dryMixes'
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
      'anchors'
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
    return addProductArticleToOrderList(toolProductsOfOrders, latestTools, 'tools');
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
      'related_materials'
    );
  }, [relMatProductsOfOrders, latestRelatedMaterials, addProductArticleToOrderList]);

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
              (el) => el.article === sel_prod.product_article
            )
          : sel_prod.product_article.slice(2, 3) == 'F'
          ? latestAnchors.find((el) => el.article === sel_prod.product_article)
          : latestTools.find((el) => el.article === sel_prod.product_article);
      setSelectedProduct(product);
      setProductOfOrder({ ...sel_prod, product_id: product?.id });
      setProductInfoModalOrder(!productInfoModalOrder);
    }
  };

  const statusChangeHandler = (status) => {
    if (
      status.accessor < orderCartData?.status ||
      status.accessor > orderCartData?.status + 1
    ) {
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

    if (status.accessor > status_list[3].accessor && !hasShippingDate) {
      alert('Пожалуйста, выберите дату отправки');
      return;
    } else if (status.accessor === status_list[4].accessor) {
      dispatch(
        addDataShipOrder({
          order_id,
          shipping_date: formatDataValue,
        })
      );
    }

    // blocks

    updatedProductListOrder?.forEach((product) => {
      const loc = latestProducts.find(
        (el) => el.article == product.product_article
      )?.placeOfProduction;

      const haveProductReserve = list_of_reserved_products.find(
        (el) => el.orders_products_id == product.id
      );

      if (
        status.accessor === status_list[5].accessor &&
        loc === 'Spain' &&
        !haveProductReserve
      ) {
        const reservedProduct = productsOfOrders.find(
          (orderedProduct) =>
            orderedProduct.order_id === product.order_id &&
            orderedProduct.product_id === product.product_id
        );

        let remainingToAllocate = reservedProduct.quantity_palet || 0; // Сколько нужно зарезервировать для этого товара

        const matchingWarehouseProducts =
          warehouse_data?.filter(
            (warehouseItem) =>
              warehouseItem.product_article === product?.product_article
          ) || []; // Если warehouse_data undefined, используем пустой массив

        // Проходим по складу и "забираем" остатки
        for (const warehouseItem of matchingWarehouseProducts) {
          if (remainingToAllocate > 0 && warehouseItem.free_quantity_remaining > 0) {
            const taken = Math.min(
              warehouseItem.free_quantity_remaining,
              remainingToAllocate
            );

            // Обновляем данные склада
            dispatch(
              updateRemainingStock({
                warehouse_id: warehouseItem?.id,
                free_quantity_remaining:
                  warehouseItem.free_quantity_remaining - taken,
                ordered_quantity: (warehouseItem.ordered_quantity || 0) + taken,
              })
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
          })
        );
      } else if (
        status.accessor === status_list[5].accessor &&
        !haveProductReserve
      ) {
        dispatch(
          addNewListOfOrderedProductionOEM({
            shipping_date: orderCartData?.shipping_date,
            product_article: product?.product_article,
            order_article: orderCartData?.article,
            quantity: product?.quantity_palet,
            status: ordered_production_oem_status[0].accessor,
          })
        );
      }
    });

    // dry mix

    updatedDryMixesListOrder?.forEach((product) => {
      const loc = latestDryMix.find(
        (el) => el.article == product.product_article
      )?.place_of_production;

      if (status.accessor === status_list[5].accessor && loc === 'ES') {
        const reservedProduct = dryMixedProductsOfOrders.find(
          (orderedProduct) =>
            orderedProduct.order_id === product.order_id &&
            orderedProduct.dry_mixed_id === product.dry_mixed_id
        );

        let remainingToAllocate = reservedProduct.quantity_palet_dry || 0; // Сколько нужно зарезервировать для этого товара

        const matchingWarehouseProducts =
          dry_mixes_warehouse_data?.filter(
            (warehouseItem) =>
              warehouseItem.product_article === product?.product_article
          ) || []; // Если dry_mixes_warehouse_data undefined, используем пустой массив

        // Проходим по складу и "забираем" остатки
        for (const warehouseItem of matchingWarehouseProducts) {
          if (remainingToAllocate > 0 && warehouseItem.free_quantity_remaining > 0) {
            const taken = Math.min(
              warehouseItem.free_quantity_remaining,
              remainingToAllocate
            );

            // Обновляем данные склада
            dispatch(
              updateDryMixesWarehouse({
                id: warehouseItem?.id,
                free_quantity_remaining:
                  warehouseItem.free_quantity_remaining - taken,
                ordered_quantity: (warehouseItem.ordered_quantity || 0) + taken,
              })
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
          })
        );
      }
    });

    // fastners

    updatedAnchorsListOrder?.forEach((product) => {
      const loc = latestAnchors.find(
        (el) => el.article == product.product_article
      )?.place_of_production;

      if (status.accessor === status_list[5].accessor && loc === 'ES') {
        const reservedProduct = anchorProductsOfOrders.find(
          (orderedProduct) =>
            orderedProduct.order_id === product.order_id &&
            orderedProduct.anchor_id === product.anchor_id
        );

        let remainingToAllocate = reservedProduct.quantity_palet_anchor || 0; // Сколько нужно зарезервировать для этого товара

        const matchingWarehouseProducts =
          anchors_warehouse_data?.filter(
            (warehouseItem) =>
              warehouseItem.product_article === product?.product_article
          ) || []; // Если anchors_warehouse_data undefined, используем пустой массив

        // Проходим по складу и "забираем" остатки
        for (const warehouseItem of matchingWarehouseProducts) {
          if (remainingToAllocate > 0 && warehouseItem.free_quantity_remaining > 0) {
            const taken = Math.min(
              warehouseItem.free_quantity_remaining,
              remainingToAllocate
            );

            // Обновляем данные склада
            dispatch(
              updateAnchorsWarehouse({
                id: warehouseItem?.id,
                free_quantity_remaining:
                  warehouseItem.free_quantity_remaining - taken,
                ordered_quantity: (warehouseItem.ordered_quantity || 0) + taken,
              })
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
          })
        );
      }
    });

    // tools

    updatedToolsListOrder?.forEach((product) => {
      const loc = latestTools.find(
        (el) => el.article == product.product_article
      )?.place_of_production;

      if (status.accessor === status_list[5].accessor && loc === 'ES') {
        const reservedProduct = toolProductsOfOrders.find(
          (orderedProduct) =>
            orderedProduct.order_id === product.order_id &&
            orderedProduct.tool_id === product.tool_id
        );

        let remainingToAllocate = reservedProduct.quantity_ud || 0; // Сколько нужно зарезервировать для этого товара

        const matchingWarehouseProducts =
          tools_warehouse_data?.filter(
            (warehouseItem) =>
              warehouseItem.product_article === product?.product_article
          ) || []; // Если tools_warehouse_data undefined, используем пустой массив

        // Проходим по складу и "забираем" остатки
        for (const warehouseItem of matchingWarehouseProducts) {
          if (remainingToAllocate > 0 && warehouseItem.free_quantity_remaining > 0) {
            const taken = Math.min(
              warehouseItem.free_quantity_remaining,
              remainingToAllocate
            );

            // Обновляем данные склада
            dispatch(
              updateToolsWarehouse({
                id: warehouseItem?.id,
                free_quantity_remaining:
                  warehouseItem.free_quantity_remaining - taken,
                ordered_quantity: (warehouseItem.ordered_quantity || 0) + taken,
              })
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
          })
        );
      }
    });

    // related material
    updatedRelatedMaterialsListOrder?.forEach((product) => {
      const loc = latestRelatedMaterials.find(
        (el) => el.article == product.product_article
      )?.place_of_production;

      if (status.accessor === status_list[5].accessor && loc === 'ES') {
        const reservedProduct = relMatProductsOfOrders.find(
          (orderedProduct) =>
            orderedProduct.order_id === product.order_id &&
            orderedProduct.rel_mat_id === product.rel_mat_id
        );

        let remainingToAllocate = reservedProduct.quantity_ud || 0; // Сколько нужно зарезервировать для этого товара

        const matchingWarehouseProducts =
          related_materials_warehouse_data?.filter(
            (warehouseItem) =>
              warehouseItem.product_article === product?.product_article
          ) || []; // Если related_materials_warehouse_data undefined, используем пустой массив

        // Проходим по складу и "забираем" остатки
        for (const warehouseItem of matchingWarehouseProducts) {
          if (remainingToAllocate > 0 && warehouseItem.free_quantity_remaining > 0) {
            const taken = Math.min(
              warehouseItem.free_quantity_remaining,
              remainingToAllocate
            );

            // Обновляем данные склада
            dispatch(
              updateRelatedMaterialsWarehouse({
                id: warehouseItem?.id,
                free_quantity_remaining:
                  warehouseItem.free_quantity_remaining - taken,
                ordered_quantity: (warehouseItem.ordered_quantity || 0) + taken,
              })
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
          })
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
        })
      );
    }
    if (status.accessor == 10) {
      dispatch(deleteAccountingData(orderCartData?.article));
    }

    dispatch(
      updateOrderStatus({
        order_id,
        status: status.accessor,
      })
    );
  };

  const deleteHandler = (product) => {
    const res_prod = list_of_reserved_products.find((el) => el.id === product.id);
    if (res_prod) alert('Этот продукт зарервировван на складе');
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
      0
    );
  }, [
    productLists.products,
    productLists.dryMixes,
    productLists.anchors,
    productLists.tools,
    productLists.related_materials,
  ]);

  useEffect(() => {
    if (!final_price_product || !vatValue.vat_procent) {
      setVatValue((prev) => ({ ...prev, vat_result: 0 }));
    } else {
      const vat_euro = ((vatValue.vat_procent * final_price_product) / 100).toFixed(
        2
      );
      const vat_result = Number(
        final_price_product + Number(vat_euro) + Number(orderCartData.delivery)
      ).toFixed(2);

      setVatValue((prev) => ({
        ...prev,
        vat_euro_origin: final_price_product,
        vat_result,
        vat_euro,
      }));
    }
  }, [final_price_product, vatValue.vat_procent, orderCartData.delivery]);

  useEffect(() => {
    const storedData = localStorage.getItem('orderCartData')
      ? JSON.parse(localStorage.getItem('orderCartData'))
      : null;

    const updatedOrderCartData = list_of_orders.find(
      (order) => order.id === storedData.id
    );

    if (storedData) {
      setOrderCartData(storedData);
    }

    if (!storedData?.shipping_date && updatedOrderCartData?.shipping_date) {
      setOrderCartData((prev) => ({
        ...prev,
        shipping_date: updatedOrderCartData.shipping_date,
      }));
    }

    if (updatedOrderCartData && updatedOrderCartData !== orderCartData) {
      setOrderCartData((prev) => ({ ...prev, status: updatedOrderCartData.status }));
    }

    if (!ordersStatus.includes(updatedOrderCartData?.status))
      setOrdersStatus((prev) => [...prev, updatedOrderCartData?.status]);

    setOrderCartData((prev) => ({
      ...prev,
      description: updatedOrderCartData?.description,
    }));

    localStorage.setItem('orderCartData', JSON.stringify(storedData));
  }, [list_of_orders]);

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
      })
    );
  };

  const getSelectedOption = () => {
    const options = personsInChargeList;
    if (!options) return null;
    const personInChargeOption = options.find(
      (option) => option.value === orderCartData?.person_in_charge
    );
    // Если выбранная опция найдена, возвращаем ее, иначе возвращаем первую опцию по умолчанию
    return personInChargeOption || options[0];
  };

  const productHandler = (product) => {
    const reservedProduct = productsOfOrders.find(
      (orderedProduct) =>
        orderedProduct.order_id === product.order_id &&
        orderedProduct.product_id === product.product_id
    );

    if (reservedProduct) {
      const filteredWarehouseID = reservedProducts.filter(
        (entry) => entry.orders_products_id === reservedProduct.id
      );
      const filteredWarehouse = warehouse_data.filter((entry) =>
        filteredWarehouseID.some(
          (warehouseIDs) => warehouseIDs.warehouse_id === entry.id
        )
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
      (el) => el.orders_article == orderCartData?.article
    )?.aproved;

    setAproveAccounting(result ?? true);
  }, [accountingDataList]);

  useEffect(() => {
    if (orderCartData?.id) {
      const updatedOrder = list_of_orders.find(
        (order) => order.id === orderCartData.id
      );
      if (updatedOrder?.secondaryContact) {
        setOrderCartData((prev) => ({
          ...prev,
          secondaryContact: updatedOrder.secondaryContact,
        }));
      }
    }
  }, [list_of_orders, orderCartData?.id]);

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

      <div className="page-container">
        <h4>Order number: {orderCartData?.article}</h4>

        <div className="header-container">
          <div className="owner-info">
            <h4>Client Information</h4>
            {filterAndMapData(orderCartData?.owner, filterKeys)}

            <div className="description">
              <h4>Description</h4>
              {orderCartData?.description && !isEditing ? (
                <>
                  <p style={{ height: '90%' }}>{orderCartData.description}</p>
                  <button className="edit-button" onClick={onEditHandler}>
                    Edit
                  </button>
                </>
              ) : (
                <div className="input-wrapper">
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
                      className="save-button"
                      onClick={() => onSaveDescription(newDescription)}
                    >
                      Save
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="contact-info">
            <div className="contact-text">
              <h4>Contact Person</h4>
              {filterAndMapData(orderCartData?.contactInfo, filterKeys)}
            </div>
            {userAccess?.canWrite && orderCartData?.status < 3 && (
              <ShowOrderContactEditModal />
            )}
          </div>

          <div className="delivery-address">
            <h4>Delivery Address</h4>
            {filterAndMapData(orderCartData?.deliveryAddress, filterKeys)}
            {userAccess?.canWrite && orderCartData?.status < 3 && (
              <ShowOrderDeliveryEditModal />
            )}
          </div>
          <div className="secondary-contact">
            <div className="sec-cont-container">
              <h4>Secondary Contacts</h4>
              {haveSecondaryContact && (
                <button
                  style={{ marginTop: '0' }}
                  onClick={() => {
                    dispatch(delSecondaryContact(orderCartData?.id));
                  }}
                >
                  Delete
                </button>
              )}
            </div>
            {haveSecondaryContact ? (
              filterAndMapData(orderCartData?.secondaryContact, filterKeys)
            ) : isAddSecCont ? (
              <>
                <ClientsContactInfo clickFunk={addSecCntFunc} fullContact={true} />
              </>
            ) : (
              <button onClick={() => addSecondaryContactHandler()}>
                Add secondary contact
              </button>
            )}
          </div>

          {deleteOrderAccess?.canWrite && orderCartData?.status < 3 && (
            <Button
              onClick={() => {
                dispatch(deleteOrder(orderCartData?.id));
                navigate('/orders');
              }}
            >
              Delete Order
            </Button>
          )}
        </div>

        <BlocksJournalTableOrder
          productListOrder={updatedProductListOrder}
          onProductClickHandler={onProductClickHandler}
          filterAndMapData={filterAndMapData}
          filterKeys={filterKeys}
          productHandler={productHandler}
          deleteHandler={deleteHandler}
        />
        <DryMixesJournalTableOrder
          productListOrder={updatedDryMixesListOrder}
          onProductClickHandler={onProductClickHandler}
          filterAndMapData={filterAndMapData}
          filterKeys={filterKeys}
          deleteHandler={deleteHandler}
        />
        <AnchorJournalTableOrder
          productListOrder={updatedAnchorsListOrder}
          onProductClickHandler={onProductClickHandler}
          filterAndMapData={filterAndMapData}
          filterKeys={filterKeys}
          deleteHandler={deleteHandler}
        />
        <ToolJournalTableOrder
          productListOrder={updatedToolsListOrder}
          onProductClickHandler={onProductClickHandler}
          filterAndMapData={filterAndMapData}
          filterKeys={filterKeys}
          deleteHandler={deleteHandler}
        />
        <RelatedMaterialJournalTableOrder
          productListOrder={updatedRelatedMaterialsListOrder}
          onProductClickHandler={onProductClickHandler}
          filterAndMapData={filterAndMapData}
          filterKeys={filterKeys}
          deleteHandler={deleteHandler}
        />

        <div className="footer_data">
          <div className="vat_container">
            <div className="vat">
              <div className="vat_euro">
                <div>
                  <p>VAT ORIGIN, EURO</p>
                  <p>{vatValue.vat_euro_origin}</p>
                </div>
              </div>
              <div className="vat_procent">
                <div>
                  <p>VAT, %</p>
                  <input
                    type="text"
                    id="vat_procent"
                    name="vat_procent"
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
                    readOnly={orderCartData?.status < 3 ? false : true}
                  />
                </div>
              </div>
              <div className="vat_euro">
                <div>
                  <p>VAT, EURO</p>
                  <p>{vatValue.vat_euro}</p>
                </div>
              </div>
              <div className="vat_procent">
                <div>
                  <p>Delivery</p>
                  <input
                    type="text"
                    id="delivery"
                    name="delivery"
                    value={orderCartData.delivery ?? 0}
                    onChange={(e) => {
                      setOrderCartData((prev) => ({
                        ...prev,
                        delivery: Number(e.target.value),
                      }));
                    }}
                    readOnly={orderCartData?.status < 3 ? false : true}
                    disabled={
                      !checkUserAccess(user, roles, 'orders_save_delivery_price')
                        ?.canWrite
                    }
                  />
                  {checkUserAccess(user, roles, 'orders_description_edit')
                    ?.canWrite && (
                    <button
                      style={{
                        padding: '4px 10px',
                        marginLeft: '20px',
                      }}
                      onClick={() => {
                        dispatch(
                          addNewDeliveryPrice({
                            order_id: orderCartData.id,
                            delivery: orderCartData.delivery,
                          })
                        );
                      }}
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
              <div className="vat_result">
                <p>Result</p>
                <p>{vatValue.vat_result}</p>
              </div>
            </div>
            <div className="shipping_date">
              {haveShipDate ? (
                <p>
                  Shipping date: {haveShipDate} ({handleDayBeforShipping()} days
                  before shipment)
                </p>
              ) : (
                <div>
                <p>Shipping date</p>
                <DatePicker
                  id="data_pcker"
                  type="text"
                  selected={dataValue}
                  onChange={(date) => handleDateChange(date)}
                  dateFormat="dd.MM.yyyy"
                />
                </div>
              )}
            </div>
            {checkUserAccess(user, roles, 'orders_change_person_in_charge')
              ?.canWrite && (
              <div className="footer_button">
                <p>Person in charge</p>
                <Select
                  defaultValue={getSelectedOption(orderCartData?.person_in_charge)}
                  onChange={(v) => {
                    handleSelectChange(v);
                  }}
                  options={personsInChargeList}
                  isDisabled={orderCartData?.status < 3 ? false : true}
                />
              </div>
            )}
            <FilesMain userAccess={userAccess} />

            <div className="footer_button_pdf">
              <PDFgenerate
                orderData={orderCartData}
                productList={productLists}
                vatValue={vatValue}
              />
            </div>
          </div>
          {orderStatusAccess?.canRead && (
            <div className="status-table">
              {!aproveAccounting && (
                <div className="status-row" style={{ backgroundColor: 'yellow' }}>
                  Awaiting accounting approval
                </div>
              )}
              {status_list.map((item) => (
                <div key={item.accessor} className="status-row">
                  <div className="header">{item.Header}</div>
                  <input
                    id={item.accessor}
                    type="checkbox"
                    checked={item.accessor === orderCartData?.status}
                    onChange={() => {
                      statusChangeHandler(item);
                    }}
                    disabled={
                      !orderStatusAccess?.canWrite ||
                      item?.accessor == 7 ||
                      item?.accessor == 9
                    } //
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
});
export default OrderCart;
