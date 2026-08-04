import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { useDispatch } from 'react-redux';
import {
  addNewCompressionsQuality,
  updateCompressionsQuality,
} from '#components/redux/actions/productionQualityAction.js';
import { useProjectContext } from '#components/contexts/Context.js';

const CompressTestModal = ({ show, onHide, selectedBatch }) => {
  const { extractProductTitle, latestProducts } = useProductsContext();
  const { setModalProductionQuality } = useModalContext();
  const { compressions_quality } = useProjectContext();

  const dispatch = useDispatch();
  const [rows, setRows] = useState([]);
  const [averageInfo, setAverageInfo] = useState([]);

  const {
    batch_id = '',
    date = '',
    cakeId = '',
    quantity = 21,
  } = selectedBatch || {};

  useEffect(() => {
    if (show) {
      const product = latestProducts.find(
        (el) => el.article === selectedBatch?.product_article,
      );
      const product_type = extractProductTitle(product?.description);
      const regex = /(\d+)\s*x\s*(\d+)\s*x\s*(\d+)/;
      const match = product?.description?.match(regex);
      const product_size = match ? `${match[1]}x${match[2]}x${match[3]}` : '';

      const numGroups = Math.ceil(quantity / 7);

      const emptyRow = {
        numero: '',
        largo: '',
        ancho: '',
        alto: '',
        peso_autoclave: '',
        peso_50c: '',
        peso_105c: '',
        carga_kn: '',
      };

      const newRows = [];
      const newAverageInfos = [];
      for (let g = 0; g < numGroups; g++) {
        const group = Array.from({ length: 6 }, (_, i) => ({
          ...emptyRow,
          numero: (i + 1).toString(),
        }));
        newRows.push(group);

        newAverageInfos.push({
          cakeId: (g * 7 + 1).toString(),
          size: product_size || '',
          product: product_type || '',
          aValue: '',
        });
      }

      if (compressions_quality && compressions_quality.length > 0) {
        const updatedRows = newRows.map((group) => group.map((row) => ({ ...row })));
        const updatedAverageInfos = newAverageInfos.map((info) => ({ ...info }));

        compressions_quality.forEach((record) => {
          const groupIndex = updatedAverageInfos.findIndex(
            (info) => info.cakeId === String(record.batch_id),
          );
          if (groupIndex === -1) return;

          if (Number(record.sub_lote_id) !== groupIndex + 1) return;

          const rowIndex = updatedRows[groupIndex].findIndex(
            (row) => row.numero === String(record.dimension_id),
          );
          if (rowIndex === -1) return;

          updatedRows[groupIndex][rowIndex] = {
            ...updatedRows[groupIndex][rowIndex],
            largo: record.length || '',
            ancho: record.width || '',
            alto: record.height || '',
            peso_autoclave: record.weight_after_autoclave || '',
            peso_50c: record.weight_after_50c || '',
            peso_105c: record.weight_after_105c || '',
            carga_kn: record.load_kn || '',
          };
        });

        setRows(updatedRows);
        setAverageInfo(updatedAverageInfos);
      } else {
        setRows(newRows);
        setAverageInfo(newAverageInfos);
      }
    }
  }, [show, cakeId, compressions_quality]);

  const getHumedadAutoclave = (row) => {
    const pAuto = parseFloat(row.peso_autoclave);
    const p105 = parseFloat(row.peso_105c);
    if (isNaN(pAuto) || isNaN(p105) || p105 === 0) return '';
    return (((pAuto - p105) / p105) * 100).toFixed(1);
  };

  const getHumedad50c = (row) => {
    const p50 = parseFloat(row.peso_50c);
    const p105 = parseFloat(row.peso_105c);
    if (isNaN(p50) || isNaN(p105) || p105 === 0) return '';
    return (((p50 - p105) * 100) / p105).toFixed(0);
  };

  const getDensidad = (row) => {
    const p50 = parseFloat(row.peso_50c);
    const hum50 = parseFloat(getHumedad50c(row));
    const largo = parseFloat(row.largo);
    const ancho = parseFloat(row.ancho);
    const alto = parseFloat(row.alto);

    if (
      isNaN(p50) ||
      isNaN(hum50) ||
      isNaN(largo) ||
      isNaN(ancho) ||
      isNaN(alto) ||
      largo * ancho * alto === 0
    )
      return '';

    const volumen = (largo * ancho * alto).toFixed(2);
    const valor = ((p50 / (1 + hum50 / 100)).toFixed(2) * 1000000) / volumen;

    return valor.toFixed(1);
  };

  const getResistencia = (row) => {
    const carga = parseFloat(row.carga_kn);
    const largo = parseFloat(row.largo);
    const ancho = parseFloat(row.ancho);
    if (isNaN(carga) || isNaN(largo) || isNaN(ancho) || largo * ancho === 0)
      return '';

    return ((carga / (largo * ancho)) * 1000).toFixed(2);
  };

  const getCargaKn = (row) => {
    const carga = parseFloat(row.carga_kn);

    return carga.toFixed(2);
  };

  const handleInputChange = (groupIndex, rowIndex, field, value) => {
    setRows((prevRows) => {
      const newRows = [...prevRows];
      const updatedGroup = [...newRows[groupIndex]];
      updatedGroup[rowIndex] = { ...updatedGroup[rowIndex], [field]: value };
      newRows[groupIndex] = updatedGroup;
      return newRows;
    });
  };

  const handleAverageInfoChange = (groupIndex, field, value) => {
    setAverageInfo((prev) => {
      const newInfos = [...prev];
      newInfos[groupIndex] = { ...newInfos[groupIndex], [field]: value };
      return newInfos;
    });
  };

  const averageOfGroup = (group, getter) => {
    const values = group
      .map((row) => parseFloat(getter(row)))
      .filter((val) => !isNaN(val));
    if (values.length === 0) return '';
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return avg.toFixed(1);
  };

  const handleSave = () => {
    const groupsToSave = rows
      .map((group, gIdx) => ({
        rows: group.map((row) => ({
          ...row,
          humedad_autoclave: getHumedadAutoclave(row),
          humedad_50c: getHumedad50c(row),
          densidad: getDensidad(row),
          resistencia: getResistencia(row),
          carga_kn: getCargaKn(row),
        })),
        averageInfo: averageInfo[gIdx],
      }))
      .reduce((acc, el, i) => {
        const { rows, averageInfo } = el;
        rows.forEach((item) => {
          const {
            alto,
            ancho,
            largo,
            numero,
            peso_50c,
            peso_105c,
            peso_autoclave,
            carga_kn,
          } = item;
          if (!alto && !ancho && !largo) return;

          const obj = {
            batch_id: averageInfo.cakeId,
            sub_lote_id: i + 1,
            dimension_id: numero,
            weight_after_autoclave: peso_autoclave,
            weight_after_50c: peso_50c,
            weight_after_105c: peso_105c,
            load_kn: carga_kn,
            length: largo,
            width: ancho,
            height: alto,
          };
          acc.push(obj);
        });
        return acc;
      }, []);

    const add_arr = [];
    const upd_arr = [];

    for (const el of groupsToSave) {
      const { batch_id, sub_lote_id, dimension_id } = el;

      const need_upd = compressions_quality.find(
        (cp) =>
          cp.batch_id == batch_id &&
          cp.sub_lote_id == sub_lote_id &&
          dimension_id == cp.dimension_id,
      );

      if (need_upd) {
        upd_arr.push(el);
      } else {
        add_arr.push(el);
      }
    }

    if (upd_arr.length > 0) dispatch(updateCompressionsQuality(upd_arr));
    if (add_arr.length > 0) dispatch(addNewCompressionsQuality(add_arr));

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
        <Modal.Title>Compression Tests</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ overflowX: 'auto' }}>
          <Table bordered striped hover size="sm" className="align-middle">
            <thead>
              <tr>
                <th rowSpan={2}>FECHA PRODUCCION / N° LOTE</th>
                <th rowSpan={2}>№</th>
                <th colSpan={3}>DIMENSIONES</th>
                <th rowSpan={2}>PESO DESPUES DEL AUTOCLAVE, g</th>
                <th rowSpan={2}>PESO DESPUES DE 50°C, g</th>
                <th rowSpan={2}>PESO DESPUES DE 105°C, g</th>
                <th rowSpan={2}>HUMEDAD DESPUES DEL AUTOCLAVE, %</th>
                <th rowSpan={2}>HUMEDAD DESPUES DE 50°C, %</th>
                <th rowSpan={2}>DENSIDAD, kg/m³</th>
                <th rowSpan={2}>CARGA, kN</th>
                <th rowSpan={2}>RESISTENCIA A LA COMPRESIÓN, N/mm²</th>
                <th rowSpan={2}>INFORMACIÓN ADICIONAL</th>
              </tr>
              <tr>
                <th>LARGO, mm</th>
                <th>ANCHO, mm</th>
                <th>ALTO, mm</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((group, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  {group.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td>
                        {rowIndex === 0 ? (
                          <div>
                            {groupIndex === 0 && ( // MODIFIED: только для первой группы показываем дату и batch_id
                              <>
                                {date}
                                <br />
                                Batch id: {batch_id}
                                <br />
                              </>
                            )}
                            Cake ID: {averageInfo[groupIndex]?.cakeId}
                          </div>
                        ) : (
                          ''
                        )}
                      </td>
                      <td className="text-center">{row.numero}</td>
                      <td>
                        <Form.Control
                          type="number"
                          step="0.01"
                          size="sm"
                          value={row.largo}
                          onChange={(e) =>
                            handleInputChange(
                              groupIndex,
                              rowIndex,
                              'largo',
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          step="0.01"
                          size="sm"
                          value={row.ancho}
                          onChange={(e) =>
                            handleInputChange(
                              groupIndex,
                              rowIndex,
                              'ancho',
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          step="0.01"
                          size="sm"
                          value={row.alto}
                          onChange={(e) =>
                            handleInputChange(
                              groupIndex,
                              rowIndex,
                              'alto',
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          step="0.001"
                          size="sm"
                          value={row.peso_autoclave}
                          onChange={(e) =>
                            handleInputChange(
                              groupIndex,
                              rowIndex,
                              'peso_autoclave',
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          step="0.001"
                          size="sm"
                          value={row.peso_50c}
                          onChange={(e) =>
                            handleInputChange(
                              groupIndex,
                              rowIndex,
                              'peso_50c',
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          step="0.001"
                          size="sm"
                          value={row.peso_105c}
                          onChange={(e) =>
                            handleInputChange(
                              groupIndex,
                              rowIndex,
                              'peso_105c',
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="text-center align-middle">
                        {getHumedadAutoclave(row)}
                      </td>
                      <td className="text-center align-middle">
                        {getHumedad50c(row)}
                      </td>
                      <td className="text-center align-middle">
                        {getDensidad(row)}
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          step="0.001"
                          size="sm"
                          value={row.carga_kn}
                          onChange={(e) =>
                            handleInputChange(
                              groupIndex,
                              rowIndex,
                              'carga_kn',
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="text-center align-middle">
                        {getResistencia(row)}
                      </td>
                      <td className="text-center text-muted"></td>
                    </tr>
                  ))}

                  {/* MODIFIED: строка средних значений для группы */}
                  <tr>
                    <td>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                        }}
                      >
                        <Form.Control
                          type="text"
                          size="sm"
                          placeholder="Cake ID"
                          value={averageInfo[groupIndex]?.cakeId}
                          readOnly
                          className="bg-light"
                        />
                        <Form.Control
                          type="text"
                          size="sm"
                          placeholder="Size"
                          value={averageInfo[groupIndex]?.size}
                          readOnly
                          className="bg-light"
                        />
                        <Form.Control
                          type="text"
                          size="sm"
                          placeholder="Product"
                          value={averageInfo[groupIndex]?.product}
                          readOnly
                          className="bg-light"
                        />
                      </div>
                    </td>
                    <td className="text-center fw-bold">Average</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td className="text-center align-middle fw-bold">
                      {averageOfGroup(group, getHumedadAutoclave)}
                    </td>
                    <td className="text-center align-middle fw-bold">
                      {averageOfGroup(group, getHumedad50c)}
                    </td>
                    <td className="text-center align-middle fw-bold">
                      {averageOfGroup(group, getDensidad)}
                    </td>
                    <td className="text-center align-middle fw-bold">
                      {averageOfGroup(group, getCargaKn)}
                    </td>
                    <td className="text-center align-middle fw-bold">
                      {averageOfGroup(group, getResistencia)}
                    </td>
                    <td>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                        }}
                      >
                        <Form.Control
                          type="text"
                          size="sm"
                          placeholder="A value"
                          value={averageInfo[groupIndex]?.aValue || ''}
                          onChange={(e) =>
                            handleAverageInfoChange(
                              groupIndex,
                              'aValue',
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CompressTestModal;
