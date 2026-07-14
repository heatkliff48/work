import React, { useEffect, useMemo } from 'react';
import { ModalBody } from 'reactstrap';
import { FormGroup, Input, Label } from 'reactstrap';
import { useOrderContext } from '../../contexts/OrderContext';
import InputField from '#components/InputField/InputField.jsx';
import '../ordersView.css';
import {
  getUpdateProductInfoOfOrders,
  getUpdateAnchorProductsInfoOfOrder,
  getUpdateDryMixedProductsInfoOfOrder,
  getUpdateRelMatProductsInfoOfOrder,
  getUpdateToolProductsInfoOfOrder,
} from '#components/redux/actions/ordersAction.js';
import { useDispatch } from 'react-redux';
import { useProjectContext } from '#components/contexts/Context.js';
import { useState } from 'react';

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

const OrderProductCardInfoModal = React.memo(({ isOpen, toggle }) => {
  const {
    COLUMNS_ORDER_PRODUCT,
    COLUMNS_ORDER_DRY_MIXES,
    COLUMNS_ORDER_ANCHOR,
    COLUMNS_ORDER_TOOL,
    COLUMNS_ORDER_RELATED_MATERIAL,
    productOfOrder,
    setProductOfOrder,
    selectedProduct,
    setSelectedProduct,
    orderCartData,
  } = useOrderContext();

  const { clientPriceInfo } = useProjectContext();

  const dispatch = useDispatch();

  const [isReturn, setIsReturn] = useState(productOfOrder?.final_price < 0);

  useEffect(() => {
    console.log(
      productOfOrder,
      'productOfOrder OrderProductCardInfoModal.jsx line 66',
    );
  }, [productOfOrder]);

  const handleProductListOrderChange = (e) => {
    setProductOfOrder((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  function extractProductTitle(description) {
    if (!description) return '';
    const match = description.match(/BAUBLOCK®\s*(.+?)\s*(?:Medidas|$)/i);
    if (match && match[1]) {
      return match[1].trim();
    }
    return description;
  }

  useEffect(() => {
    if (!productOfOrder.product_title) {
      const title = extractProductTitle(productOfOrder.description);
      setProductOfOrder((prev) => ({ ...prev, product_title: title }));

      if (!productOfOrder.price_m3) {
        let discountFromClient = 0;
        if (clientPriceInfo && title) {
          const clientPrice = clientPriceInfo.find(
            (item) =>
              item.title === title &&
              item.client_type === orderCartData?.owner?.price_category,
          );
          if (clientPrice) {
            discountFromClient = clientPrice.discont || 0;
          }
        }

        const newPriceM3 =
          selectedProduct?.price * (1 - discountFromClient / 100);
        setProductOfOrder((prev) => ({ ...prev, price_m3: newPriceM3 }));
      }
    }
  }, []);

  const COLUMNS_ORDER = useMemo(() => {
    return selectedProduct.article.slice(2, 3) == 'N'
      ? COLUMNS_ORDER_PRODUCT
      : selectedProduct.article.slice(2, 3) == 'M'
        ? COLUMNS_ORDER_DRY_MIXES
        : selectedProduct.article.slice(2, 3) == 'P'
          ? COLUMNS_ORDER_RELATED_MATERIAL
          : selectedProduct.article.slice(2, 3) == 'F'
            ? COLUMNS_ORDER_ANCHOR
            : COLUMNS_ORDER_TOOL;
  }, [selectedProduct]);

  const pieces_per_pallet = selectedProduct?.pieces_per_unit ?? 0;

  const originalPrice = useMemo(() => {
    switch (selectedProduct.article.slice(2, 3)) {
      case 'N':
        return Number(selectedProduct?.price || 0);

      case 'M':
        return Number(selectedProduct?.price_per_unit || 0);

      case 'F':
        return Number(selectedProduct?.price_per_unit || 0);

      case 'T':
        return Number(selectedProduct?.price_per_unit || 0);

      case 'P':
        return Number(selectedProduct?.price_per_unit || 0);

      default:
        return 0;
    }
  }, [selectedProduct]);

  const quantity_palet_value = useMemo(() => {
    if (!selectedProduct) return;
    if (!productOfOrder?.quantity_m2) productOfOrder.quantity_m2 = 0;

    if (selectedProduct.article.slice(2, 3) == 'N') {
      const result = Math.ceil(
        productOfOrder?.quantity_m2 / (selectedProduct?.m2 || 1),
      );

      setProductOfOrder((prev) => ({
        ...prev,
        quantity_palet: result,
      }));
      return result;
    } else if (selectedProduct.article.slice(2, 3) == 'M') {
      const result = Math.ceil(
        productOfOrder?.quantity_ud / (selectedProduct?.units_per_pallet || 1),
      );

      setProductOfOrder((prev) => ({
        ...prev,
        quantity_palet_dry: result,
      }));
      return result;
    } else if (selectedProduct.article.slice(2, 3) == 'F') {
      const result = Math.ceil(
        productOfOrder?.quantity_ud / (pieces_per_pallet || 1),
      );

      setProductOfOrder((prev) => ({
        ...prev,
        quantity_palet_anchor: result,
      }));
      return result;
    }
  }, [
    productOfOrder?.quantity_m2,
    selectedProduct?.m2,
    productOfOrder?.quantity_ud,
    selectedProduct?.units_per_pallet,
  ]);

  const quantity_real_value = useMemo(() => {
    if (selectedProduct.article.slice(2, 3) == 'N') {
      const result = (
        quantity_palet_value * (selectedProduct?.m2 || 1)
      )?.toFixed(2);

      setProductOfOrder((prev) => ({
        ...prev,
        quantity_real: result,
      }));
      return result;
    } else if (selectedProduct.article.slice(2, 3) == 'M') {
      const result = Math.ceil(
        quantity_palet_value * (selectedProduct?.units_per_pallet || 1),
      );

      setProductOfOrder((prev) => ({
        ...prev,
        quantity_real_ud: result,
      }));
      return result;
    } else if (selectedProduct.article.slice(2, 3) == 'F') {
      const result = Math.ceil(quantity_palet_value * (pieces_per_pallet || 1));

      setProductOfOrder((prev) => ({
        ...prev,
        quantity_real_ud: result,
      }));
      return result;
    }
  }, [quantity_palet_value, selectedProduct?.m2]);

  const total_value = useMemo(() => {
    if (selectedProduct.article.slice(2, 3) == 'F') {
      const result = quantity_palet_value * pieces_per_pallet;

      setProductOfOrder((prev) => ({
        ...prev,
        total: result.toFixed(2),
      }));
      return result.toFixed(2);
    } else if (
      selectedProduct.article.slice(2, 3) == 'T' ||
      selectedProduct.article.slice(2, 3) == 'P'
    ) {
      const result = productOfOrder.quantity_ud;

      setProductOfOrder((prev) => ({
        ...prev,
        total: result,
      }));
      return result;
    } else {
      const result = quantity_palet_value * selectedProduct?.units_per_pallet;

      setProductOfOrder((prev) => ({
        ...prev,
        total: result.toFixed(2),
      }));
      return result.toFixed(2);
    }
  }, [
    quantity_palet_value,
    selectedProduct?.units_per_pallet,
    productOfOrder?.quantity_palet_anchor,
    productOfOrder?.quantity_ud,
    selectedProduct?.piece_weight,
  ]);

  const price_m2_value = useMemo(() => {
    const result = (
      (selectedProduct?.price * selectedProduct?.volumeBlockOnPallet) /
      selectedProduct?.m2
    ).toFixed(2);

    setProductOfOrder((prev) => ({
      ...prev,
      price_m2:
        selectedProduct.article.slice(2, 3) == 'N'
          ? result
          : productOfOrder?.pvp,
    }));
    return result;
  }, [
    selectedProduct?.price,
    selectedProduct?.m2,
    selectedProduct?.volumeBlockOnPallet,
  ]);

  const final_price_value = useMemo(() => {
    const discount = productOfOrder?.discount ?? 0;
    const price_m3 = parseLocalNumber(productOfOrder.price_m3);

    const result =
      selectedProduct.article.slice(2, 3) == 'N'
        ? (price_m3 * quantity_real_value * (100 - discount)) / 100
        : selectedProduct.article.slice(2, 3) == 'M'
          ? (selectedProduct?.price_per_unit *
              quantity_real_value *
              Math.abs(100 - discount)) /
            100
          : selectedProduct.article.slice(2, 3) == 'P'
            ? (selectedProduct?.price_per_unit *
                productOfOrder?.quantity_ud *
                Math.abs(100 - discount)) /
              100
            : selectedProduct.article.slice(2, 3) == 'F'
              ? (selectedProduct?.price_per_unit *
                  quantity_real_value *
                  Math.abs(100 - discount)) /
                100
              : (selectedProduct?.price_per_unit *
                  productOfOrder?.quantity_ud *
                  Math.abs(100 - discount)) /
                100;

    const finalResult = isReturn ? -Math.abs(result) : Math.abs(result);

    setProductOfOrder((prev) => ({
      ...prev,
      final_price: finalResult.toFixed(2),
    }));
    return finalResult.toFixed(2);
  }, [
    productOfOrder.price_m3,
    quantity_real_value,
    productOfOrder?.discount,
    selectedProduct?.price_per_unit,
    productOfOrder?.quantity_ud,
    isReturn,
  ]);

  const pvp_value = useMemo(() => {
    const result = total_value > 1 ? final_price_value / total_value : 0;

    setProductOfOrder((prev) => ({
      ...prev,
      pvp: result.toFixed(2),
    }));
    return result.toFixed(2);
  }, [final_price_value, total_value]);

  const addProductOrder = async () => {
    selectedProduct.article.slice(2, 3) == 'N'
      ? dispatch(getUpdateProductInfoOfOrders(productOfOrder))
      : selectedProduct.article.slice(2, 3) == 'M'
        ? dispatch(getUpdateDryMixedProductsInfoOfOrder(productOfOrder))
        : selectedProduct.article.slice(2, 3) == 'P'
          ? dispatch(getUpdateRelMatProductsInfoOfOrder(productOfOrder))
          : selectedProduct.article.slice(2, 3) == 'F'
            ? dispatch(getUpdateAnchorProductsInfoOfOrder(productOfOrder))
            : dispatch(getUpdateToolProductsInfoOfOrder(productOfOrder));
    setProductOfOrder({});
    setSelectedProduct({});
    toggle();
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

  // const handlePriceM3Change = (e) => {
  //   const limited = limitDecimalInput(e.target.value, 2);
  //   setProductOfOrder((prev) => ({ ...prev, price_m3: limited }));};

  const handlePriceM3Change = (e) => {
    const limited = limitDecimalInput(e.target.value, 2);

    const price = parseLocalNumber(limited) || 0;

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

  // const handleDiscountChange = (e) => {
  //   const limited = limitDecimalInput(e.target.value, 2);
  //   setProductOfOrder((prev) => ({ ...prev, discount: limited }));
  // };

  const handleDiscountChange = (e) => {
    const limited = limitDecimalInput(e.target.value, 2);

    const discount = parseLocalNumber(limited) || 0;
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

  useEffect(() => {
    if (!isOpen) {
      setIsReturn(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const closeHandler = () => {
    toggle();
    setProductOfOrder({});
    setSelectedProduct({});
    setIsReturn(false);
  };

  return (
    <div className="ord-modal-root">
      <div className="ord-modal-overlay" onClick={closeHandler} />
      <div className="ord-modal-card ord-modal-card--md">
        <div className="ord-modal-head ord-modal-head--sm">
          <div className="ord-modal-head__title ord-modal-head__title--sm">
            Fill in the remaining parameters
          </div>
          <button type="button" className="ord-iconbtn" onClick={closeHandler}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#565d6d"
              strokeWidth="2.1"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12" />
              <path d="M18 6 6 18" />
            </svg>
          </button>
        </div>
        <div className="ord-modal-body ord-modal-body--sm ord-product-fields">
          <>
            {COLUMNS_ORDER?.map((el) => {
              if (el.accessor === 'product_id') return null;
              if (
                el.accessor === 'product_title' ||
                el.accessor === 'dry_mixed_article' ||
                el.accessor === 'anchor_article' ||
                el.accessor === 'tool_article' ||
                el.accessor === 'rel_mat_article'
              )
                return (
                  <>
                    <ModalBody>{el.Header}:</ModalBody>
                    <input
                      style={{ width: '50%' }}
                      type="text"
                      id={el.accessor}
                      name={el.accessor}
                      value={productOfOrder.product_title || ''}
                      readOnly
                    />
                  </>
                );
              if (
                el.accessor === 'quantity_palet_dry' ||
                el.accessor === 'quantity_palet_ud'
              )
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
              if (el.accessor === 'quantity_palet')
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

              if (
                el.accessor === 'quantity_real' ||
                el.accessor === 'quantity_real_ud'
              )
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
              if (el.accessor === 'total')
                return (
                  <>
                    <ModalBody>{el.Header}:</ModalBody>
                    <input
                      type="text"
                      id={el.accessor}
                      name={el.accessor}
                      value={total_value}
                      readOnly
                    />
                  </>
                );
              if (el.accessor === 'pvp')
                return (
                  <>
                    <ModalBody>{el.Header}:</ModalBody>
                    <input
                      type="text"
                      id={el.accessor}
                      name={el.accessor}
                      value={pvp_value}
                      readOnly
                    />
                  </>
                );

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
                    <FormGroup check className="mb-3">
                      <Label check>
                        <Input
                          type="checkbox"
                          checked={isReturn}
                          onChange={(e) => setIsReturn(e.target.checked)}
                        />{' '}
                        Return
                      </Label>
                    </FormGroup>
                  </>
                );

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
        </div>
        <div className="ord-modal-foot ord-modal-foot--sm">
          <button type="button" className="ord-btn ord-btn--primary" onClick={addProductOrder}>
            Change product info
          </button>
        </div>
      </div>
    </div>
  );
});
export default OrderProductCardInfoModal;
