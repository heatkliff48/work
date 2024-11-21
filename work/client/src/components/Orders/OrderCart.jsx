import React, { useEffect, useMemo, useCallback, useState, useRef } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { useReactToPrint } from 'react-to-print';
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
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  PDFDownloadLink,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 15,
    padding: 10,
    border: '1 solid #ccc',
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    flexGrow: 1,
    padding: 5,
    borderRight: '1 solid #ccc',
    borderBottom: '1 solid #ccc',
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
  },
  input: {
    fontSize: 12,
    padding: 5,
    border: '1 solid #ccc',
  },
});

const OrderPDF = ({ orderData, productList, vatValue }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Заголовок заказа */}
      <View style={styles.section}>
        <Text style={styles.header}>Order Card: {orderData?.article || 'N/A'}</Text>
      </View>

      {/* Клиентская информация */}
      <View
        style={[
          styles.section,
          { flexDirection: 'row', justifyContent: 'space-between' },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.header}>Client Information</Text>
          {Object.entries(orderData?.owner || {}).map(([key, value]) => {
            if (key === 'id') return <></>;
            return <Text key={key}>{`${key}: ${value}`}</Text>;
          })}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.header}>Contact Person</Text>
          {Object.entries(orderData?.contactInfo || {}).map(([key, value]) => {
            if (key === 'id') return <></>;
            return <Text key={key}>{`${key}: ${value}`}</Text>;
          })}
        </View>
      </View>

      {/* Адрес доставки */}
      <View style={styles.section}>
        <Text style={styles.header}>Delivery Address</Text>
        {Object.entries(orderData?.deliveryAddress || {}).map(([key, value]) => {
          if (key === 'id') return <></>;
          return <Text key={key}>{`${key}: ${value}`}</Text>;
        })}
      </View>

      {/* Таблица продуктов */}
      <View style={[styles.section, styles.table]}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Product</Text>
          <Text style={styles.tableCell}>Quantity</Text>
          <Text style={styles.tableCell}>Price</Text>
        </View>
        {productList.length > 0 ? (
          productList.map((product, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCell}>{product?.product_article || 'N/A'}</Text>
              <Text style={styles.tableCell}>
                {product?.quantity_palet || 'N/A'}
              </Text>
              <Text style={styles.tableCell}>{product?.final_price || 'N/A'}</Text>
            </View>
          ))
        ) : (
          <Text>No products available</Text>
        )}
      </View>

      {/* Данные VAT */}
      <View style={styles.section}>
        <Text style={styles.header}>VAT Information</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text>VAT, %: {vatValue?.vat_procent || 'N/A'}</Text>
          </View>
          <View>
            <Text>VAT, EURO: {vatValue?.vat_euro || 'N/A'}</Text>
          </View>
          <View>
            <Text>Result: {vatValue?.vat_result || 'N/A'}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

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

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const productListOrder = useSelector((state) => state.productsOfOrders);

  const [dataValue, setDataValue] = useState(new Date());
  const [formatDataValue, setFormatDataValue] = useState(null);
  const [vatValue, setVatValue] = useState({
    vat_procent: 21,
    vat_euro: 0,
    vat_result: 0,
  });
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
            quantity: product?.quantity_palet,
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
            quantity: product?.quantity_palet,
            status: ordered_production_oem_status[0].accessor,
          })
        );
      }
      return;
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

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Orders');
      setUserAccess(access);

      const statusAccess = checkUserAccess(user, roles, 'Orders_status');
      setOrderStatusAccess(statusAccess);

      if (!access?.canRead) {
        navigate('/');
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
            <tr>
              <td>Products</td>
            </tr>
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
              <tr>
                <td colSpan="100%">
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
                </td>
              </tr>
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
                  id="data_pcker"
                  type="text"
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
                  id={item.accessor}
                  type="checkbox"
                  checked={item.accessor === orderCartData?.status}
                  onChange={() => {
                    statusChangeHandler(item);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <PDFDownloadLink
        document={
          <OrderPDF
            orderData={orderCartData}
            productList={updatedProductListOrder}
            vatValue={vatValue}
          />
        }
        fileName={`order-${orderCartData?.article || 'N/A'}.pdf`}
        className="pdf_button"
      >
        {({ blob, url, loading, error }) =>
          loading ? 'Loading document...' : 'Download PDF'
        }
      </PDFDownloadLink>

      <PDFViewer style={{ width: '100%', height: '500px' }}>
        <OrderPDF
          orderData={orderCartData}
          productList={updatedProductListOrder || []}
          vatValue={vatValue}
        />
      </PDFViewer>
    </>
  );
});
export default OrderCart;
