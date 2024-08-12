// import React, { useMemo } from 'react';
// import { ModalBody } from 'reactstrap';
// import { useOrderContext } from '../../contexts/OrderContext';
// import InputField from '#components/InputField/InputField.jsx';

// const OrderProductInfo = React.memo(() => {
//   const {
//     COLUMNS_ORDER_PRODUCT,
//     productOfOrder,
//     setProductOfOrder,
//     selectedProduct,
//   } = useOrderContext();

//   const handleProductListOrderChange = (e) => {
//     setProductOfOrder((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };
//   // if (selectedProduct) {
//   // }
//   const quantity_palet_value = useMemo(() => {
//     if (!selectedProduct) return 0;
//     if (!productOfOrder?.quantity_m2) productOfOrder.quantity_m2 = 0;
//     const result = Math.ceil(
//       productOfOrder?.quantity_m2 / (selectedProduct?.m2 || 1)
//     );

//     setProductOfOrder((prev) => ({
//       ...prev,
//       quantity_palet: result,
//     }));
//     return result;
//   }, [productOfOrder.quantity_m2, selectedProduct?.m2]);

//   const quantity_real_value = useMemo(() => {
//     if (!selectedProduct) return 0;
//     const result = Math.ceil(quantity_palet_value * (selectedProduct?.m2 || 1));

//     setProductOfOrder((prev) => ({
//       ...prev,
//       quantity_real: result,
//     }));
//     return result;
//   }, [quantity_palet_value, selectedProduct?.m2]);

//   const price_m2_value = useMemo(() => {
//     if (!selectedProduct) return 0;

//     const result =
//       (selectedProduct?.price * selectedProduct?.m3) / selectedProduct?.m2;

//     setProductOfOrder((prev) => ({
//       ...prev,
//       price_m2: result,
//     }));
//     return result;
//   }, [selectedProduct?.price, selectedProduct?.m2, selectedProduct?.m3]);

//   const final_price_value = useMemo(() => {
//     if (!selectedProduct) return 0;

//     const discount = productOfOrder?.discount ?? 0;
//     const result = (price_m2_value * quantity_real_value * (100 - discount)) / 100;

//     setProductOfOrder((prev) => ({
//       ...prev,
//       final_price: result,
//     }));
//     return result;
//   }, [price_m2_value, quantity_real_value, productOfOrder?.discount]);

//   return (
//     <div>
//       {COLUMNS_ORDER_PRODUCT?.map((el) => {
//         if (el.accessor === 'article') return null;
//         if (el.accessor === 'product_id')
//           return (
//             <>
//               <ModalBody>{el.Header}:</ModalBody>
//               <input
//                 type="text"
//                 id={el.accessor}
//                 name={el.accessor}
//                 value={productOfOrder[el.accessor] || ''}
//                 readOnly
//               />
//             </>
//           );
//         if (el.accessor === 'quantity_palet')
//           return (
//             <>
//               <ModalBody>{el.Header}:</ModalBody>
//               <input
//                 type="text"
//                 id={el.accessor}
//                 name={el.accessor}
//                 value={quantity_palet_value}
//                 readOnly
//               />
//             </>
//           );
//         if (el.accessor === 'quantity_real')
//           return (
//             <>
//               <ModalBody>{el.Header}:</ModalBody>
//               <input
//                 type="text"
//                 id={el.accessor}
//                 name={el.accessor}
//                 value={quantity_real_value}
//                 readOnly
//               />
//             </>
//           );
//         if (el.accessor === 'price_m2')
//           return (
//             <>
//               <ModalBody>{el.Header}:</ModalBody>
//               <input
//                 type="text"
//                 id={el.accessor}
//                 name={el.accessor}
//                 value={price_m2_value}
//                 readOnly
//               />
//             </>
//           );
//         if (el.accessor === 'final_price')
//           return (
//             <>
//               <ModalBody>{el.Header}:</ModalBody>
//               <input
//                 type="text"
//                 id={el.accessor}
//                 name={el.accessor}
//                 value={final_price_value}
//                 readOnly
//               />
//             </>
//           );
//         return (
//           <InputField
//             key={el.id}
//             el={el}
//             inputValue={productOfOrder}
//             inputValueChange={handleProductListOrderChange}
//           />
//         );
//       })}
//     </div>
//   );
// });
// export default OrderProductInfo;
