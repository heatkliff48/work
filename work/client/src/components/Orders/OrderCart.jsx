import React, { useEffect, useMemo, useCallback } from 'react';
import { Button } from 'reactstrap';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useProjectContext } from '#components/contexts/Context.js';
import {
  deleteOrder,
  getDeleteProductOfOrder,
} from '#components/redux/actions/ordersAction.js';
import ShowOrderDeliveryEditModal from './OrderCartDeliveryEditModal.jsx';
import ShowOrderContactEditModal from './OrderCartContactEditModal.jsx';

const OrderCart = React.memo(() => {
  const { orderCartData, setOrderCartData, setNewOrder } = useOrderContext();
  const { displayNames } = useProjectContext();
  const productListOrder = useSelector((state) => state.productsOfOrders);
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const filterKeys = useMemo(
    () => ['id', 'order_id', 'client_id', 'product_id', 'createdAt', 'updatedAt'],
    []
  );

  const filterAndMapData = useCallback(
    (data, filterKeys) =>
      Object.entries(data || {})
        .filter(([key]) => !filterKeys.includes(key))
        .map(([key, value]) => {
          if (!key) return;
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
    (productListOrder, products) => {
      return productListOrder?.map((orderProduct) => {
        const product = products?.find((p) => p.id === orderProduct?.product_id);
        if (product) {
          return {
            product_article: product.article,
            ...orderProduct,
          };
        }
        return orderProduct;
      });
    },
    [productListOrder, products]
  );

  const updatedProductListOrder = addProductArticleToOrderList(
    productListOrder,
    products
  );

  useEffect(() => {
    if (Object.keys(orderCartData).length === 0) {
      const storedData = JSON.parse(localStorage.getItem('orderCartData'));
      if (storedData) setOrderCartData(storedData);
    }
  }, [orderCartData, setOrderCartData]);

  return (
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
            {filterAndMapData(orderCartData?.owner, filterKeys)}
          </div>
          <ShowOrderContactEditModal />
        </div>
        <Button
          onClick={() => {
            dispatch(deleteOrder(orderCartData?.id));
            navigate('/orders');
          }}
        >
          Delete Order
        </Button>
      </div>
      <div className="delivery-address">
        <h4>Delivery Address</h4>
        {filterAndMapData(orderCartData?.deliveryAddress, filterKeys)}
        <ShowOrderDeliveryEditModal />
      </div>
      <table className="product-table">
        <thead>
          <tr>{/* Render table headers */}</tr>
        </thead>
        <tbody>
          {updatedProductListOrder?.map((product) => (
            <tr key={product.id} className="product-row">
              <td>
                {filterAndMapData(product, filterKeys)}
                <Button
                  onClick={() => {
                    dispatch(getDeleteProductOfOrder(product.id));
                  }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
          <Button
            onClick={() => {
              setNewOrder((prev) => ({
                ...prev,
                article: orderCartData.article,
                owner: orderCartData.owner.id,
                status: orderCartData.status,
                del_adr_id: orderCartData.deliveryAddress.id,
              }));
              navigate('/addProductOrder');
            }}
          >
            Add product
          </Button>
        </tbody>
      </table>
    </div>
  );
});

export default OrderCart;
