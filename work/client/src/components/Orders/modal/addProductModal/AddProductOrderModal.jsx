import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useOrderContext } from '../../../contexts/OrderContext';
import InputField from '#components/InputField/InputField.jsx';
import Table from '#components/Table/Table.jsx';
import {
  addOrderRandomProducts,
  getUpdateProductOfOrders,
} from '#components/redux/actions/ordersAction.js';
import { useDispatch } from 'react-redux';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import '#components/Styles/modals.css';

const AddProductOrderModal = React.memo(({ isOpen, toggle }) => {
  const {
    COLUMNS_ORDER_PRODUCT,
    productOfOrder,
    setProductOfOrder,
    setSelectedProduct,
    list_of_orders,
    newOrder,
    selectedProduct,
    randomOrderCheck,
    setRandomOrderCheck,
    orderCartData,
    setNewOrder,
    setRandomFillComplete,
  } = useOrderContext();
  const { COLUMNS, latestProducts } = useProductsContext();

  const [inProgress, setInProgress] = useState(false);

  const dispatch = useDispatch();

  const haveProduct = useMemo(
    () => productOfOrder?.product_article ?? false,
    [productOfOrder?.product_article]
  );

  const haveOrderClient = list_of_orders.find(
    (el) => el.article === orderCartData.article
  );

  const handlerAddProductOrder = useCallback((row) => {
    const product = latestProducts.filter((el) => el.id === row.original.id)[0];

    setSelectedProduct(product);
    setProductOfOrder((prev) => ({
      ...prev,
      product_article: row.original.article,
      product_id: product?.id,
    }));
  }, []);

  const handleProductListOrderChange = (e) => {
    setProductOfOrder((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const quantity_palet_value = useMemo(() => {
    if (!selectedProduct) return;
    if (!productOfOrder?.quantity_m2) productOfOrder.quantity_m2 = 0;
    const result = Math.ceil(
      selectedProduct?.form === 'U-block'
        ? productOfOrder?.quantity_m2 / (selectedProduct?.m || 1)
        : productOfOrder?.quantity_m2 / (selectedProduct?.m2 || 1)
    );

    setProductOfOrder((prev) => ({
      ...prev,
      quantity_palet: result,
    }));
    return result;
  }, [productOfOrder.quantity_m2, selectedProduct?.m2]);

  const quantity_real_value = useMemo(() => {
    const result = Math.ceil(quantity_palet_value * (selectedProduct?.m2 || 1));

    setProductOfOrder((prev) => ({
      ...prev,
      quantity_real: result,
    }));
    return result;
  }, [quantity_palet_value, selectedProduct?.m2]);

  const price_m2_value = useMemo(() => {
    const result =
      (selectedProduct?.price * selectedProduct?.volumeBlockOnPallet) /
      selectedProduct?.m2;

    setProductOfOrder((prev) => ({
      ...prev,
      price_m2: result.toFixed(2),
    }));
    return result.toFixed(2);
  }, [
    selectedProduct?.price,
    selectedProduct?.m2,
    selectedProduct?.volumeBlockOnPallet,
  ]);

  const final_price_value = useMemo(() => {
    const discount = productOfOrder?.discount ?? 0;
    const result =
      (price_m2_value * quantity_real_value * Math.abs(100 - discount)) / 100;

    setProductOfOrder((prev) => ({
      ...prev,
      final_price: result.toFixed(2),
    }));
    return result.toFixed(2);
  }, [price_m2_value, quantity_real_value, productOfOrder?.discount]);

  const addProductOrder = async () => {
    if (haveOrderClient) {
      dispatch(
        getUpdateProductOfOrders({
          newProductsOfOrder: {
            order_id: haveOrderClient.id,
            productOfOrder,
          },
        })
      );
      setProductOfOrder({});
      setSelectedProduct({});
    }
    toggle();
  };

  useEffect(() => {
    const discount = productOfOrder?.discount ?? 0;
    setProductOfOrder((prev) => ({
      ...prev,
      discount,
    }));
  }, []);

  // const simulateRandomProductAddition = async () => {
  //   const randomIterations = Math.floor(Math.random() * 4) + 2;
  //   const actions = [];

  //   for (let i = 0; i < randomIterations; i++) {
  //     const activeProducts = latestProducts.filter(
  //       (product) => product.activeStatus === true
  //     );

  //     if (activeProducts.length === 0) {
  //       break;
  //     }

  //     const randomIndex = Math.floor(Math.random() * 10); // вроде менять тут
  //     const randomProduct = activeProducts[randomIndex];
  //     setSelectedProduct(randomProduct);

  //     const randomQuantity = Math.floor(Math.random() * 1000) + 1;

  //     const randomQuantityPallets = Math.floor(Math.random() * 150) + 1;

  //     const randomQuantityReal = Math.floor(Math.random() * 1000) + 1;

  //     if (haveOrderClient) {
  //       actions.push({
  //         newProductsOfOrder: {
  //           order_id: haveOrderClient.id,
  //           productOfOrder: {
  //             product_id: randomProduct.id,
  //             quantity_m2: randomQuantity,
  //             quantity_palet: randomQuantityPallets,
  //             quantity_real: randomQuantityReal,
  //             price_m2: 0,
  //             discount: 0,
  //             final_price: 0,
  //           },
  //         },
  //       });

  //       setProductOfOrder({});
  //       setSelectedProduct({});
  //     }
  //   }

  //   if (actions.length > 0) {
  //     dispatch(
  //       getUpdateProductOfOrders({
  //         newProductsOfOrder: actions,
  //       })
  //     );
  //   }

  //   toggle();
  // };

  // useEffect(() => {
  //   if (!randomOrderCheck || inProgress) return;
  //   setInProgress(true);
  //   setRandomFillComplete(false);

  //   const run = async () => {
  //     try {
  //       // await simulateRandomProductAddition();
  //     } finally {
  //       setInProgress(false);
  //     }
  //   };

  //   run();
  // }, [randomOrderCheck, inProgress]);

  return (
    <div>
      <Modal
        isOpen={isOpen}
        toggle={() => {
          toggle();
          setProductOfOrder({});
          setSelectedProduct({});
        }}
        className="modal-products-table"
        scrollable={true}
      >
        <ModalHeader
          toggle={() => {
            toggle();
            setProductOfOrder({});
            setSelectedProduct({});
          }}
        >
          {haveProduct ? (
            <p>Fill in the remaining parameters</p>
          ) : (
            <p>Select product</p>
          )}
        </ModalHeader>
        <ModalBody>
          {haveProduct ? (
            <>
              {COLUMNS_ORDER_PRODUCT?.map((el) => {
                if (el.accessor === 'product_id') return null;
                if (el.accessor === 'product_article')
                  return (
                    <>
                      <ModalBody>{el.Header}:</ModalBody>
                      <input
                        type="text"
                        id={el.accessor}
                        name={el.accessor}
                        value={productOfOrder['product_article'] || ''}
                        readOnly
                      />
                    </>
                  );
                if (el.accessor === 'quantity_palet')
                  return (
                    <>
                      <ModalBody>{el.Header}:</ModalBody>
                      <input
                        type="text"
                        id={el.accessor}
                        name={el.accessor}
                        value={quantity_palet_value}
                        readOnly
                      />
                    </>
                  );
                if (el.accessor === 'quantity_real')
                  return (
                    <>
                      <ModalBody>{el.Header}:</ModalBody>
                      <input
                        type="text"
                        id={el.accessor}
                        name={el.accessor}
                        value={quantity_real_value}
                        readOnly
                      />
                    </>
                  );
                if (el.accessor === 'price_m2')
                  return (
                    <>
                      <ModalBody>{el.Header}:</ModalBody>
                      <input
                        type="text"
                        id={el.accessor}
                        name={el.accessor}
                        value={price_m2_value}
                        readOnly
                      />
                    </>
                  );
                if (el.accessor === 'final_price')
                  return (
                    <>
                      <ModalBody>{el.Header}:</ModalBody>
                      <input
                        type="text"
                        id={el.accessor}
                        name={el.accessor}
                        value={final_price_value}
                        readOnly
                      />
                    </>
                  );
                if (
                  selectedProduct?.form === 'U-block' &&
                  el.accessor === 'quantity_m2'
                )
                  return (
                    <InputField
                      key={el.id}
                      el={el}
                      inputValue={productOfOrder}
                      inputValueChange={handleProductListOrderChange}
                      uBlockHeader="Quantity, linear metre"
                    />
                  );
                return (
                  <InputField
                    key={el.id}
                    el={el}
                    inputValue={productOfOrder}
                    inputValueChange={handleProductListOrderChange}
                  />
                );
              })}
            </>
          ) : (
            <>
              <Table
                COLUMN_DATA={COLUMNS}
                dataOfTable={latestProducts.filter(
                  (product) => product.activeStatus === true
                )}
                // userAccess={userAccess}
                onClickButton={() => {}}
                buttonText={''}
                tableName={'Products'}
                handleRowClick={(row) => {
                  handlerAddProductOrder(row);
                }}
              />
            </>
          )}
        </ModalBody>
        {!haveProduct ? (
          <></>
        ) : (
          <ModalFooter>
            <button onClick={addProductOrder}>Add product</button>
          </ModalFooter>
        )}
      </Modal>
    </div>
  );
});
export default AddProductOrderModal;
