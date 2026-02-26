import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { useProjectContext } from '#components/contexts/Context.js';
import { useDispatch } from 'react-redux';
import {
  addNewDimensionsQuality,
  updateDimensionsQuality,
} from '#components/redux/actions/productionQualityAction.js';

const DimensionTestModal = ({ show, onHide, selectedBatch }) => {
  const { extractProductTitle, latestProducts } = useProductsContext();
  const { setModalProductionQuality } = useModalContext();
  const { dimensions_quality } = useProjectContext();

  const { batch_id = '', date = '', quantity = 21 } = selectedBatch || {};
  const [rows, setRows] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (show) {
      const product = latestProducts.find(
        (el) => el.article === selectedBatch?.product_article,
      );
      const product_type = extractProductTitle(product?.description);
      const regex = /(\d+)\s*x\s*(\d+)\s*x\s*(\d+)/;
      const match = product?.description?.match(regex);
      const product_size = match ? `${match[1]}x${match[2]}x${match[3]}` : '';

      const numGroups = Math.ceil((quantity || 21) / 7);

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

      const newRows = [];
      for (let i = 0; i < numGroups; i++) {
        newRows.push({
          ...emptyRow,
          cake_start: (i * 7 + 1).toString(),
        });
      }

      if (dimensions_quality?.length > 0 && selectedBatch?.batch_id) {
        const updatedRows = newRows.map((row) => ({ ...row }));

        dimensions_quality.forEach((record) => {
          if (String(record.batch_id) !== String(selectedBatch.batch_id)) return;

          const groupIndex = record.sub_lote_id - 1;
          if (groupIndex < 0 || groupIndex >= numGroups) return;

          const group = updatedRows[groupIndex];
          group.largo = [
            record.largo_1 || '',
            record.largo_2 || '',
            record.largo_3 || '',
            record.largo_4 || '',
          ];
          group.ancho = [
            record.ancho_1 || '',
            record.ancho_2 || '',
            record.ancho_3 || '',
            record.ancho_4 || '',
          ];
          group.altura = [
            record.altura_1 || '',
            record.altura_2 || '',
            record.altura_3 || '',
            record.altura_4 || '',
          ];
          group.paralelismoMedida = [
            record.support_face_parallelism_1 || '',
            record.support_face_parallelism_2 || '',
            record.support_face_parallelism_3 || '',
            record.support_face_parallelism_4 || '',
          ];
          group.planeidadDiagonal = [
            record.diagonal_1 || '',
            record.diagonal_2 || '',
            record.diagonal_3 || '',
            record.diagonal_4 || '',
          ];
          group.planeidadMedida = [
            record.flatness_1 || '',
            record.flatness_2 || '',
            record.flatness_3 || '',
            record.flatness_4 || '',
          ];
          group.angulo = [
            record.angle_90_1 || '',
            record.angle_90_2 || '',
            record.angle_90_3 || '',
            record.angle_90_4 || '',
          ];
        });
        setRows(updatedRows);
      } else {
        setRows(newRows);
      }
    }
  }, [show, selectedBatch, dimensions_quality]);

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
    const dim_test_arr = [];
    const filteredData = rows.filter(
      (el) =>
        el.altura.length > 0 &&
        el.ancho.length > 0 &&
        el.angulo.length > 0 &&
        el.largo.length > 0 &&
        el.paralelismoMedida.length > 0 &&
        el.planeidadDiagonal.length > 0 &&
        el.planeidadMedida.length > 0,
    );

    for (let i = 0; i < filteredData.length; i++) {
      const {
        altura,
        ancho,
        angulo,
        largo,
        paralelismoMedida,
        planeidadDiagonal,
        planeidadMedida,
      } = filteredData[i];

      const result = {
        batch_id,
        sub_lote_id: i + 1,
        largo_1: largo[0],
        largo_2: largo[1],
        largo_3: largo[2],
        largo_4: largo[3],
        ancho_1: ancho[0],
        ancho_2: ancho[1],
        ancho_3: ancho[2],
        ancho_4: ancho[3],
        altura_1: altura[0],
        altura_2: altura[1],
        altura_3: altura[2],
        altura_4: altura[3],
        support_face_parallelism_1: paralelismoMedida[0],
        support_face_parallelism_2: paralelismoMedida[1],
        support_face_parallelism_3: paralelismoMedida[2],
        support_face_parallelism_4: paralelismoMedida[3],
        diagonal_1: planeidadDiagonal[0],
        diagonal_2: planeidadDiagonal[1],
        diagonal_3: planeidadDiagonal[2],
        diagonal_4: planeidadDiagonal[3],
        flatness_1: planeidadMedida[0],
        flatness_2: planeidadMedida[1],
        flatness_3: planeidadMedida[2],
        flatness_4: planeidadMedida[3],
        angle_90_1: angulo[0],
        angle_90_2: angulo[1],
        angle_90_3: angulo[2],
        angle_90_4: angulo[3],
      };
      dim_test_arr.push(result);
    }

    const add_arr = [];
    const upd_arr = [];

    for (const el of dim_test_arr) {
      const { batch_id, sub_lote_id } = el;

      const need_upd = dimensions_quality.find(
        (cp) => cp.batch_id == batch_id && cp.sub_lote_id == sub_lote_id,
      );

      if (need_upd) {
        upd_arr.push(el);
      } else {
        add_arr.push(el);
      }
    }

    console.log('upd_arr DimensionsTestModal.jsx line 300', upd_arr);
    console.log('add_arr DimensionsTestModal.jsx line 301', add_arr);
    if (upd_arr.length > 0) dispatch(updateDimensionsQuality(upd_arr));
    if (add_arr.length > 0) dispatch(addNewDimensionsQuality(add_arr));

    // console.log('dim_test_arr DimensionsTestModal.jsx line 210', dim_test_arr);

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
                <th colSpan={2}></th> <th colSpan={2}></th>
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
                      className="mb-1"
                      readOnly
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
