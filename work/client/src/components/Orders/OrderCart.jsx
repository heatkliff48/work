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
  updateOrderStatus,
} from '#components/redux/actions/ordersAction.js';
import ShowOrderDeliveryEditModal from './modal/OrderCartDeliveryEditModal.jsx';
import ShowOrderContactEditModal from './modal/OrderCartContactEditModal.jsx';
import AddProductOrderModal from './modal/AddProductOrderModal.jsx';
import OrderProductCardInfoModal from './modal/OrderProductCardInfoModal.jsx';
// import { BiCycling } from 'react-icons/bi';
// import PrintContent from './PrintContent.jsx'; // Импортируем созданный компонент

const OrderCart = React.memo(() => {
  const {
    orderCartData,
    setOrderCartData,
    setNewOrder,
    status_list,
    list_of_orders,
    productModalOrder,
    setProductModalOrder,
    setProductOfOrder,
    setSelectedProduct,
    productInfoModalOrder,
    setProductInfoModalOrder,
  } = useOrderContext();
  const { displayNames } = useProjectContext();
  const { latestProducts } = useProjectContext();

  const productListOrder = useSelector((state) => state.productsOfOrders);

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
    (productListOrder, latestProducts) => {
      return productListOrder?.map((orderProduct) => {
        const product = latestProducts?.find(
          (p) => p.id === orderProduct?.product_id
        );
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
    return addProductArticleToOrderList(productListOrder, latestProducts);
  }, [productListOrder]);

  const handleInputChange = (e) => {
    setVatValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onProductClickHandler = (sel_prod) => {
    const product = latestProducts.find(
      (el) => el.article === sel_prod.product_article
    );
    setSelectedProduct(product);
    setProductOfOrder({ ...sel_prod, product_id: product?.id });
    setProductInfoModalOrder(!productInfoModalOrder);
  };

  useEffect(() => {
    const final_price_product =
      updatedProductListOrder.reduce((acc, el) => acc + el?.final_price, 0) || 0;

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
    const storedData = JSON.parse(localStorage.getItem('orderCartData'));

    const updatedOrderCartData = list_of_orders.find(
      (order) => order.id === storedData.id
    );

    if (storedData) {
      setOrderCartData(storedData);
    }

    if (updatedOrderCartData && updatedOrderCartData !== orderCartData) {
      setOrderCartData((prev) => ({ ...prev, status: updatedOrderCartData.status }));
    }

    localStorage.setItem('orderCartData', JSON.stringify(storedData));
  }, [list_of_orders]);

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
      {productInfoModalOrder && (
        <OrderProductCardInfoModal
          isOpen={productInfoModalOrder}
          toggle={() => setProductInfoModalOrder(!productInfoModalOrder)}
        />
      )}
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
                <td
                  onClick={() => {
                    onProductClickHandler(product);
                  }}
                >
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
        <div className="footer_data">
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
          <div className="status-table">
            {status_list.map((item) => (
              <div key={item.accessor} className="status-row">
                <div className="header">{item.Header}</div>
                <input
                  type="checkbox"
                  checked={item.accessor === orderCartData?.status}
                  onChange={() =>
                    dispatch(
                      updateOrderStatus({
                        order_id: orderCartData?.id,
                        status: item.accessor,
                      })
                    )
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
});
export default OrderCart;
