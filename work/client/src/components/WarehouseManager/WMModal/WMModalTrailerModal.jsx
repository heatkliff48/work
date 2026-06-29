import { useProjectContext } from '#components/contexts/Context.js';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { addNewWarehouseManagerTrailer } from '#components/redux/actions/warehouseAction.js';
import { useCallback, useEffect, useState } from 'react';
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
  const { order_dispatch_data } = useWarehouseContext();

  const dispatch = useDispatch();

  const [trailers, setTrailers] = useState([]);

  useEffect(() => {
    if (!wmmodalTrailerModal) return;

    const existingItems = order_dispatch_data.filter(
      (item) => item.orderId === orderCartData?.id,
    );

    if (existingItems.length === 0) {
      setTrailers([
        {
          trailer: 1,
          fecha: '',
          products: Object.fromEntries(
            trailer_order.map((product) => [product.orderProductId, '']),
          ),
          product_table: '',
          orderId: orderCartData?.id || null,
          isExisting: false,
        },
      ]);
      return;
    }

    const grouped = existingItems.reduce((acc, item) => {
      const { trailer, fecha, orderProductId, quantity } = item;
      if (!acc[trailer]) {
        acc[trailer] = {
          trailer,
          fecha,
          products: {},
          isExisting: true,
          orderId: orderCartData?.id,
        };
      }
      acc[trailer].products[orderProductId] = quantity;
      return acc;
    }, {});

    const existingTrailers = Object.values(grouped).map((trailerObj) => {
      const fullProducts = {};
      trailer_order.forEach((product) => {
        fullProducts[product.orderProductId] =
          trailerObj.products[product.orderProductId] ?? '';
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
        trailer_order.map((product) => [product.orderProductId, '']),
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

  const formatAndValidateDateInput = (value) => {
    let digits = value.replace(/\D/g, '').slice(0, 8);

    if (digits.length >= 2) {
      const day = Number(digits.slice(0, 2));

      if (day === 0) digits = `01${digits.slice(2)}`;
    }
    if (digits.length >= 4) {
      const month = Number(digits.slice(2, 4));
      if (month > 12) digits = digits.slice(0, 2) + '12' + digits.slice(4);
      if (month === 0) digits = digits.slice(0, 2) + '01' + digits.slice(4);
    }
    if (digits.length === 8) {
      const year = Number(digits.slice(4));
      if (year < 2000) digits = digits.slice(0, 4) + '2000';
      if (year > 3000) digits = digits.slice(0, 4) + '3000';
    }

    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
  };

  const addTrailerRow = () => {
    const newRow = {
      trailer: trailers.length + 1,
      fecha: '',
      products: Object.fromEntries(
        trailer_order.map((product) => [product.orderProductId, '']),
      ),
      product_table: '',
      orderId: orderCartData?.id || null,
      isExisting: false,
    };
    setTrailers((prev) => [...prev, newRow]);
  };

  const handleDateChange = (index, value) => {
    setTrailers((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              fecha: formatAndValidateDateInput(value),
            }
          : row,
      ),
    );
  };

  const getProductTotal = (productId) => {
    const product = trailer_order.find((p) => p.orderProductId === productId);
    return product?.quantity ?? 0;
  };

  const getShippedQuantity = (productId) => {
    const orderId = orderCartData?.id;
    if (!orderId) return 0;
    return order_dispatch_data
      .filter(
        (item) => item.orderId === orderId && item.orderProductId === productId,
      )
      .reduce((sum, item) => sum + (item.quantity ?? 0), 0);
  };

  const getAvailableRemaining = (productId, excludeRowIndex = -1) => {
    const total = getProductTotal(productId);
    const shipped = getShippedQuantity(productId);
    let remaining = total - shipped;

    trailers.forEach((row, idx) => {
      if (idx === excludeRowIndex || row.isExisting) return;
      const val = Number(row.products[productId]) || 0;
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

    const result = newTrailers.flatMap((trailerRow) =>
      Object.entries(trailerRow.products)
        .filter(([_, quantity]) => quantity !== '' && Number(quantity) > 0)
        .map(([orderProductId, quantity]) => {
          const product = trailer_order.find(
            (p) => p.orderProductId === Number(orderProductId),
          );
          return {
            trailer: trailerRow.trailer,
            fecha: trailerRow.fecha,
            orderProductId: Number(orderProductId),
            quantity: Number(quantity),
            product_table: product ? product.type : null,
            orderId: trailerRow.orderId,
            title: product ? product.title : null,
            article: product ? product.article : null,
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
                <th key={product.orderProductId}>{product.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trailers.map((row, rowIndex) => (
              <tr key={row.trailer}>
                <td>{row.trailer}</td>
                <td>
                  <input
                    value={row.fecha}
                    disabled={row.isExisting}
                    onChange={(e) =>
                      handleDateChange(
                        rowIndex,
                        formatAndValidateDateInput(e.target.value),
                      )
                    }
                  />
                </td>
                {trailer_order.map((product) => (
                  <td key={product.orderProductId}>
                    <input
                      type="number"
                      value={row.products[product.orderProductId] || ''}
                      disabled={row.isExisting}
                      onChange={(e) =>
                        handleProductChange(
                          rowIndex,
                          product.orderProductId,
                          e.target.value,
                        )
                      }
                      min="0"
                      max={getAvailableRemaining(product.orderProductId, rowIndex)}
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
                        {getAvailableRemaining(product.orderProductId, rowIndex)})
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
