import React, { useEffect, useMemo, useCallback, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
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
  updateOrderInCharge,
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
import DownloadOrderPDF from './OrdersPDF.jsx';
import ListOfReservedProductsModal from '#components/Warehouse/ListOfReservedProducts/ListOfReservedProductsModal.jsx';
import FilesMain from '#components/FileUpload/Order/FilesMain.jsx';
import Select from 'react-select';

const OrderCart = React.memo(() => {
  const {
    orderCartData,
    setOrderCartData,
    setNewOrder,
    status_list,
    list_of_orders,
    setSelectedProduct,
    setProductOfOrder,
    personsInChargeList,
  } = useOrderContext();
  const {
    productModalOrder,
    setProductModalOrder,
    productInfoModalOrder,
    setProductInfoModalOrder,
    warehouseInfoModal,
    setWarehouseInfoModal,
    setWarehouseInfoCurIdModal,
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
  const [ordersStatus, setOrdersStatus] = useState([]);
  const [vatValue, setVatValue] = useState({
    vat_procent: 21,
    vat_euro: 0,
    vat_result: 0,
  });
  const [orderStatusAccess, setOrderStatusAccess] = useState({
    canRead: true,
    canWrite: false,
  });
  const [deleteOrderAccess, setDeleteOrderAccess] = useState({
    canRead: true,
    canWrite: false,
  });
  const [selectedPersonInCharge, setSelectedPersonInCharge] = useState();

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
          if (!key || key == 'warehouse_id') return;
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
    const currentStatus = ordersStatus[ordersStatus.length - 1];
    // const currentIndex = status_list.findIndex((s) => s.accessor === currentStatus);
    // const newIndex = status_list.findIndex((s) => s.accessor === status.accessor);

    if (status.accessor < orderCartData?.status) {
      return alert('This status cannot be set');
    }

    if (status.accessor > orderCartData?.status + 1) {
      return alert('This status cannot be set');
    }

    // if (ordersStatus.includes(status.accessor)) {
    //   return alert('This status cannot be set');
    // }

    const order_id = orderCartData?.id;
    const hasShippingDate =
      orderCartData?.shipping_date?.length > 0
        ? orderCartData?.shipping_date
        : formatDataValue;

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

    updatedProductListOrder.forEach((product) => {
      const loc = latestProducts.find(
        (el) => el.id == product.product_id
      )?.placeOfProduction;
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
    });

    // Добавляем новый статус в массив
    setOrdersStatus((prev) => [...prev, status.accessor]);

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
    const storedData = localStorage.getItem('orderCartData')
      ? JSON.parse(localStorage.getItem('orderCartData'))
      : null;

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

    if (!ordersStatus.includes(updatedOrderCartData.status))
      setOrdersStatus((prev) => [...prev, updatedOrderCartData.status]);

    localStorage.setItem('orderCartData', JSON.stringify(storedData));
  }, [list_of_orders]);

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Orders');
      setUserAccess(access);

      const statusAccess = checkUserAccess(user, roles, 'Orders_status');
      setOrderStatusAccess(statusAccess);

      const deleteAccess = checkUserAccess(user, roles, 'Del_orders');
      setDeleteOrderAccess(deleteAccess);

      if (!access?.canRead) {
        navigate('/');
      }
    }
  }, [user, roles]);

  const handleSelectChange = (selectedOption) => {
    setSelectedPersonInCharge((prev) => ({
      ...prev,
      person_in_charge: selectedOption.value,
    }));
    const order_id = orderCartData?.id;
    dispatch(
      updateOrderInCharge({
        order_id,
        person_in_charge: selectedOption.value,
      })
    );
  };

  const getSelectedOption = (accessor) => {
    const options = personsInChargeList;
    if (!options) return null;
    console.log('orderCartData', orderCartData);
    const personInChargeOption = options.find(
      (option) => option.value === orderCartData?.person_in_charge
    );
    // Если выбранная опция найдена, возвращаем ее, иначе возвращаем первую опцию по умолчанию
    return personInChargeOption || options[0];
  };

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
      {warehouseInfoModal && (
        <ListOfReservedProductsModal
          isOpen={warehouseInfoModal}
          toggle={() => setWarehouseInfoModal(!warehouseInfoModal)}
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
          {deleteOrderAccess?.canWrite && (
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
            {Array.isArray(updatedProductListOrder) &&
              updatedProductListOrder?.map((product) => (
                <tr key={product?.id || Math.random()} className="product-row">
                  <td
                    onClick={() => {
                      onProductClickHandler(product);
                    }}
                  >
                    {filterAndMapData(product, filterKeys)}
                    {product?.warehouse_id !== null ? (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setWarehouseInfoCurIdModal(product?.warehouse_id);
                          setWarehouseInfoModal(!warehouseInfoModal);
                        }}
                      >
                        Show batch
                      </Button>
                    ) : (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteHandler(product);
                        }}
                      >
                        Delete
                      </Button>
                    )}
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
                        owner: orderCartData.owner?.id,
                        status: orderCartData.status,
                        del_adr_id: orderCartData.deliveryAddress?.id,
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
            <div className="person_in_charge">
              <p>Person in charge</p>
              <Select
                defaultValue={getSelectedOption(orderCartData.person_in_charge)}
                onChange={(v) => {
                  handleSelectChange(v);
                }}
                options={personsInChargeList}
              />
            </div>
          </div>
          {orderStatusAccess?.canRead && (
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
                    disabled={!orderStatusAccess?.canWrite}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <FilesMain userAccess={userAccess} />
      {orderCartData &&
        Array.isArray(updatedProductListOrder) &&
        updatedProductListOrder.length > 0 &&
        vatValue && (
          <DownloadOrderPDF
            orderCartData={orderCartData}
            updatedProductListOrder={updatedProductListOrder}
            vatValue={vatValue}
          />
        )}
    </>
  );
});
export default OrderCart;
