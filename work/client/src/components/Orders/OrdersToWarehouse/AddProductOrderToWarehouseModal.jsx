import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useOrderContext } from '#components/contexts/OrderContext';
import InputField from '#components/InputField/InputField.jsx';
import Table from '#components/Table/Table.jsx';
import { getUpdateProductOfOrders } from '#components/redux/actions/ordersAction.js';
import { useDispatch } from 'react-redux';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import '#components/Styles/modals.css';
import { useProjectContext } from '#components/contexts/Context.js';
import { addNewOrderToWarehouse } from '#components/redux/actions/orderToWarehouseAction.js';

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
  const fixed = Number(num).toFixed(decimals);
  return separator === ',' ? fixed.replace('.', ',') : fixed;
};

const AddProductOrderToWarehouseModal = React.memo(({ isOpen, toggle }) => {
  const { setSelectedProduct, list_of_orders, selectedProduct, orderCartData } =
    useOrderContext();
  const { COLUMNS, latestProducts } = useProductsContext();

  const COLUMNS_ORDERS_TO_WAREHOUSE = [
    {
      Header: 'Ref.',
      accessor: 'product_article',
      disableSortBy: true,
    },
    {
      Header: 'Description',
      accessor: 'description',
      sortType: 'string',
    },
    {
      Header: 'Quantity of pallets',
      accessor: 'quantity_pallets',
    },
    {
      Header: 'Real quantity, m2',
      accessor: 'quantity_real_m2',
    },
  ];

  const [productOfOrder, setProductOfOrder] = useState({});

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

      const description = extractProductTitle(product?.description);

      setSelectedProduct(product);
      setProductOfOrder((prev) => ({
        ...prev,
        product_article: row.original.article,
        description: description,
      }));
    },
    [latestProducts],
  );

  const handleQuantityPaletChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '');
    setProductOfOrder((prev) => ({ ...prev, quantity_pallets: digits }));
  };

  const handleQuantityPaletBlur = () => {
    const pallets = parseInt(productOfOrder.quantity_pallets, 10);

    if (!isNaN(pallets) && selectedProduct) {
      const m2PerPallet =
        // selectedProduct.form === 'U-block'
        //   ? selectedProduct.m
        //   :
        selectedProduct.m2;
      const newM2 = pallets * m2PerPallet;
      setProductOfOrder((prev) => ({
        ...prev,
        quantity_pallets: String(pallets),
        quantity_real_m2: newM2.toFixed(2),
      }));
    }
  };

  const handleTextChange = (e) => {
    setProductOfOrder((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const quantityM2Num = useMemo(
    () => parseLocalNumber(productOfOrder.quantity_real_m2) || 0,
    [productOfOrder.quantity_real_m2],
  );

  const quantity_real_m2 = useMemo(() => {
    if (!selectedProduct) return '0,00';
    const m2PerPallet =
      // selectedProduct.form === 'U-block'
      //   ? selectedProduct.m
      //   :
      selectedProduct.m2;

    const pallets = (quantityM2Num / m2PerPallet).toFixed(2);
    const real = pallets * m2PerPallet;

    return formatFixed(real, 2, ',');
  }, [quantityM2Num, selectedProduct]);

  const addProductOrder = async () => {
    const quantityM2 = parseLocalNumber(productOfOrder.quantity_real_m2) || 0;

    const payload = {
      ...productOfOrder,
      quantity_real_m2: parseFloat(quantityM2.toFixed(2)),
      quantity_pallets: parseInt(productOfOrder.quantity_pallets, 10) || 0,
    };

    console.log(
      payload,
      'payload AddProductOrderToWarehouseModal.jsx line 151',
    );

    dispatch(
      addNewOrderToWarehouse({
        ...payload,
        quantity_produced: 0,
        quantity_allocated: 0,
      }),
    );
    setProductOfOrder({});
    setSelectedProduct({});
    toggle();
  };

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
              {COLUMNS_ORDERS_TO_WAREHOUSE?.map((el) => {
                if (el.accessor === 'product_id') return null;
                if (el.accessor === 'product_article') {
                  return (
                    <React.Fragment key={el.accessor}>
                      <ModalBody>{el.Header}:</ModalBody>
                      <input
                        type="text"
                        id={el.accessor}
                        name={el.accessor}
                        value={productOfOrder.product_article || ''}
                        readOnly
                      />
                    </React.Fragment>
                  );
                }

                if (el.accessor === 'description') {
                  return (
                    <React.Fragment key={el.accessor}>
                      <ModalBody>{el.Header}:</ModalBody>
                      <input
                        type="text"
                        id={el.accessor}
                        name={el.accessor}
                        value={productOfOrder.description || ''}
                        readOnly
                      />
                    </React.Fragment>
                  );
                }

                if (el.accessor === 'quantity_real_m2') {
                  return (
                    <React.Fragment key={el.accessor}>
                      <ModalBody>{el.Header}:</ModalBody>
                      <input
                        type="text"
                        id={el.accessor}
                        name={el.accessor}
                        value={quantity_real_m2}
                        readOnly
                      />
                    </React.Fragment>
                  );
                }

                if (el.accessor === 'quantity_pallets') {
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

export default AddProductOrderToWarehouseModal;
