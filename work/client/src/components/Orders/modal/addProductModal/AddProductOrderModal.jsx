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
import { set } from 'date-fns';

const limitDecimalInput = (value, maxDecimals = 2) => {
  if (value === '' || value === null || value === undefined) return '';
  let str = String(value).replace(',', '.');
  str = str.replace(/[^\d.]/g, '');
  const parts = str.split('.');
  if (parts.length > 2) {
    str = parts[0] + '.' + parts.slice(1).join('');
  }
  if (parts.length === 2 && parts[1].length > maxDecimals) {
    str = parts[0] + '.' + parts[1].slice(0, maxDecimals);
  }
  return str;
};

const parseLocalNumber = (str) => {
  if (str === '' || str == null) return NaN;
  const normalized = String(str).replace(',', '.');
  const num = parseFloat(normalized);
  return isNaN(num) ? NaN : num;
};

const formatFixed = (num, decimals = 2, separator = ',') => {
  if (isNaN(num)) return '';
  const fixed = Number(num)?.toFixed(decimals);
  return separator === ',' ? fixed.replace('.', ',') : fixed;
};

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
    [productOfOrder?.product_article],
  );

  const haveOrderClient = list_of_orders.find(
    (el) => el.article === orderCartData.article,
  );

  const handlerAddProductOrder = useCallback(
    (row) => {
      const product = latestProducts.filter(
        (el) => el.id === row.original.id,
      )[0];
      const productTitle = extractProductTitle(product?.description || '');

      let originalPrice = product.price;
      let discount = 0;

      if (clientPriceInfo && productTitle) {
        const clientPrice = clientPriceInfo.find(
          (item) =>
            item.title === productTitle &&
            item.client_type === orderCartData?.owner?.price_category,
        );

        if (clientPrice) {
          discount = Number(clientPrice.discont || 0);
        }
      }

      const newPriceM3 = product?.price * (1 - discount / 100);

      setSelectedProduct(product);
      setProductOfOrder((prev) => ({
        ...prev,
        product_article: row.original.article,
        product_title: productTitle,
        description: product?.description,
        product_id: product?.id,
        originalPrice,
        price_m3: formatFixed(newPriceM3 || 0, 2, ','),
        discount: discount?.toFixed(2),
      }));
    },
    [latestProducts, clientPriceInfo, orderCartData],
  );

  const handlePriceM3Change = (e) => {
    const limited = limitDecimalInput(e.target.value, 2);

    const price = parseLocalNumber(limited) || 0;
    const originalPrice = Number(productOfOrder.originalPrice || 0);

    const discount =
      originalPrice === 0 ? 0 : ((originalPrice - price) / originalPrice) * 100;

    setProductOfOrder((prev) => ({
      ...prev,
      price_m3: limited,
      discount: discount.toFixed(2),
    }));
  };

  const handlePriceM3Blur = () => {
    const num = parseLocalNumber(productOfOrder.price_m3);
    if (!isNaN(num)) {
      setProductOfOrder((prev) => ({ ...prev, price_m3: num?.toFixed(2) }));
    }
  };

  const handleDiscountChange = (e) => {
    const limited = limitDecimalInput(e.target.value, 2);

    const discount = parseLocalNumber(limited) || 0;
    const originalPrice = Number(productOfOrder.originalPrice || 0);

    const newPrice = originalPrice * (1 - discount / 100);

    setProductOfOrder((prev) => ({
      ...prev,
      discount: limited,
      price_m3: formatFixed(newPrice),
    }));
  };

  const handleDiscountBlur = () => {
    const num = parseLocalNumber(productOfOrder.discount);
    if (!isNaN(num)) {
      setProductOfOrder((prev) => ({ ...prev, discount: num?.toFixed(2) }));
    }
  };

  const handleQuantityM2Change = (e) => {
    const limited = limitDecimalInput(e.target.value, 2);
    setProductOfOrder((prev) => ({ ...prev, quantity_m2: limited }));
  };

  const handleQuantityM2Blur = () => {
    const m2 = parseLocalNumber(productOfOrder.quantity_m2);

    if (!isNaN(m2) && selectedProduct) {
      const m2PerPallet =
        selectedProduct.form === 'U-block'
          ? selectedProduct.m
          : selectedProduct.m2;
      const palets = Math.ceil(m2 / m2PerPallet);
      setProductOfOrder((prev) => ({
        ...prev,
        quantity_m2: m2?.toFixed(2),
        quantity_palet: String(palets),
      }));
    }
  };

  const handleQuantityPaletChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '');
    setProductOfOrder((prev) => ({ ...prev, quantity_palet: digits }));
  };

  const handleQuantityPaletBlur = () => {
    const palets = parseInt(productOfOrder.quantity_palet, 10);

    if (!isNaN(palets) && selectedProduct) {
      const m2PerPallet =
        selectedProduct.form === 'U-block'
          ? selectedProduct.m
          : selectedProduct.m2;
      const newM2 = palets * m2PerPallet;
      setProductOfOrder((prev) => ({
        ...prev,
        quantity_palet: String(palets),
        quantity_m2: newM2?.toFixed(2),
      }));
    }
  };

  const handleTextChange = (e) => {
    setProductOfOrder((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const quantityM2Num = useMemo(
    () => parseLocalNumber(productOfOrder.quantity_m2) || 0,
    [productOfOrder.quantity_m2],
  );
  const discountNum = useMemo(
    () => parseLocalNumber(productOfOrder.discount) || 0,
    [productOfOrder.discount],
  );

  const price_m2_value = useMemo(() => {
    if (!selectedProduct) return '0,00';
    const result =
      (selectedProduct.price * selectedProduct.volumeBlockOnPallet) /
      selectedProduct.m2;

    setProductOfOrder((prev) => ({
      ...prev,
      price_m2: result?.toFixed(2),
    }));

    return formatFixed(result, 2, ',');
  }, [selectedProduct]);

  const final_price_value = useMemo(() => {
    const m2 = quantityM2Num;
    const priceM2 = parseLocalNumber(price_m2_value) || 0;
    const discount = discountNum;
    const result = (priceM2 * m2 * (100 - discount)) / 100;

    setProductOfOrder((prev) => ({
      ...prev,
      final_price: result?.toFixed(2),
    }));

    return formatFixed(result, 2, ',');
  }, [quantityM2Num, price_m2_value, discountNum]);

  const quantity_real_value = useMemo(() => {
    if (!selectedProduct) return '0,00';
    const m2PerPallet =
      selectedProduct.form === 'U-block'
        ? selectedProduct.m
        : selectedProduct.m2;

    const real = productOfOrder?.quantity_palet * m2PerPallet;

    setProductOfOrder((prev) => ({
      ...prev,
      quantity_real: real?.toFixed(2),
    }));

    return formatFixed(real, 2, ',');
  }, [quantityM2Num, selectedProduct, productOfOrder?.quantity_palet]);

  const addProductOrder = async () => {
    const quantityM2 = parseLocalNumber(productOfOrder.quantity_m2) || 0;
    const priceM3 = parseLocalNumber(productOfOrder.price_m3) || 0;
    const discount = parseLocalNumber(productOfOrder.discount) || 0;
    const quantity_palet = parseLocalNumber(productOfOrder.quantity_palet) || 0;
    const quantity_real = parseLocalNumber(productOfOrder.quantity_real) || 0;
    const price_m2 = parseLocalNumber(productOfOrder.price_m2) || 0;
    const final_price = parseLocalNumber(productOfOrder.final_price) || 0;

    if (!quantityM2 || !quantity_palet || !quantity_real) {
      alert('Cannot add product with 0 quantity!');
      return;
    }

    const payload = {
      ...productOfOrder,
      quantity_m2: parseFloat(quantityM2?.toFixed(2)),
      price_m3: parseFloat(priceM3?.toFixed(2)),
      discount: parseFloat(discount?.toFixed(2)),
      quantity_palet: parseInt(quantity_palet, 10) || 0,
      quantity_real: parseInt(quantity_real, 10) || 0,
      price_m2: parseFloat(price_m2?.toFixed(2)),
      final_price: parseFloat(final_price?.toFixed(2)),
    };

    if (haveOrderClient) {
      dispatch(
        getUpdateProductOfOrders({
          newProductsOfOrder: {
            order_id: haveOrderClient.id,
            productOfOrder: payload,
          },
        }),
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
      discount: discount.toString(),
    }));
  }, []);

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
                if (el.accessor === 'product_title') {
                  return (
                    <React.Fragment key={el.accessor}>
                      <ModalBody>{el.Header}:</ModalBody>
                      <input
                        type="text"
                        id={el.accessor}
                        name={el.accessor}
                        value={productOfOrder.product_title || ''}
                        readOnly
                      />
                    </React.Fragment>
                  );
                }

                if (el.accessor === 'price_m2') {
                  return (
                    <React.Fragment key={el.accessor}>
                      <ModalBody>{el.Header}:</ModalBody>
                      <input
                        type="text"
                        id={el.accessor}
                        name={el.accessor}
                        value={price_m2_value}
                        readOnly
                      />
                    </React.Fragment>
                  );
                }

                if (el.accessor === 'final_price') {
                  return (
                    <React.Fragment key={el.accessor}>
                      <ModalBody>{el.Header}:</ModalBody>
                      <input
                        type="text"
                        id={el.accessor}
                        name={el.accessor}
                        value={final_price_value}
                        readOnly
                      />
                    </React.Fragment>
                  );
                }

                if (el.accessor === 'quantity_real') {
                  return (
                    <React.Fragment key={el.accessor}>
                      <ModalBody>{el.Header}:</ModalBody>
                      <input
                        type="text"
                        id={el.accessor}
                        name={el.accessor}
                        value={quantity_real_value}
                        readOnly
                      />
                    </React.Fragment>
                  );
                }

                if (el.accessor === 'quantity_m2') {
                  return (
                    <InputField
                      key={el.accessor}
                      el={el}
                      uBlockHeader={
                        selectedProduct?.form === 'U-block'
                          ? 'Quantity, linear metre'
                          : ''
                      }
                      inputValue={productOfOrder}
                      inputValueChange={handleQuantityM2Change}
                      onBlur={handleQuantityM2Blur}
                      isDisabled={false}
                    />
                  );
                }

                if (el.accessor === 'quantity_palet') {
                  return (
                    <InputField
                      key={el.accessor}
                      el={el}
                      inputValue={productOfOrder}
                      inputValueChange={handleQuantityPaletChange}
                      onBlur={handleQuantityPaletBlur}
                      isDisabled={false}
                    />
                  );
                }

                if (el.accessor === 'price_m3') {
                  return (
                    <InputField
                      key={el.accessor}
                      el={el}
                      inputValue={productOfOrder}
                      inputValueChange={handlePriceM3Change}
                      onBlur={handlePriceM3Blur}
                      isDisabled={false}
                    />
                  );
                }

                if (el.accessor === 'discount') {
                  return (
                    <InputField
                      key={el.accessor}
                      el={el}
                      inputValue={productOfOrder}
                      inputValueChange={handleDiscountChange}
                      onBlur={handleDiscountBlur}
                      isDisabled={false}
                    />
                  );
                }

                return (
                  <InputField
                    key={el.accessor}
                    el={el}
                    inputValue={productOfOrder}
                    inputValueChange={handleTextChange}
                    isDisabled={false}
                  />
                );
              })}
            </>
          ) : (
            <Table
              COLUMN_DATA={COLUMNS}
              dataOfTable={latestProducts.filter(
                (product) => product.activeStatus === true,
              )}
              onClickButton={() => {}}
              buttonText={''}
              tableName={'Products'}
              handleRowClick={(row) => {
                handlerAddProductOrder(row);
              }}
            />
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
