import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useModalContext } from '#components/contexts/ModalContext.js';

const DimensionTestModal = ({ show, onHide, selectedBatch }) => {
  const { extractProductTitle, latestProducts } = useProductsContext();
  const { setModalProductionQuality } = useModalContext();
  const { batch_id = '', date = '' } = selectedBatch || {};
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (show) {
      const product = latestProducts.find(
        (el) => el.article === selectedBatch?.product_article,
      );
      const product_type = extractProductTitle(product?.description);
      const regex = /(\d+)\s*x\s*(\d+)\s*x\s*(\d+)/;
      const match = product?.description?.match(regex);
      const product_size = match ? `${match[1]}x${match[2]}x${match[3]}` : '';

      const emptyRow = {
        cake_start: '',
        product_type,
        product_size,
        largo: [],
        ancho: [],
        altura: [],
        paralelismoMedida: [],
        planeidadDiagonal: [],
        planeidadMedida: [],
        angulo: ['', '', '', ''],
      };

      setRows([emptyRow, emptyRow, emptyRow]);
    }
  }, [show]);

  const average = (arr) => {
    if (!arr || arr.length === 0) return '0.00';
    const valid = arr.filter((v) => !isNaN(parseFloat(v)) && isFinite(v));
    return valid.length
      ? (valid.reduce((a, b) => a + parseFloat(b), 0) / valid.length).toFixed(2)
      : '0.00';
  };

  const max = (arr) => {
    const valid = arr.filter((v) => !isNaN(v)).map(Number);
    return valid.length ? Math.max(...valid).toFixed(2) : '0.00';
  };

  const min = (arr) => {
    const valid = arr.filter((v) => !isNaN(v)).map(Number);
    return valid.length ? Math.min(...valid).toFixed(2) : '0.00';
  };

  const deviation = (arr) => {
    const valid = arr.filter((v) => !isNaN(v)).map(Number);
    return valid.length
      ? (Math.max(...valid) - Math.min(...valid)).toFixed(2)
      : '0.00';
  };

  const avgTop = (arr) => {
    if (!arr || arr.length < 2) return '0.00';
    const topTwo = arr
      .slice(0, 2)
      .filter((v) => !isNaN(v))
      .map(Number);
    return topTwo.length
      ? (topTwo.reduce((a, b) => a + b, 0) / topTwo.length).toFixed(2)
      : '0.00';
  };

  const avgBottom = (arr) => {
    if (!arr || arr.length < 2) return '0.00';
    const bottomTwo = arr
      .slice(2, 4)
      .filter((v) => !isNaN(v))
      .map(Number);
    return bottomTwo.length
      ? (bottomTwo.reduce((a, b) => a + b, 0) / bottomTwo.length).toFixed(2)
      : '0.00';
  };

  const handleInputChange = (rowIndex, fieldPath, value) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      const updatedRow = { ...updatedRows[rowIndex] };

      const pathParts = fieldPath.split('[');
      if (pathParts.length === 1) {
        updatedRow[fieldPath] = value;
      } else {
        const arrayName = pathParts[0];
        const index = parseInt(pathParts[1].replace(']', ''), 10);
        if (!updatedRow[arrayName]) updatedRow[arrayName] = [];
        const newArray = [...updatedRow[arrayName]];
        newArray[index] = value;
        updatedRow[arrayName] = newArray;
      }

      updatedRows[rowIndex] = updatedRow;
      return updatedRows;
    });
  };

  const renderFourInputs = (rowIndex, fieldName, values = []) => (
    <div style={{ minWidth: '100px' }}>
      {[0, 1, 2, 3].map((idx) => (
        <Form.Control
          key={idx}
          type="number"
          step="0.1"
          size="sm"
          value={values[idx] || ''}
          onChange={(e) =>
            handleInputChange(rowIndex, `${fieldName}[${idx}]`, e.target.value)
          }
          className="mb-1"
          style={{ width: '100%' }}
        />
      ))}
    </div>
  );

  const renderDimensionCell = (rowIndex, fieldName, values) => (
    <>
      <td>{renderFourInputs(rowIndex, fieldName, values)}</td>
      <td className="text-center align-middle fw-bold">{average(values)}</td>
    </>
  );

  const renderPlaneidadCell = (rowIndex, fieldName, values) => (
    <>
      <td>{renderFourInputs(rowIndex, fieldName, values)}</td>
      <td className="text-center align-middle">
        <div>top {avgTop(values)}</div>
        <div>bottom {avgBottom(values)}</div>
      </td>
    </>
  );

  const handleSave = () => {
    console.log('Saved rows:', rows);
    setModalProductionQuality(false);
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      dialogClassName="modal-90w"
    >
      <Modal.Header closeButton>
        <Modal.Title>Таблица измерений партии</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ overflowX: 'auto' }}>
          <Table bordered striped hover size="sm" className="align-middle">
            <thead>
              <tr>
                <th rowSpan={3}>Fecha de producción & Nº de lote</th>
                <th rowSpan={3}>ID de torta, producto & tamaño</th>
                <th colSpan={2}>Largo</th>
                <th colSpan={2}>Ancho</th>
                <th colSpan={2}>Altura</th>
                <th colSpan={3}>Paralelismo de las caras de apoyo</th>
                <th colSpan={4}>Planeidad de las caras de apoyo</th>
                <th rowSpan={3}>Angulo de 90°</th>
              </tr>
              <tr>
                <th colSpan={2}></th>{' '}
                <th colSpan={2}></th>
                <th colSpan={2}></th>
                <th colSpan={3}></th>
                <th colSpan={2}>Diagonal</th>
                <th colSpan={2}>Planeidad</th>
              </tr>
              <tr>
                <th>Medida</th>
                <th>Media</th>
                <th>Medida</th>
                <th>Media</th>
                <th>Medida</th>
                <th>Media</th>
                <th>Medida</th>
                <th>max/min</th>
                <th>Desviación</th>
                <th>Medida</th>
                <th>Media</th>
                <th>Medida</th>
                <th>Media</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td>
                    <div>{date}</div>
                    <div>Batch id: {batch_id}</div>
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      size="sm"
                      value={row.cake_start || ''}
                      onChange={(e) =>
                        handleInputChange(rowIndex, 'cake_start', e.target.value)
                      }
                      placeholder="ID (cake_start)"
                      className="mb-1"
                    />
                    <Form.Control
                      type="text"
                      size="sm"
                      value={row.product_type || ''}
                      className="mb-1"
                      readOnly
                    />
                    <Form.Control
                      type="text"
                      size="sm"
                      value={row.product_size || ''}
                      readOnly
                    />
                  </td>

                  {renderDimensionCell(rowIndex, 'largo', row.largo)}
                  {renderDimensionCell(rowIndex, 'ancho', row.ancho)}
                  {renderDimensionCell(rowIndex, 'altura', row.altura)}

                  <td>
                    {renderFourInputs(
                      rowIndex,
                      'paralelismoMedida',
                      row.paralelismoMedida,
                    )}
                  </td>
                  <td>
                    <div className="text-center">
                      <div className="fw-bold">
                        max {max(row.paralelismoMedida || [])}
                      </div>
                      <div className="fw-bold">
                        min {min(row.paralelismoMedida || [])}
                      </div>
                    </div>
                  </td>
                  <td className="text-center fw-bold">
                    {deviation(row.paralelismoMedida || [])}
                  </td>

                  {renderPlaneidadCell(
                    rowIndex,
                    'planeidadDiagonal',
                    row.planeidadDiagonal,
                  )}
                  {renderPlaneidadCell(
                    rowIndex,
                    'planeidadMedida',
                    row.planeidadMedida,
                  )}

                  <td>
                    {[0, 1, 2, 3].map((idx) => (
                      <Form.Control
                        key={idx}
                        type="text"
                        size="sm"
                        value={row.angulo?.[idx] || ''}
                        onChange={(e) =>
                          handleInputChange(
                            rowIndex,
                            `angulo[${idx}]`,
                            e.target.value,
                          )
                        }
                        className="mb-1"
                        style={{ width: '100%' }}
                      />
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Сохранить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DimensionTestModal;
