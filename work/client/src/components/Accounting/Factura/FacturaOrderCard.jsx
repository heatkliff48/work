import React, { useEffect, useCallback, useState, useMemo } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import FacturaTable from './FacturaTable';
import { Button } from 'reactstrap';
import '#components/Styles/order-card.css';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useProjectContext } from '#components/contexts/Context.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useProductsTypeJournalContext } from '#components/contexts/ProductsTypeJournalContext.js';
import { useDispatch, useSelector } from 'react-redux';
import AccountingInvoiceModal from '../AccountingInvoiceModal';
import { changeStatusWarehouseManagerTrailer } from '#components/redux/actions/warehouseAction.js';
import { useNavigate } from 'react-router-dom';

const FacturaOrderCard = React.memo(() => {
  const { selectedOrder } = useWarehouseContext();
  const {
    orderCartData,
    setOrderCartData,
    list_of_orders,
    dryMixedProductsOfOrders,
    anchorProductsOfOrders,
    toolProductsOfOrders,
    relMatProductsOfOrders,
    filterKeysOrder,
  } = useOrderContext();

  const { latestProducts } = useProductsContext();
  const { latestDryMix, latestRelatedMaterials, latestAnchors, latestTools } =
    useProductsTypeJournalContext();

  const { displayNames } = useProjectContext();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [ordersStatus, setOrdersStatus] = useState([]);
  const [checkboxStatus, setCheckboxStatus] = useState(
    selectedOrder?.trailer_stage || 0,
  );
  const [productLists, setProductLists] = useState({
    products: [],
    dryMixes: [],
    anchors: [],
    tools: [],
    related_materials: [],
  });

  const [vatValue, setVatValue] = useState({
    vat_procent: 21,
    vat_euro: 0,
    vat_result: 0,
  });

  useEffect(() => {
    if (!selectedOrder) navigate('/factura_manager');
  }, []);

  const productListOrder = useSelector((state) => state.productsOfOrders);

  const filterAndMapData = useCallback(
    (data, filterKeysOrder) =>
      Object.entries(data || {})
        .filter(([key]) => !filterKeysOrder.includes(key))
        .map(([key, value]) => {
          if (!key || key === 'warehouse_id') return null;

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

          const product = productsTable.find(
            (p) => p.id === orderProduct?.[id],
          );

          return product
            ? { product_article: product.article, ...orderProduct }
            : { ...orderProduct, product_article: 'Unknown' };
        });

      return updatedOrderProducts;
    },
    [orderCartData?.id],
  );

  const updatedProductListOrder = useMemo(() => {
    return addProductArticleToOrderList(
      productListOrder,
      latestProducts,
      'products',
    );
  }, [productListOrder, latestProducts, addProductArticleToOrderList]);

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
      'dryMixes',
    );
  }, [dryMixedProductsOfOrders, latestDryMix, addProductArticleToOrderList]);

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

  useEffect(() => {
    const allProducts = [
      ...productLists['products'],
      ...productLists['dryMixes'],
      ...productLists['anchors'],
      ...productLists['tools'],
      ...productLists['related_materials'],
    ];

    const final_price_product =
      allProducts.reduce(
        (acc, el) =>
          acc +
          (el?.final_price ||
            el?.final_price_dry ||
            el?.final_price_anchor ||
            el?.final_price_tool ||
            el?.final_price_rel_mat),
        0,
      ) || 0;

    if (!final_price_product || !vatValue.vat_procent) {
      setVatValue((prev) => ({
        ...prev,
        vat_result: 0,
      }));
    } else {
      const vat_euro = (
        (vatValue.vat_procent * final_price_product) /
        100
      ).toFixed(2);

      const vat_result = Number(final_price_product + Number(vat_euro)).toFixed(
        2,
      );

      setVatValue((prev) => ({
        ...prev,
        vat_euro_origin: final_price_product,
        vat_result: vat_result,
        vat_euro,
      }));
    }
  }, [productLists, vatValue.vat_procent]);

  useEffect(() => {
    const storedData = localStorage.getItem('orderCartData')
      ? JSON.parse(localStorage.getItem('orderCartData'))
      : null;

    const updatedOrderCartData = list_of_orders.find(
      (order) => order.id === storedData?.id,
    );

    if (storedData) {
      setOrderCartData(storedData);
      localStorage.setItem('orderCartData', JSON.stringify(storedData));
    }

    if (!ordersStatus.includes(updatedOrderCartData?.status))
      setOrdersStatus((prev) => [...prev, updatedOrderCartData?.status]);
  }, [list_of_orders]);

  const statusChangeHandler = () => {
    const status = !checkboxStatus ? 1 : 0;
    setCheckboxStatus(!checkboxStatus);
    dispatch(
      changeStatusWarehouseManagerTrailer({
        status,
        orderId: orderCartData?.id,
        trailer: selectedOrder.trailer,
      }),
    );
  };

  return (
    <div className="page-container">
      <div className="order-header-row">
        <h4>Order number: {orderCartData?.article}</h4>
      </div>

      <div className="header-container">
        <div className="owner-info">
          <h4>Client Information</h4>
          {filterAndMapData(orderCartData?.owner, filterKeysOrder)}
        </div>

        <div className="contact-info">
          <div className="contact-text">
            <h4>Contact Person</h4>
            {filterAndMapData(orderCartData?.contactInfo, filterKeysOrder)}
          </div>
        </div>

        <div className="delivery-address">
          <h4>Delivery Address</h4>
          {filterAndMapData(orderCartData?.deliveryAddress, filterKeysOrder)}
        </div>

        <div className="status-ready">
          <h4>Status</h4>
          <div className="status-row">
            <div className="header">Ready</div>
            <input
              id="status-ready"
              type="checkbox"
              checked={checkboxStatus}
              onChange={() => statusChangeHandler()}
            />
          </div>
        </div>
      </div>

      <div className="footer_button_pdf">
        <Button color="primary" onClick={() => setIsInvoiceModalOpen(true)}>
          Generar factura PDF
        </Button>
      </div>

      <AccountingInvoiceModal
        isOpen={isInvoiceModalOpen}
        toggle={() => setIsInvoiceModalOpen(false)}
        orderCartData={orderCartData}
        productLists={selectedOrder?.productLists}
        vatValue={selectedOrder?.vatData}
        latestProducts={latestProducts}
        latestDryMix={latestDryMix}
        latestAnchors={latestAnchors}
        latestTools={latestTools}
        latestRelatedMaterials={latestRelatedMaterials}
      />

      <FacturaTable product_list={selectedOrder} orderCartData={orderCartData} />
    </div>
  );
});

export default FacturaOrderCard;
