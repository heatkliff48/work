import { useProjectContext } from '#components/contexts/Context.js';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { addNewWarehouseManagerTrailer } from '#components/redux/actions/warehouseAction.js';
import { useCallback, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useDispatch } from 'react-redux';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

function WMModalTrailerModal({ trailer_order }) {
  const { orderCartData, filterKeysOrder } = useOrderContext();
  const {
    wmmodalTrailerModal,
    setwmmodalTrailerModal,
    setwmmodalTrailer,
    wmmodalTrailer,
  } = useModalContext();
  const { displayNames } = useProjectContext();
  const { order_dispatch_data, normalizeProductType } = useWarehouseContext();

  const dispatch = useDispatch();

  const [trailers, setTrailers] = useState([]);

  const getProductKey = (product) =>
    `${normalizeProductType(product.type)}_${Number(product.orderProductId)}`;
  useEffect(() => {
    if (!wmmodalTrailerModal) return;

    const existingItems = order_dispatch_data.filter(
      (item) => Number(item.orderId) === Number(orderCartData?.id),
    );

    if (existingItems.length === 0) {
      setTrailers([
        {
          trailer: 1,
          fecha: '',
          products: Object.fromEntries(
            trailer_order.map((product) => [getProductKey(product), '']),
          ),
          product_table: '',
          orderId: orderCartData?.id || null,
          isExisting: false,
        },
      ]);
      return;
    }

    const grouped = existingItems.reduce((acc, dispatchItem) => {
      const trailer = Number(dispatchItem.trailer);
      const quantity = Number(dispatchItem.quantity || 0);

      if (!acc[trailer]) {
        acc[trailer] = {
          trailer,
          fecha: dispatchItem.fecha || '',
          products: {},
          isExisting: true,
          orderId: Number(dispatchItem.orderId),
        };
      }

      const productKey = `${normalizeProductType(
        dispatchItem.product_table,
      )}_${Number(dispatchItem.orderProductId)}`;

      acc[trailer].products[productKey] =
        Number(acc[trailer].products[productKey] || 0) + quantity;

      return acc;
    }, {});

    const existingTrailers = Object.values(grouped).map((trailerObj) => {
      const fullProducts = {};

      trailer_order.forEach((product) => {
        const key = getProductKey(product);

        fullProducts[key] = trailerObj.products[key] ?? '';
      });
      return {
        ...trailerObj,
        products: fullProducts,
      };
    });

    existingTrailers.sort((a, b) => a.trailer - b.trailer);

    const maxTrailer = existingTrailers.reduce(
      (max, t) => Math.max(max, t.trailer),
      0,
    );

    const newRow = {
      trailer: maxTrailer + 1,
      fecha: '',
      products: Object.fromEntries(
        trailer_order.map((product) => [getProductKey(product), '']),
      ),
      product_table: '',
      orderId: orderCartData?.id || null,
      isExisting: false,
    };

    setTrailers([...existingTrailers, newRow]);
  }, [wmmodalTrailerModal, order_dispatch_data, orderCartData?.id, trailer_order]);

  const toggle = () => {
    setwmmodalTrailerModal(!wmmodalTrailerModal);
  };

  const filterAndMapData = useCallback(
    (data, filterKeysOrder) =>
      Object.entries(data || {})
        .filter(([key]) => !filterKeysOrder.includes(key))
        .map(([key, value]) => {
          if (!key || key === 'warehouse_id') return null;

          let displayValue = value;
          if (displayValue && typeof displayValue === 'object') {
            displayValue = JSON.stringify(displayValue);
          }

          return (
            <div className="data-text" key={key}>
              <p>
                {displayNames[key] || key}: {displayValue}
              </p>
            </div>
          );
        }),
    [orderCartData],
  );

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split('.');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  };

  const formatDate = (date) => {
    if (!date || isNaN(date.getTime())) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const handleDateChange = (index, date) => {
    const formatted = formatDate(date);
    setTrailers((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              fecha: formatted,
            }
          : row,
      ),
    );
  };

  const addTrailerRow = () => {
    const newRow = {
      trailer: trailers.length + 1,
      fecha: '',
      products: Object.fromEntries(
        trailer_order.map((product) => [getProductKey(product), '']),
      ),
      product_table: '',
      orderId: orderCartData?.id || null,
      isExisting: false,
    };
    setTrailers((prev) => [...prev, newRow]);
  };

  const getProductTotal = (productKey) => {
    const product = trailer_order.find((p) => getProductKey(p) === productKey);

    return product?.quantity ?? 0;
  };

  const getPlannedQuantity = (productKey) => {
    const product = trailer_order.find((item) => getProductKey(item) === productKey);

    if (!product) return 0;

    return order_dispatch_data
      .filter(
        (item) =>
          Number(item.orderId) === Number(orderCartData?.id) &&
          Number(item.orderProductId) === Number(product.orderProductId) &&
          normalizeProductType(item.product_table) ===
            normalizeProductType(product.type),
      )
      .reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  };

  const getAvailableRemaining = (productKey, excludeRowIndex = -1) => {
    const total = getProductTotal(productKey);
    const shipped = getPlannedQuantity(productKey);
    let remaining = total - shipped;

    trailers.forEach((row, idx) => {
      if (idx === excludeRowIndex || row.isExisting) return;
      const val = Number(row.products[productKey]) || 0;
      remaining -= val;
    });

    return Math.max(remaining, 0);
  };

  const handleProductChange = (rowIndex, productName, value) => {
    if (value === '') {
      setTrailers((prev) =>
        prev.map((row, i) =>
          i === rowIndex
            ? { ...row, products: { ...row.products, [productName]: '' } }
            : row,
        ),
      );
      return;
    }

    const numValue = Number(value);
    if (isNaN(numValue)) return;

    const available = getAvailableRemaining(productName, rowIndex);
    const clampedValue = Math.min(numValue, available);
    const newValue = clampedValue.toString();

    setTrailers((prev) =>
      prev.map((row, i) =>
        i === rowIndex
          ? { ...row, products: { ...row.products, [productName]: newValue } }
          : row,
      ),
    );
  };

  const handleTrailerSave = () => {
    const newTrailers = trailers.filter((row) => !row.isExisting);

    if (newTrailers.some((el) => el.fecha == '')) {
      alert('Fecha is empty! Please, write fecha');
      return;
    }

    const result = newTrailers.flatMap((trailerRow) =>
      Object.entries(trailerRow.products)
        .filter(([_, quantity]) => quantity !== '' && Number(quantity) > 0)
        .map(([orderProductKey, quantity]) => {
          const product = trailer_order?.find(
            (p) => getProductKey(p) === orderProductKey,
          );

          if (!product) return null;

          return {
            trailer: Number(trailerRow.trailer),
            fecha: trailerRow.fecha,
            orderProductId: Number(product.orderProductId),
            quantity: Number(quantity),
            product_table: normalizeProductType(product.type),
            orderId: Number(trailerRow.orderId),
            title: product.title,
            article: product.article,
          };
        }),
    );

    if (result.length > 0) {
      dispatch(addNewWarehouseManagerTrailer(result));
    }
    toggle();
    setwmmodalTrailer(!wmmodalTrailer);
  };

  return (
    <Modal
      isOpen={wmmodalTrailerModal}
      toggle={toggle}
      size="lg"
      centered
      className="modal-auto-size"
    >
      <ModalHeader toggle={toggle}>Plan nuevo trailer</ModalHeader>

      <ModalBody>
        <h4>Order number: {orderCartData?.article}</h4>

        <div className="header-container">
          <div className="owner-info">
            <h4>Client Information</h4>
            {filterAndMapData(orderCartData?.owner, filterKeysOrder)}
          </div>
          <div className="contact-info">
            <div className="contact-text">
              <h4>Contact Person</h4>
              {filterAndMapData(orderCartData?.contactInfo, filterKeysOrder)}
            </div>
          </div>
          <div className="delivery-address">
            <h4>Delivery Address</h4>
            {filterAndMapData(orderCartData?.deliveryAddress, filterKeysOrder)}
          </div>
        </div>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Trailer</th>
              <th>Fecha</th>
              {trailer_order.map((product) => (
                <th key={getProductKey(product)}>{product.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trailers.map((row, rowIndex) => (
              <tr key={row.trailer}>
                <td>{row.trailer}</td>
                <td>
                  <DatePicker
                    selected={parseDate(row.fecha)}
                    onChange={(date) => handleDateChange(rowIndex, date)}
                    disabled={row.isExisting}
                    dateFormat="dd.MM.yyyy"
                    placeholderText="ДД.ММ.ГГГГ"
                    className="form-control"
                    style={{ width: '100%' }}
                  />
                </td>
                {trailer_order.map((product) => (
                  <td key={getProductKey(product)}>
                    <input
                      type="number"
                      value={row.products[getProductKey(product)] || ''}
                      disabled={row.isExisting}
                      onChange={(e) =>
                        handleProductChange(
                          rowIndex,
                          getProductKey(product),
                          e.target.value,
                        )
                      }
                      min="0"
                      max={getAvailableRemaining(getProductKey(product), rowIndex)}
                      style={{ width: '30%' }}
                    />
                    {!row.isExisting && (
                      <span
                        style={{
                          marginLeft: '8px',
                          fontSize: '0.9em',
                          color: '#555',
                        }}
                      >
                        (ост.:{' '}
                        {getAvailableRemaining(getProductKey(product), rowIndex)})
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td
                colSpan={2 + trailer_order.length}
                style={{
                  background: '#00ff00',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
                onClick={addTrailerRow}
              >
                +
              </td>
            </tr>
          </tbody>
        </table>
      </ModalBody>

      <ModalFooter>
        <Button
          color="success"
          style={{ marginRight: 'auto' }}
          onClick={handleTrailerSave}
        >
          Save
        </Button>
        <Button onClick={toggle}>Close</Button>
      </ModalFooter>
    </Modal>
  );
}

export default WMModalTrailerModal;
