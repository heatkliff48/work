import React, { useEffect, useMemo, useCallback, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useProjectContext } from '#components/contexts/Context.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { updAccountingDataList } from '#components/redux/actions/ordersAction.js';
import { useDispatch, useSelector } from 'react-redux';

const AccountngOrderCard = React.memo(() => {
  const {
    storedData,
    setStoredData,
    orderCartData,
    list_of_orders,
    setOrderCartData,
    getAccountingStatus,
    accountingStatusList,
  } = useOrderContext();
  const { displayNames } = useProjectContext();
  const { latestProducts } = useProductsContext();
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
    (productListOrder, latestProducts) => {
      if (!productListOrder || !latestProducts) return [];

      return productListOrder.map((orderProduct) => {
        const product = latestProducts.find(
          (p) => p.id === orderProduct?.product_id
        );

        if (product) {
          return {
            product_article: product.article,
            ...orderProduct,
          };
        }
        return { ...orderProduct, product_article: 'Unknown' };
      });
    },
    [productListOrder]
  );

  const updatedProductListOrder = useMemo(() => {
    return addProductArticleToOrderList(productListOrder, latestProducts);
  }, [productListOrder]);

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
    const final_price_product =
      updatedProductListOrder.reduce((acc, el) => acc + el?.final_price, 0) || 0;

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
        vat_result: vat_result,
        vat_euro,
      }));
    }
  }, []);

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
