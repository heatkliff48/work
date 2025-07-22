import React, { useCallback, useEffect, useMemo } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useOrderContext } from '../../../contexts/OrderContext';
import InputField from '#components/InputField/InputField.jsx';
import Table from '#components/Table/Table.jsx';
import { getUpdateRelMatProductOfOrders } from '#components/redux/actions/ordersAction.js';
import { useDispatch } from 'react-redux';
import '#components/Styles/modals.css';
import { useProductsTypeJournalContext } from '#components/contexts/ProductsTypeJournalContext.js';

const AddRelatedMaterialProductModal = React.memo(({ isOpen, toggle }) => {
  const {
    COLUMNS_ORDER_RELATED_MATERIAL,
    productOfOrder,
    setProductOfOrder,
    setSelectedProduct,
    selectedProduct,
    newOrder,
    list_of_orders,
  } = useOrderContext();

  const { COLUMNS_RELATED_MATERIALS_JOURNAL, latestRelatedMaterials } =
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
    const product = latestRelatedMaterials.find((el) => el.id === row.original.id);

    setSelectedProduct(product);
    setProductOfOrder((prev) => ({
      ...prev,
      rel_mat_article: row.original.article,
      rel_mat_id: product?.id,
    }));
  }, []);

  const handleProductListOrderChange = (e) => {
    setProductOfOrder((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const total_value = useMemo(() => {
    const result = productOfOrder.quantity_ud;

    setProductOfOrder((prev) => ({
      ...prev,
      total: result,
    }));
    return result;
  }, [productOfOrder.quantity_ud, selectedProduct?.piece_weight]);

  const final_price_value = useMemo(() => {
    const discount = productOfOrder?.discount ?? 0;

    const result =
      (selectedProduct?.price_per_unit *
        productOfOrder?.quantity_ud *
        Math.abs(100 - discount)) /
      100;

    setProductOfOrder((prev) => ({
      ...prev,
      final_price: result.toFixed(2),
    }));
    return result.toFixed(2);
  }, [
    selectedProduct?.price_per_unit,
    productOfOrder?.discount,
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
    if (haveOrderClient) {
      const newRelMatProductsOfOrder = {
        order_id: haveOrderClient.id,
        productOfOrder,
      };
      dispatch(getUpdateRelMatProductOfOrders(newRelMatProductsOfOrder));
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
            <p>Select Related Material product</p>
          )}
        </ModalHeader>
        <ModalBody>
          {haveProduct ? (
            <>
              {COLUMNS_ORDER_RELATED_MATERIAL?.map((el) => {
                if (el.accessor === 'rel_mat_id') return null;
                if (el.accessor === 'rel_mat_article')
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
                COLUMN_DATA={COLUMNS_RELATED_MATERIALS_JOURNAL}
                dataOfTable={latestRelatedMaterials.filter(
                  (product) => product.active_status === true
                )}
                // userAccess={userAccess}
                onClickButton={() => {}}
                buttonText={''}
                tableName={'Related Material journal'}
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
export default AddRelatedMaterialProductModal;
