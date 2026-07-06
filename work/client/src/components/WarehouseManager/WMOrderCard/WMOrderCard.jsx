import React, { useEffect, useMemo, useCallback, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useProjectContext } from '#components/contexts/Context.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import WMOCTable from './WMOCTable/WMOCTable';

import '#components/Styles/order-card.css';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';

const escapeHtml = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (char) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[char],
  );

const WMOrderCard = React.memo(() => {
  const { selectedOrder, wmoctProduct } = useWarehouseContext();
  const { orderCartData, setOrderCartData, list_of_orders, filterKeysOrder } =
    useOrderContext();

  const { displayNames } = useProjectContext();
  const [ordersStatus, setOrdersStatus] = useState([]);

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

  const handlePrintWarehouseSheet = useCallback(() => {
    const printWindow = window.open('', '_blank', 'width=900,height=700');

    if (!printWindow) {
      // eslint-disable-next-line no-alert
      alert('Please allow pop-ups to print the warehouse sheet.');
      return;
    }

    const rows = (wmoctProduct || [])
      .map(
        (product) => `
          <tr>
            <td>${escapeHtml(product.article)}</td>
            <td class="qty-cell">${escapeHtml(product.qty_total)}</td>
            <td class="notes-cell"></td>
            <td class="check-cell"><span class="checkbox"></span></td>
          </tr>`,
      )
      .join('');

    const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Warehouse Sheet - Order ${escapeHtml(orderCartData?.article)}</title>
    <style>
      * { box-sizing: border-box; }
      body {
        font-family: Arial, Helvetica, sans-serif;
        padding: 24px;
        color: #111;
      }
      h1 {
        font-size: 20px;
        margin: 0 0 4px 0;
      }
      .meta {
        font-size: 13px;
        color: #444;
        margin-bottom: 20px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        border: 1px solid #333;
        padding: 10px 8px;
        font-size: 14px;
        text-align: left;
        vertical-align: middle;
      }
      th {
        background: #f0f0f0;
      }
      .qty-cell {
        width: 15%;
        text-align: center;
      }
      .notes-cell {
        width: 35%;
      }
      .check-cell {
        width: 10%;
        text-align: center;
      }
      .checkbox {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 1px solid #333;
      }
      .print-btn {
        margin-top: 20px;
        padding: 8px 16px;
        font-size: 14px;
      }
      @media print {
        .no-print { display: none; }
      }
    </style>
  </head>
  <body>
    <h1>Warehouse Pick / Check Sheet</h1>
    <div class="meta">
      Order: ${escapeHtml(orderCartData?.article)} &nbsp;|&nbsp;
      Date: ${escapeHtml(new Date().toLocaleDateString())}
    </div>
    <table>
      <thead>
        <tr>
          <th>Product article</th>
          <th>Qty total, pallet</th>
          <th>Notes</th>
          <th>&#10003;</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
    <button class="print-btn no-print" onclick="window.print()">Print</button>
  </body>
</html>`;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  }, [wmoctProduct, orderCartData]);

  return (
    <div className="page-container">
      <div className="order-header-row">
        <h4>Order number: {orderCartData?.article}</h4>
        <button
          type="button"
          className="print-warehouse-sheet-btn"
          onClick={handlePrintWarehouseSheet}
        >
          Print
        </button>
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
      </div>

      <WMOCTable product_list={selectedOrder} orderCartData={orderCartData} />
    </div>
  );
});
export default WMOrderCard;
