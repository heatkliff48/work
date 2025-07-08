import React, { useEffect, useMemo } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useOrderContext } from '../../contexts/OrderContext';
import InputField from '#components/InputField/InputField.jsx';
import {
  getUpdateProductInfoOfOrders,
  getUpdateAnchorProductsInfoOfOrder,
  getUpdateDryMixedProductsInfoOfOrder,
  getUpdateRelMatProductsInfoOfOrder,
  getUpdateToolProductsInfoOfOrder,
} from '#components/redux/actions/ordersAction.js';
import { useDispatch } from 'react-redux';

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
  } = useOrderContext();

  const dispatch = useDispatch();

  const handleProductListOrderChange = (e) => {
    setProductOfOrder((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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

  const quantity_palet_value = useMemo(() => {
    if (!selectedProduct) return;
    if (!productOfOrder?.quantity_m2) productOfOrder.quantity_m2 = 0;

    if (selectedProduct.article.slice(2, 3) == 'N') {
      const result = Math.ceil(
        productOfOrder?.quantity_m2 / (selectedProduct?.m2 || 1)
      );

      setProductOfOrder((prev) => ({
        ...prev,
        quantity_palet: result,
      }));
      return result;
    } else if (selectedProduct.article.slice(2, 3) == 'M') {
      const result = Math.ceil(
        productOfOrder?.quantity_ud / (selectedProduct?.units_per_pallet || 1)
      );

      setProductOfOrder((prev) => ({
        ...prev,
        quantity_palet_dry: result,
      }));
      return result;
    } else if (selectedProduct.article.slice(2, 3) == 'F') {
      const result = Math.ceil(
        productOfOrder?.quantity_ud / (pieces_per_pallet || 1)
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
      const result = Math.ceil(quantity_palet_value * (selectedProduct?.m2 || 1));

      setProductOfOrder((prev) => ({
        ...prev,
        quantity_real: result,
      }));
      return result;
    } else if (selectedProduct.article.slice(2, 3) == 'M') {
      const result = Math.ceil(
        quantity_palet_value * (selectedProduct?.units_per_pallet || 1)
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
        selectedProduct.article.slice(2, 3) == 'N' ? result : productOfOrder?.pvp,
    }));
    return result;
  }, [
    selectedProduct?.price,
    selectedProduct?.m2,
    selectedProduct?.volumeBlockOnPallet,
  ]);

  const final_price_value = useMemo(() => {
    const discount = productOfOrder?.discount ?? 0;
    const result =
      selectedProduct.article.slice(2, 3) == 'N'
        ? (price_m2_value * quantity_real_value * (100 - discount)) / 100
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

    setProductOfOrder((prev) => ({
      ...prev,
      final_price: result,
    }));
    return result;
  }, [
    price_m2_value,
    quantity_real_value,
    productOfOrder?.discount,
    selectedProduct?.price_per_unit,
    productOfOrder?.quantity_ud,
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
    console.log('productOfOrder', productOfOrder);
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

  // useEffect(() => {
  //   console.log('productOfOrder', productOfOrder);
  // }, [productOfOrder]);

  return (
    <div>
      <Modal
        isOpen={isOpen}
        toggle={() => {
          toggle();
          setProductOfOrder({});
          setSelectedProduct({});
        }}
      >
        <ModalHeader
          toggle={() => {
            toggle();
            setProductOfOrder({});
            setSelectedProduct({});
          }}
        >
          <p>Fill in the remaining parameters</p>
        </ModalHeader>
        <ModalBody>
          <>
            {COLUMNS_ORDER?.map((el) => {
              if (el.accessor === 'product_id') return null;
              if (
                el.accessor === 'product_article' ||
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
                      value={productOfOrder.product_article || ''}
                      readOnly
                    />
                  </>
                );
              if (
                el.accessor === 'quantity_palet' ||
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
        </ModalBody>
        <ModalFooter>
          <button onClick={addProductOrder}>Add product</button>
        </ModalFooter>
      </Modal>
    </div>
  );
});
export default OrderProductCardInfoModal;
