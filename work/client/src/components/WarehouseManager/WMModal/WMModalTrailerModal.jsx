import { useProjectContext } from '#components/contexts/Context.js';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useCallback, useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

function WMModalTrailerModal({ trailer_order }) {
  const { orderCartData, setOrderCartData, list_of_orders, filterKeysOrder } =
    useOrderContext();
  const { wmmodalTrailerModal, setwmmodalTrailerModal } = useModalContext();
  const { displayNames } = useProjectContext();

  const [trailers, setTrailers] = useState([
    {
      trailer: 1,
      fecha: '',
      products: {},
    },
  ]);

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

      if (day > 31) {
        digits = `31${digits.slice(2)}`;
      }

      if (day === 0) {
        digits = `01${digits.slice(2)}`;
      }
    }

    if (digits.length >= 4) {
      const month = Number(digits.slice(2, 4));

      if (month > 12) {
        digits = digits.slice(0, 2) + '12' + digits.slice(4);
      }

      if (month === 0) {
        digits = digits.slice(0, 2) + '01' + digits.slice(4);
      }
    }

    if (digits.length === 8) {
      const year = Number(digits.slice(4));

      if (year < 2000) {
        digits = digits.slice(0, 4) + '2000';
      }

      if (year > 3000) {
        digits = digits.slice(0, 4) + '3000';
      }
    }

    if (digits.length <= 2) return digits;

    if (digits.length <= 4) {
      return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    }

    return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
  };

  const addTrailerRow = () => {
    const newRow = {
      trailer: trailers.length + 1,
      fecha: '',
      products: Object.fromEntries(trailer_order.map((name) => [name, ''])),
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

  const handleProductChange = (rowIndex, productName, value) => {
    setTrailers((prev) =>
      prev.map((row, i) =>
        i === rowIndex
          ? {
              ...row,
              products: {
                ...row.products,
                [productName]: value,
              },
            }
          : row,
      ),
    );
  };

  const handleTrailerSave = () => {
    console.log('trailers WMModalTrailerModal.jsx line 98', trailers);
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

              {trailer_order?.map((product) => (
                <th key={product}>{product}</th>
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
                    onChange={(e) =>
                      handleDateChange(
                        rowIndex,
                        formatAndValidateDateInput(e.target.value),
                      )
                    }
                  />
                </td>

                {trailer_order.map((product) => (
                  <td key={product}>
                    <input
                      type="number"
                      value={row.products[product] || ''}
                      onChange={(e) =>
                        handleProductChange(rowIndex, product, e.target.value)
                      }
                    />
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
          onClick={() => handleTrailerSave()}
        >
          Save
        </Button>
        <Button onClick={() => toggle()}>Close</Button>
      </ModalFooter>
    </Modal>
  );
}

export default WMModalTrailerModal;
