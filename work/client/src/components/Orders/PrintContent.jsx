// PrintContent.js
import React from 'react';

const PrintContent = ({
  orderCartData,
  updatedProductListOrder,
  displayNames,
  filterKeys,
}) => {
  console.log('PrintContent');
  const filterAndMapData = (data, filterKeys) =>
    Object.entries(data || {})
      .filter(([key]) => !filterKeys.includes(key))
      .map(([key, value]) => {
        if (!key) return null;
        return (
          <div className="data-text" key={key}>
            <p>
              {displayNames[key] || key}: {value}
            </p>
          </div>
        );
      });

  return (
    <div className="page-container">
      <h4>Order Card: {orderCartData?.article}</h4>
      <div className="owner-info">
        <h4>Client Information</h4>
        {filterAndMapData(orderCartData?.owner, filterKeys)}
      </div>
      <div className="contact-info">
        <h4>Contact Person</h4>
        {filterAndMapData(orderCartData?.contactInfo, filterKeys)}
      </div>
      <div className="delivery-address">
        <h4>Delivery Address</h4>
        {filterAndMapData(orderCartData?.deliveryAddress, filterKeys)}
      </div>
      <table className="product-table">
        <thead>
          <tr>Products</tr>
        </thead>
        <tbody>
          {updatedProductListOrder?.map((product) => (
            <tr key={product?.id} className="product-row">
              <td>{filterAndMapData(product, filterKeys)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrintContent;
