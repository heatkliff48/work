import React, { useEffect } from 'react';
import { Button } from 'reactstrap';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useDispatch, useSelector } from 'react-redux';

//         <ModalHeader toggle={() => setOrderModal(!orderModal)}>
//           Order Card: {orderCartData.article}
//         </ModalHeader>

//         <ModalBody className="item">
//           <div className="order-info-container">
// <div className="client-info">
//   <h4>Client Information</h4>
//   {Object.entries(orderCartData.owner || {})
//     .filter(
//       ([key]) =>
//         ![
//           'id',
//           'order_id',
//           'product_id',
//           'createdAt',
//           'updatedAt',
//         ].includes(key)
//     )
//     .map(([key, value]) => (
//       <p key={key}>
//         {displayNames[key] || key}: {value}
//       </p>
//     ))}
// </div>

//             <div className="delivery-info">
//               <h4>Delivery Address</h4>
//               {Object.entries(orderCartData.deliveryAddress || {})
//                 .filter(
//                   ([key]) =>
//                     ![
//                       'id',
//                       'client_id',
//                       'product_id',
//                       'createdAt',
//                       'updatedAt',
//                     ].includes(key)
//                 )
//                 .map(([key, value]) => (
//                   <p key={key}>
//                     {displayNames[key] || key}: {value}
//                   </p>
//                 ))}
//             </div>
//           </div>

//           <div>
//             <h4>Products info</h4>
//             {productListOrder.map((product) => (
//               <div className="product-info" key={product.id}>
//                 {Object.entries(product || {})
//                   .filter(
//                     ([key]) =>
//                       ![
//                         'id',
//                         'order_id',
//                         'product_id',
//                         'createdAt',
//                         'updatedAt',
//                       ].includes(key)
//                   )
//                   .map(([key, value]) => (
//                     <p key={key}>
//                       {displayNames[key] || key}: {value}
//                     </p>
//                   ))}
//               </div>
//             ))}
//           </div>
//           {/* Место для таблицы с продукцией заказа */}
//         </ModalBody>
//         <ModalFooter>
//           <div className="product_card">
//             <Button color="primary" onClick={() => console.log('cool')}>
//               log
//             </Button>
//             <Button color="primary" disabled>
//               Add
//             </Button>
//           </div>
//         </ModalFooter>
//       </Modal>
//     </div>
//   );
// });

const OrderCart = React.memo(() => {
  const { orderCartData, setOrderCartData } = useOrderContext();

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

  const deleteOrderHandler = () => {};

  useEffect(() => {
    if (Object.keys(orderCartData).length === 0)
      setOrderCartData(JSON.parse(localStorage.getItem('orderCartData')));
  }, []);

  return (
    <div className="page-container">
      <h4>Order Card: {orderCartData.article}</h4>

      <div className="header-container">
        <div className="owner-info">
          <h4>Client Information</h4>
          {Object.entries(orderCartData.owner || {})
            .filter(
              ([key]) =>
                !['id', 'order_id', 'product_id', 'createdAt', 'updatedAt'].includes(
                  key
                )
            )
            .map(([key, value]) => (
              <p key={key}>
                {displayNames[key] || key}: {value}
              </p>
            ))}
        </div>
        <div className="contact-info">
          <div className="contact-text">
            <h4>Contact Person</h4>
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
          <Button>Edit</Button>
        </div>
        <Button>Delete Order</Button>
      </div>
      <div className="delivery-address">
        <h4>Delivery Address</h4>
        {/* Render delivery address */}
        <Button>Edit</Button>
      </div>
      <table className="product-table">
        <thead>
          <tr>{/* Render table headers */}</tr>
        </thead>
        <tbody>
          {productListOrder.map((product) => (
            <tr key={product.id} className="product-row">
              {/* Render product information */}
              <td>
                <Button onClick={deleteOrderHandler}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default OrderCart;
