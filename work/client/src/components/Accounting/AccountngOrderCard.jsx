import React, { useEffect, useMemo, useCallback, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useProjectContext } from '#components/contexts/Context.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { updAccountingDataList } from '#components/redux/actions/ordersAction.js';
import { useDispatch, useSelector } from 'react-redux';
import { useProductsTypeJournalContext } from '#components/contexts/ProductsTypeJournalContext.js';

const AccountngOrderCard = React.memo(() => {
  const {
    storedData,
    setStoredData,
    orderCartData,
    list_of_orders,
    setOrderCartData,
    getAccountingStatus,
    accountingStatusList,
    dryMixedProductsOfOrders,
    anchorProductsOfOrders,
    toolProductsOfOrders,
  } = useOrderContext();
  const { displayNames } = useProjectContext();
  const { latestProducts } = useProductsContext();
  const { latestDryMix, latestRelatedMaterials, latestAnchors, latestTools } =
    useProductsTypeJournalContext();
  const productListOrder = useSelector((state) => state.productsOfOrders);
  const dispatch = useDispatch();

  const [vatValue, setVatValue] = useState({
    vat_procent: 21,
    vat_euro: 0,
    vat_result: 0,
  });

  const [status, setStatus] = useState();

  const filterKeys = useMemo(
    () => ['id', 'order_id', 'client_id', 'product_id', 'createdAt', 'updatedAt'],
    []
  );

  const [productLists, setProductLists] = useState({
    products: [],
    dryMixes: [],
    anchors: [],
    tools: [],
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

      default:
        break;
    }
  };

  const filterAndMapData = useCallback(
    (data, filterKeys) =>
      Object.entries(data || {})
        .filter(([key]) => !filterKeys.includes(key))
        .map(([key, value]) => {
          if (!key || key == 'warehouse_id') return <></>;
          return (
            <div className="data-text" key={key}>
              <p>
                {displayNames[key] || key}: {value}
              </p>
            </div>
          );
        }),
    [orderCartData]
  );

  const addProductArticleToOrderList = useCallback(
    (productsOfOrders, productsTable, arrayName) => {
      if (!productsOfOrders || !productsTable || !arrayName || !orderCartData?.id)
        return [];

      console.log('productsOfOrders', productsOfOrders);
      console.log('productsTable', productsTable);

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
      productListOrder,
      latestProducts,
      'products'
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
    console.log('dryMixedProductsOfOrders', dryMixedProductsOfOrders);
    console.log('latestDryMix', latestDryMix);
    return addProductArticleToOrderList(
      dryMixedProductsOfOrders,
      latestDryMix,
      'dryMixes'
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

  const statusChangeHandler = (newStatus) => {
    const status_index = accountingStatusList.findIndex(
      (el) => el.accessor == status
    );

    const new_status_index = accountingStatusList.findIndex(
      (el) => el.accessor == newStatus
    );

    if (new_status_index < status_index || new_status_index - status_index != 1) {
      alert('Choose another status');
      return;
    }

    dispatch(
      updAccountingDataList({
        orders_article: orderCartData?.article,
        aproved: true,
      })
    );
    setStoredData(null);
  };

  useEffect(() => {
    const updatedOrderCartData = list_of_orders.find(
      (order) => order.article === storedData.orders_article
    );

    const accounting_status = getAccountingStatus(updatedOrderCartData?.status);

    setOrderCartData((prev) => ({ ...prev, status: accounting_status }));
  }, []);

  useEffect(() => {
    const allProducts = [
      ...productLists['products'],
      ...productLists['dryMixes'],
      ...productLists['anchors'],
      ...productLists['tools'],
    ];

    // Считаем финальную цену для всех продуктов
    const final_price_product =
      allProducts.reduce(
        (acc, el) =>
          acc +
          (el?.final_price ||
            el?.final_price_dry ||
            el?.final_price_anchor ||
            el?.final_price_tool),
        0
      ) || 0;

    if (!final_price_product || !vatValue.vat_procent) {
      setVatValue((prev) => ({
        ...prev,
        vat_result: 0,
      }));
    } else {
      const vat_euro = ((vatValue.vat_procent * final_price_product) / 100).toFixed(
        2
      );

      const vat_result = Number(final_price_product + Number(vat_euro)).toFixed(2);

      setVatValue((prev) => ({
        ...prev,
        vat_euro_origin: final_price_product,
        vat_result: vat_result,
        vat_euro,
      }));
    }
  }, [productLists, vatValue.vat_procent]);

  useEffect(() => {
    const result = getAccountingStatus(orderCartData?.status);
    setStatus(result);
  }, []);

  return (
    <>
      <div className="page-container">
        <h4>Order Card: {orderCartData?.article}</h4>

        <div className="header-container">
          <div className="owner-info">
            <h4>Client Information</h4>
            {filterAndMapData(orderCartData?.owner, filterKeys)}
          </div>

          <div className="contact-info">
            <div className="contact-text">
              <h4>Contact Person</h4>
              {filterAndMapData(orderCartData?.contactInfo, filterKeys)}
            </div>
          </div>

          <div className="delivery-address">
            <h4>Delivery Address</h4>
            {filterAndMapData(orderCartData?.deliveryAddress, filterKeys)}
          </div>
        </div>
        <table className="product-table">
          <thead>
            <tr>
              <td>Products</td>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(updatedProductListOrder) &&
              updatedProductListOrder?.map((product) => (
                <tr key={product?.id || Math.random()} className="product-row">
                  <td>{filterAndMapData(product, filterKeys)}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <table className="dry-mixes-table">
          <thead>
            <tr>
              <td>Dry Mixes</td>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(updatedDryMixesListOrder) &&
              updatedDryMixesListOrder?.map((product) => (
                <tr key={product?.id || Math.random()} className="product-row">
                  <td>{filterAndMapData(product, filterKeys)}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <table className="anchors-table">
          <thead>
            <tr>
              <td>Fastners</td>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(updatedAnchorsListOrder) &&
              updatedAnchorsListOrder?.map((product) => (
                <tr key={product?.id || Math.random()} className="product-row">
                  <td>{filterAndMapData(product, filterKeys)}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <table className="tools-table">
          <thead>
            <tr>
              <td>Tools</td>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(updatedToolsListOrder) &&
              updatedToolsListOrder?.map((product) => (
                <tr key={product?.id || Math.random()} className="product-row">
                  <td>{filterAndMapData(product, filterKeys)}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="footer_data">
          <div className="vat_container">
            <div className="vat">
              <div className="vat_procent">
                <div>
                  <p>VAT, %</p>
                  <p>{vatValue.vat_procent}</p>
                </div>
              </div>
              <div className="vat_euro">
                <div>
                  <p>VAT, EURO</p>
                  <p>{vatValue.vat_euro}</p>
                </div>
              </div>
              <div className="vat_result">
                <p>Result</p>
                <p>{vatValue.vat_result}</p>
              </div>
            </div>
          </div>
          <div className="status-table">
            {accountingStatusList.map((item) => (
              <div key={item.accessor} className="status-row">
                {/* {console.log('item.accessor', item.accessor)}
                {console.log('status', status)} */}
                <div className="header">{item.Header}</div>
                <input
                  id={item.accessor}
                  type="checkbox"
                  checked={item.accessor == status}
                  onChange={() => {
                    statusChangeHandler(item.accessor);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
});
export default AccountngOrderCard;
