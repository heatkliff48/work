import React, { useEffect, useMemo, useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
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
import AddProductOrderModal from './AddProductOrderModal.jsx';
import PrintContent from './PrintOrder.jsx'; // Импортируем созданный компонент

const OrderCart = React.memo(() => {
  const {
    orderCartData,
    setOrderCartData,
    setNewOrder,
    getCurrentOrderInfoHandler,
    list_of_orders,
    productModalOrder,
    setProductModalOrder,
  } = useOrderContext();
  const { displayNames } = useProjectContext();

  const productListOrder = useSelector((state) => state.productsOfOrders);
  const products = useSelector((state) => state.products);

  const [vatValue, setVatValue] = useState({
    vat_procent: 21,
    vat_euro: 0,
    vat_result: 0,
  });

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
    [productListOrder]
  );

  const updatedProductListOrder = useMemo(() => {
    return addProductArticleToOrderList(productListOrder, products);
  }, [productListOrder]);

  const handleInputChange = (e) => {
    setVatValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    const final_price_product = updatedProductListOrder.reduce(
      (acc, el) => acc + el.final_price,
      0
    );
    if (!final_price_product || !vatValue.vat_procent) {
      setVatValue((prev) => ({
        ...prev,
        vat_result: 0,
      }));
    } else {
      const vat_euro = (vatValue.vat_procent * final_price_product) / 100;
      const vat_result = (final_price_product + vat_euro).toFixed(2);
      setVatValue((prev) => ({
        ...prev,
        vat_result,
        vat_euro,
      }));
    }
  }, [updatedProductListOrder, vatValue.vat_procent]);

  useEffect(() => {
    if (Object.keys(orderCartData).length === 0) {
      const storedData = JSON.parse(localStorage.getItem('orderCartData'));
      if (storedData) setOrderCartData(storedData);
    }
  }, [orderCartData, setOrderCartData]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('orderCartData'));
    if (storedData) {
      setOrderCartData(storedData);
    }
    console.log('storedData', storedData);
    localStorage.setItem('orderCartData', JSON.stringify(storedData));
  }, []);

  // const printOrder = useCallback(() => {
  //   const printWindow = window.open('', '', 'width=800,height=600');
  //   printWindow.document.write(
  //     '<html><head><title>Print Order</title></head><body><div id="print-root"></div></body></html>'
  //   );
  //   printWindow.document.close();

  //   printWindow.onload = () => {
  //     console.log('onload');
  //     const root = ReactDOM.createRoot(
  //       printWindow.document.getElementById('print-root')
  //     );
  //     console.log('root', root);
  //     root.render(
  //       <PrintContent
  //         orderCartData={orderCartData}
  //         updatedProductListOrder={updatedProductListOrder}
  //         displayNames={displayNames}
  //         filterKeys={filterKeys}
  //       />
  //     );
  //   };
  // }, [orderCartData, updatedProductListOrder, displayNames, filterKeys]);

  return (
    <>
      {productModalOrder && (
        <AddProductOrderModal
          isOpen={productModalOrder}
          toggle={() => setProductModalOrder(!productModalOrder)}
        />
      )}
      <div className="page-container">
        {/* <Button onClick={printOrder}>PDF</Button> */}
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
            <tr>Products</tr>
          </thead>
          <tbody>
            {updatedProductListOrder?.map((product) => (
              <tr key={product?.id} className="product-row">
                <td>
                  {filterAndMapData(product, filterKeys)}
                  <Button
                    onClick={() => {
                      dispatch(getDeleteProductOfOrder(product?.id));
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
                setProductModalOrder(!productModalOrder);
              }}
            >
              Add product
            </Button>
          </tbody>
        </table>
        <div className="vat_container">
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
              />
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
    </>
  );
});
export default OrderCart;
