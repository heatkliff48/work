import React, { useEffect } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useDispatch, useSelector } from 'react-redux';

const OrderCartModal = React.memo(() => {
  const { orderModal, setOrderModal, orderCartData, COLUMNS_ORDER_PRODUCT } =
    useOrderContext();
  // const dispatch = useDispatch();
  const productListOrder = useSelector((state) => state.produstsOfOrders);

  const displayNames = {
    quantity_m2: 'Quantity, m2',
    quantity_palet: 'Quantity of palet',
    quantity_real: 'Real quantity',
    price_m2: 'Price, m2',
    discount: 'Discount, %',
    final_price: 'Final price',
    c_name: 'Name of owner',
    tin: 'TIN',
    category: 'Category',
    street: 'Street',
    additional_info: 'Additional info',
    city: 'City',
    zip_code: 'Zip code',
    province: 'Province',
    country: 'Country',
    phone_number: 'Phone number',
    email: 'E-mail',
  };

  console.log('productListOrder', productListOrder);
  return (
    <div>
      <Modal isOpen={orderModal} toggle={() => setOrderModal(!orderModal)} size="lg">
        <ModalHeader toggle={() => setOrderModal(!orderModal)}>
          Order Card: {orderCartData.article}
        </ModalHeader>

        <ModalBody className="item">
          <div className="order-info-container">
            <div className="client-info">
              <h4>Client Information</h4>
              {Object.entries(orderCartData.owner || {})
                .filter(
                  ([key]) =>
                    ![
                      'id',
                      'order_id',
                      'product_id',
                      'createdAt',
                      'updatedAt',
                    ].includes(key)
                )
                .map(([key, value]) => (
                  <p key={key}>
                    {displayNames[key] || key}: {value}
                  </p>
                ))}
            </div>

            <div className="delivery-info">
              <h4>Delivery Address</h4>
              {Object.entries(orderCartData.deliveryAddress || {})
                .filter(
                  ([key]) =>
                    ![
                      'id',
                      'client_id',
                      'product_id',
                      'createdAt',
                      'updatedAt',
                    ].includes(key)
                )
                .map(([key, value]) => (
                  <p key={key}>
                    {displayNames[key] || key}: {value}
                  </p>
                ))}
            </div>
          </div>

          <div>
            <h4>Products info</h4>
            {productListOrder.map((product) => (
              <div className="product-info" key={product.id}>
                {Object.entries(product || {})
                  .filter(
                    ([key]) =>
                      ![
                        'id',
                        'order_id',
                        'product_id',
                        'createdAt',
                        'updatedAt',
                      ].includes(key)
                  )
                  .map(([key, value]) => (
                    <p key={key}>
                      {displayNames[key] || key}: {value}
                    </p>
                  ))}
              </div>
            ))}
          </div>
          {/* Место для таблицы с продукцией заказа */}
        </ModalBody>
        <ModalFooter>
          <div className="product_card">
            <Button color="primary" onClick={() => console.log('cool')}>
              log
            </Button>
            <Button color="primary" disabled>
              Add
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
});

export default OrderCartModal;
