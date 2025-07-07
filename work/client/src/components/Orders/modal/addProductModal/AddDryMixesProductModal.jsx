import React, { useCallback, useEffect, useMemo } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useOrderContext } from '../../../contexts/OrderContext';
import InputField from '#components/InputField/InputField.jsx';
import Table from '#components/Table/Table.jsx';
import { getUpdateDryMixedProductOfOrders } from '#components/redux/actions/ordersAction.js';
import { useDispatch } from 'react-redux';
import '#components/Styles/modals.css';
import { useProductsTypeJournalContext } from '#components/contexts/ProductsTypeJournalContext.js';

const AddDryMixesProductModal = React.memo(({ isOpen, toggle }) => {
  const {
    COLUMNS_ORDER_DRY_MIXES,
    productOfOrder,
    setProductOfOrder,
    setSelectedProduct,
    selectedProduct,
    newOrder,
    list_of_orders,
  } = useOrderContext();

  const { COLUMNS_DRY_MIXED_PRODUCT, latestDryMix } =
    useProductsTypeJournalContext();

  const dispatch = useDispatch();

  const haveProduct = useMemo(
    () => selectedProduct?.id ?? false,
    [selectedProduct?.id]
  );

  const haveOrderClient = list_of_orders.find(
    (el) => el.article === newOrder.article
  );

  const handlerAddProductOrder = useCallback((row) => {
    const product = latestDryMix.find((el) => el.id === row.original.id);

    setSelectedProduct(product);
    setProductOfOrder((prev) => ({
      ...prev,
      dry_mixed_article: row.original.article,
      dry_mixed_id: product?.id,
    }));
  }, []);

  const handleProductListOrderChange = (e) => {
    setProductOfOrder((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const quantity_palet_value = useMemo(() => {
    if (!selectedProduct) return;
    if (!productOfOrder?.quantity_ud) productOfOrder.quantity_ud = 0;
    const result = Math.ceil(
      productOfOrder?.quantity_ud / (selectedProduct?.units_per_pallet || 1)
    );

    setProductOfOrder((prev) => ({
      ...prev,
      quantity_palet_dry: result,
    }));
    return result;
  }, [productOfOrder.quantity_ud, selectedProduct?.units_per_pallet]);

  const quantity_real_value = useMemo(() => {
    const result = Math.ceil(
      quantity_palet_value * (selectedProduct?.units_per_pallet || 1)
    );

    setProductOfOrder((prev) => ({
      ...prev,
      quantity_real_ud: result,
    }));
    return result;
  }, [quantity_palet_value, selectedProduct?.m2]);

  const total_value = useMemo(() => {
    const result = quantity_palet_value * selectedProduct?.units_per_pallet;

    setProductOfOrder((prev) => ({
      ...prev,
      total: result.toFixed(2),
    }));
    return result.toFixed(2);
  }, [quantity_palet_value, selectedProduct?.units_per_pallet]);

  const final_price_value = useMemo(() => {
    const discount = productOfOrder?.discount ?? 0;

    const result =
      (selectedProduct?.price_per_unit *
        quantity_real_value *
        Math.abs(100 - discount)) /
      100;

    setProductOfOrder((prev) => ({
      ...prev,
      final_price: result.toFixed(2),
    }));
    return result.toFixed(2);
  }, [
    selectedProduct?.price_per_unit,
    quantity_real_value,
    productOfOrder?.discount,
  ]);

  const pvp_value = useMemo(() => {
    const result = total_value > 1 ? final_price_value / total_value : 0;

    console.log('pvp_value', result.toFixed(2));

    setProductOfOrder((prev) => ({
      ...prev,
      pvp: result.toFixed(2),
    }));
    return result.toFixed(2);
  }, [final_price_value, total_value]);

  const addProductOrder = async () => {
    if (haveOrderClient) {
      const newDryMixedProductsOfOrder = {
        order_id: haveOrderClient.id,
        productOfOrder,
      };
      dispatch(getUpdateDryMixedProductOfOrders(newDryMixedProductsOfOrder));
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
  }, [productOfOrder?.discount]);

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
            <p>Select dry mixes product</p>
          )}
        </ModalHeader>
        <ModalBody>
          {haveProduct ? (
            <>
              {COLUMNS_ORDER_DRY_MIXES?.map((el) => {
                if (el.accessor === 'dry_mixed_id') return null;
                if (el.accessor === 'dry_mixed_article')
                  return (
                    <>
                      <ModalBody>{el.Header}:</ModalBody>
                      <input
                        type="text"
                        id={el.accessor}
                        name={el.accessor}
                        value={productOfOrder[el.accessor] || ''}
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
                if (el.accessor === 'quantity_real_ud')
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
          ) : (
            <>
              <Table
                COLUMN_DATA={COLUMNS_DRY_MIXED_PRODUCT}
                dataOfTable={latestDryMix.filter(
                  (product) => product.active_status === true
                )}
                // userAccess={userAccess}
                onClickButton={() => {}}
                buttonText={''}
                tableName={'Dry mixes journal'}
                handleRowClick={(row) => {
                  handlerAddProductOrder(row);
                }}
              />
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <button onClick={addProductOrder}>Add dry product</button>
        </ModalFooter>
      </Modal>
    </div>
  );
});
export default AddDryMixesProductModal;
