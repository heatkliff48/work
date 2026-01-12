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
import { useProjectContext } from '#components/contexts/Context.js';

const AddProductOrderModal = React.memo(({ isOpen, toggle }) => {
  const {
    COLUMNS_ORDER_PRODUCT,
    productOfOrder,
    setProductOfOrder,
    setSelectedProduct,
    list_of_orders,
    selectedProduct,
    randomOrderCheck,
    setRandomOrderCheck,
    orderCartData,
    setNewOrder,
    setRandomFillComplete,
  } = useOrderContext();
  const { COLUMNS, latestProducts } = useProductsContext();
  const { clientPriceInfo } = useProjectContext();

  const [inProgress, setInProgress] = useState(false);
  const [haveChangePriceM3, setHaveChangePriceM3] = useState(false);

  const dispatch = useDispatch();

  function extractProductTitle(description) {
    if (!description) return '';

    const match = description.match(/BAUBLOCK®\s*(.+?)\s*(?:Medidas|$)/i);

    if (match && match[1]) {
      return match[1].trim();
    }

    return description;
  }
  const haveProduct = useMemo(
    () => productOfOrder?.product_article ?? false,
    [productOfOrder?.product_article]
  );

  const haveOrderClient = list_of_orders.find(
    (el) => el.article === orderCartData.article
  );

  const handlerAddProductOrder = useCallback(
    (row) => {
      const product = latestProducts.filter((el) => el.id === row.original.id)[0];

      const productTitle = extractProductTitle(product?.description || '');

      let discountFromClient = 0;
      if (clientPriceInfo && productTitle) {
        const clientPrice = clientPriceInfo.find(
          (item) =>
            item.title === productTitle &&
            item.client_type === orderCartData?.owner?.price_category
        );

        if (clientPrice) {
          discountFromClient = clientPrice.discont || 0;
        }
      }

      const newPriceM3 = product?.price * (1 - discountFromClient / 100);

      setSelectedProduct(product);
      setProductOfOrder((prev) => ({
        ...prev,
        product_article: row.original.article,
        product_id: product?.id,
        price_m3: formatFixed(newPriceM3 || 0, ','),
        discount: discountFromClient,
      }));
      setHaveChangePriceM3(false);
    },
    [latestProducts, clientPriceInfo, orderCartData]
  );

  const handlePriceM3Change = (e) => {
    const { name, value } = e.target;
    setHaveChangePriceM3(true);
    setProductOfOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriceM3Blur = (e) => {
    const { value } = e.target;
    const parsed = parseDecimal(value);
    if (!Number.isNaN(parsed)) {
      setProductOfOrder((prev) => ({ ...prev, price_m3: formatFixed(parsed, ',') }));
    }
  };

  function parseDecimal(str) {
    if (str === undefined || str === null) return NaN;
    const num = parseFloat(String(str).replace(',', '.'));
    return Number.isNaN(num) ? NaN : num;
  }

  // Число -> строка с 2 знаками; sep="," чтобы в инпуте было по-европейски
  function formatFixed(num, sep = ',') {
    const fixed = Number(num || 0).toFixed(2);
    return sep === ',' ? fixed.replace('.', ',') : fixed;
  }

  function formatDecimal(str) {
    str = str.toString();

    const parts = str.split('.');

    let intPart = parts[0];
    let decPart = parts[1] || '';

    if (decPart.length === 0) {
      decPart = '00';
    } else if (decPart.length === 1) {
      decPart = decPart + '0';
    } else if (decPart.length > 2) {
      decPart = decPart.slice(0, 2);
    }

    return `${intPart}.${decPart}`;
  }

  const handleDiscountChange = (e) => {
    const { value } = e.target;
    setHaveChangePriceM3(false); // Сбрасываем флаг изменения цены

    const discount = Number(value || 0);
    const newPriceM3 = base_price_m3 * (1 - discount / 100);

    setProductOfOrder((prev) => ({
      ...prev,
      discount: discount,
      price_m3: formatFixed(newPriceM3, ','),
    }));
  };

  const handleProductListOrderChange = (e) => {
    const { name } = e.target;
    let value = e.target.value;

    if (typeof value === 'string') {
      const repVale = value.replace(',', '.');
      value = isNaN(repVale) ? value : repVale;
    }

    setProductOfOrder((prev) => ({ ...prev, [name]: value }));
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
      quantity_palet: result.toFixed(2),
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

  // Базовая цена продукта (не меняется)
  const base_price_m3 = useMemo(() => {
    return Number(selectedProduct?.price || 0);
  }, [selectedProduct?.price]);

  // Цена m3 - может быть изменена пользователем или рассчитана из скидки
  const price_m3_value = useMemo(() => {
    if (haveChangePriceM3) {
      // Если пользователь менял цену напрямую
      const n = parseDecimal(productOfOrder?.price_m3);
      return Number.isNaN(n) ? base_price_m3 : n;
    } else {
      // Рассчитываем из скидки
      const discount = Number(productOfOrder?.discount || 0);
      return base_price_m3 * (1 - discount / 100);
    }
  }, [
    haveChangePriceM3,
    productOfOrder?.price_m3,
    productOfOrder?.discount,
    base_price_m3,
  ]);

  // Скидка - рассчитывается из цены или устанавливается пользователем
  const discount_value = useMemo(() => {
    if (haveChangePriceM3 && base_price_m3 > 0) {
      // Если цена была изменена - рассчитываем скидку
      const result = ((base_price_m3 - price_m3_value) / base_price_m3) * 100;

      setProductOfOrder((prev) => ({
        ...prev,
        discount: Math.max(0, result), // Скидка не может быть отрицательной
      }));

      return Math.max(0, result);
    } else {
      // Возвращаем скидку, установленную пользователем
      return Number(productOfOrder?.discount || 0);
    }
  }, [haveChangePriceM3, price_m3_value, base_price_m3, productOfOrder?.discount]);

  const final_price_value = useMemo(() => {
    const result =
      (price_m2_value * quantity_real_value * Math.abs(100 - discount_value)) / 100;

    setProductOfOrder((prev) => ({
      ...prev,
      final_price: result.toFixed(2),
    }));
    return result.toFixed(2);
  }, [price_m2_value, quantity_real_value, productOfOrder?.discount]);

  const addProductOrder = async () => {
    const { quantity_m2, discount, price_m3 } = productOfOrder;
    const newqm2 = formatDecimal(quantity_m2);
    const formatedNum = price_m3?.replace(',', '.');
    const newpricem3 = formatDecimal(formatedNum);
    const newdiscount = formatDecimal(discount);

    if (haveOrderClient) {
      dispatch(
        getUpdateProductOfOrders({
          newProductsOfOrder: {
            order_id: haveOrderClient.id,
            productOfOrder: {
              ...productOfOrder,
              quantity_m2: parseFloat(newqm2),
              price_m3: parseFloat(newpricem3),
              discount: parseFloat(newdiscount),
            },
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
                if (el.accessor === 'price_m3')
                  return (
                    <InputField
                      key={el.id}
                      el={el}
                      inputValue={productOfOrder}
                      inputValueChange={handlePriceM3Change}
                      onBlur={handlePriceM3Blur}
                    />
                  );

                if (el.accessor === 'discount')
                  return (
                    <InputField
                      key={el.id}
                      el={el}
                      inputValue={{
                        ...productOfOrder,
                        discount: productOfOrder.discount?.toFixed(2),
                      }}
                      inputValueChange={handleDiscountChange}
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
