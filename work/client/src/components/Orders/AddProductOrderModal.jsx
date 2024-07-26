import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useOrderContext } from '../contexts/OrderContext';
import { useProjectContext } from '#components/contexts/Context.js';
import InputField from '#components/InputField/InputField.jsx';
import Table from '#components/Table/Table.jsx';

const AddProductOrderModal = React.memo(({ isOpen, toggle }) => {
  const {
    setProductListOrder,
    COLUMNS_ORDER_PRODUCT,
    productOfOrder,
    setProductOfOrder,
  } = useOrderContext();
  const { COLUMNS, latestProducts } = useProjectContext();

  const [selectedProduct, setSelectedProduct] = useState(null);

  const haveProduct = useMemo(
    () => productOfOrder?.product_id ?? false,
    [productOfOrder?.product_id]
  );

  const handlerAddProductOrder = useCallback((row) => {
    const product = latestProducts.filter((el) => el.id === row.original.id)[0];

    setSelectedProduct(product);
    setProductOfOrder((prev) => ({ ...prev, product_id: product?.id }));
  }, []);

  const handleProductListOrderChange = (e) => {
    setProductOfOrder((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const quantity_palet_value = useMemo(() => {
    if (!productOfOrder?.quantity_m2) productOfOrder.quantity_m2 = 0;
    const result = Math.ceil(
      productOfOrder?.quantity_m2 / (selectedProduct?.m2 || 1)
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
      (selectedProduct?.price * selectedProduct?.m3) / selectedProduct?.m2;

    setProductOfOrder((prev) => ({
      ...prev,
      price_m2: result,
    }));
    return result;
  }, [selectedProduct?.price, selectedProduct?.m2, selectedProduct?.m3]);

  const final_price_value = useMemo(() => {
    const discount = productOfOrder?.discount ?? 0;
    const result = (price_m2_value * quantity_real_value * (100 - discount)) / 100;

    setProductOfOrder((prev) => ({
      ...prev,
      final_price: result,
    }));
    return result;
  }, [price_m2_value, quantity_real_value, productOfOrder?.discount]);

  const addProductInList = async () => {
    setProductOfOrder((prev) => ({
      ...prev,
      quantity_palet: quantity_palet_value,
      quantity_real: quantity_real_value,
      price_m2: price_m2_value,
      final_price: final_price_value,
    }));

    setProductListOrder((prev) => [...prev, productOfOrder]);
    console.log('PRODUCT OF ORDER', productOfOrder);
    toggle();
  };

  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>
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
                if (el.accessor === 'article') return null;
                if (el.accessor === 'product_id')
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
                dataOfTable={latestProducts}
                // userAccess={userAccess}
                onClickButton={() => {}}
                buttonText={''}
                tableName={'Orders'}
                handleRowClick={(row) => {
                  handlerAddProductOrder(row);
                }}
              />
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <button onClick={addProductInList}>Add product</button>
        </ModalFooter>
      </Modal>
    </div>
  );
});
export default AddProductOrderModal;
