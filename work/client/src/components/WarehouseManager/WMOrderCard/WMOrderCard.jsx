import React, { useEffect, useMemo, useCallback, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useProjectContext } from '#components/contexts/Context.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import WMOCTable from './WMOCTable/WMOCTable';

import '#components/Styles/order-card.css';

const WMOrderCard = React.memo(({ selectedOrder }) => {
  const { orderCartData, setOrderCartData, list_of_orders } = useOrderContext();

  const { displayNames } = useProjectContext();
  const [ordersStatus, setOrdersStatus] = useState([]);

  const filterKeys = useMemo(
    () => [
      'id',
      'order_id',
      'client_id',
      'product_id',
      'createdAt',
      'updatedAt',
      'bitrix_id',
      'bitrix_client_id',
    ],
    [],
  );

  const filterAndMapData = useCallback(
    (data, filterKeys) =>
      Object.entries(data || {})
        .filter(([key]) => !filterKeys.includes(key))
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

  return (
    <div className="page-container">
      <h4>Order number: {orderCartData?.article}</h4>

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

      <WMOCTable product_list={selectedOrder} orderCartData={orderCartData} />
    </div>
  );
});
export default WMOrderCard;
