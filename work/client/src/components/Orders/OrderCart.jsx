import React, { useEffect, useMemo, useCallback, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
// import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useProjectContext } from '#components/contexts/Context.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import {
  addDataShipOrder,
  deleteOrder,
  getDeleteProductOfOrder,
  updateOrderStatus,
} from '#components/redux/actions/ordersAction.js';
import {
  addNewListOfOrderedProduction,
  addNewListOfOrderedProductionOEM,
} from '#components/redux/actions/warehouseAction.js';
import ShowOrderDeliveryEditModal from './modal/OrderCartDeliveryEditModal.jsx';
import ShowOrderContactEditModal from './modal/OrderCartContactEditModal.jsx';
import AddProductOrderModal from './modal/AddProductOrderModal.jsx';
import OrderProductCardInfoModal from './modal/OrderProductCardInfoModal.jsx';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { BiCycling } from 'react-icons/bi';
// import { BiCycling } from 'react-icons/bi';
// import PrintContent from './PrintContent.jsx'; // Импортируем созданный компонент

const OrderCart = React.memo(() => {
  const {
    orderCartData,
    setOrderCartData,
    setNewOrder,
    status_list,
    list_of_orders,
    setSelectedProduct,
    setProductOfOrder,
  } = useOrderContext();
  const {
    productModalOrder,
    setProductModalOrder,
    productInfoModalOrder,
    setProductInfoModalOrder,
  } = useModalContext();
  const { displayNames } = useProjectContext();
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();

  const { latestProducts } = useProductsContext();

  const { list_of_reserved_products, ordered_production_oem_status } =
    useWarehouseContext();

  const productListOrder = useSelector((state) => state.productsOfOrders);

  const [dataValue, setDataValue] = useState(new Date());
  const [formatDataValue, setFormatDataValue] = useState(null);
  const [vatValue, setVatValue] = useState({
    vat_procent: 21,
    vat_euro: 0,
    vat_result: 0,
  });

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [orderStatusAccess, setOrderStatusAccess] = useState({
    canRead: true,
    canWrite: false,
  });

  const filterKeys = useMemo(
    () => ['id', 'order_id', 'client_id', 'product_id', 'createdAt', 'updatedAt'],
    []
  );

  const haveShipDate = useMemo(() => {
    return orderCartData?.shipping_date ?? false;
  }, [orderCartData]);

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

  const handleDateChange = useCallback(
    (date) => {
      const currentDate = new Date();
      if (date < currentDate) {
        alert('Выбранная дата не может быть меньше текущей даты');
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

  const handleDayBeforShipping = useCallback(() => {
    const currentDate = new Date();
    const shippingDateString = orderCartData?.shipping_date;

    // Преобразование строки в формате "23.08.2024" в объект Date
    const shippingDate = new Date(shippingDateString.split('.').reverse().join('-'));

    const timeDiff = shippingDate.getTime() - currentDate.getTime();
    const daysUntil = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysUntil;
  }, [orderCartData?.shipping_date]);

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

  const statusChangeHandler = (status) => {
    const order_id = orderCartData?.id;
    const hasShippingDate = orderCartData?.shipping_date ?? formatDataValue;

    if (status.accessor !== status_list[0].accessor && !hasShippingDate) {
      alert('Пожалуйста, выберите дату отправки');
      return;
    } else if (status.accessor === status_list[1].accessor) {
      dispatch(
        addDataShipOrder({
          order_id,
          shipping_date: formatDataValue,
        })
      );
    }

    updatedProductListOrder.map((product) => {
      const loc = latestProducts.find((el) => {
        return el.id == product.product_id;
      })?.placeOfProduction;

      const haveProductReserve = list_of_reserved_products.find(
        (el) => el.orders_products_id == product.id
      );

      if (
        status.accessor === status_list[2].accessor &&
        loc === 'Spain' &&
        !haveProductReserve
      ) {
        dispatch(
          addNewListOfOrderedProduction({
            shipping_date: orderCartData?.shipping_date,
            product_article: product?.product_article,
            order_article: orderCartData?.article,
            quantity: product?.quantity_real,
          })
        );
      } else if (
        status.accessor === status_list[2].accessor &&
        !haveProductReserve
      ) {
        dispatch(
          addNewListOfOrderedProductionOEM({
            shipping_date: orderCartData?.shipping_date,
            product_article: product?.product_article,
            order_article: orderCartData?.article,
            quantity: product?.quantity_real,
            status: ordered_production_oem_status[0].accessor,
          })
        );
      }
    });

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
    dispatch(getDeleteProductOfOrder(product?.id));
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

      const vat_result = final_price_product + vat_euro;
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

    if (!storedData?.shipping_date && updatedOrderCartData?.shipping_date) {
      setOrderCartData((prev) => ({
        ...prev,
        shipping_date: updatedOrderCartData.shipping_date,
      }));
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

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Orders');
      setUserAccess(access);

      const statusAccess = checkUserAccess(user, roles, 'Orders_status');
      setOrderStatusAccess(statusAccess);

      if (!access?.canRead) {
        navigate('/'); // Перенаправление на главную страницу, если нет прав на чтение
      }
    }
  }, [user, roles]);

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
            {userAccess?.canWrite && <ShowOrderContactEditModal />}
          </div>
          {userAccess?.canWrite && (
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
        <div className="delivery-address">
          <h4>Delivery Address</h4>
          {filterAndMapData(orderCartData?.deliveryAddress, filterKeys)}
          {userAccess?.canWrite && <ShowOrderDeliveryEditModal />}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteHandler(product);
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {userAccess?.canWrite && (
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
            )}
          </tbody>
        </table>
        <div className="footer_data">
          <div className="vat_container">
            <div className="vat">
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
            <div className="shipping_date">
              {haveShipDate ? (
                <p>
                  Дата отправки: {haveShipDate} ({handleDayBeforShipping()} дней до
                  отправки)
                </p>
              ) : (
                <DatePicker
                  selected={dataValue}
                  onChange={(date) => handleDateChange(date)}
                  dateFormat="dd.MM.yyyy"
                />
              )}
            </div>
          </div>
          <div className="status-table">
            {status_list.map((item) => (
              <div key={item.accessor} className="status-row">
                <div className="header">{item.Header}</div>
                <input
                  type="checkbox"
                  checked={item.accessor === orderCartData?.status}
                  onClick={() => {
                    statusChangeHandler(item);
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
export default OrderCart;
