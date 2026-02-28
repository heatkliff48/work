import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useModalContext } from '#components/contexts/ModalContext.js';

const CompressTestModal = ({ show, onHide, selectedBatch }) => {
  const { extractProductTitle, latestProducts } = useProductsContext();
  const { setModalProductionQuality } = useModalContext();

  const [rows, setRows] = useState([]);
  const [averageInfo, setAverageInfo] = useState({
    cakeId: '',
    size: '',
    product: '',
    aValue: '',
  });

  const { batch_id = '', date = '', cakeId = '' } = selectedBatch || {};

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
        numero: '',
        largo: '',
        ancho: '',
        alto: '',
        peso_autoclave: '',
        peso_50c: '',
        peso_105c: '',
      };
      setRows(
        Array.from({ length: 6 }, (_, i) => ({
          ...emptyRow,
          numero: (i + 1).toString(),
        })),
      );
      setAverageInfo({
        cakeId: cakeId || '',
        size: product_size || '',
        product: product_type || '',
        aValue: '',
      });
    }
  }, [show, cakeId]);

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

  const handleInputChange = (rowIndex, field, value) => {
    setRows((prevRows) => {
      const newRows = [...prevRows];
      newRows[rowIndex] = { ...newRows[rowIndex], [field]: value };
      return newRows;
    });
  };

  const handleAverageInfoChange = (field, value) => {
    setAverageInfo((prev) => ({ ...prev, [field]: value }));
  };

  const averageOf = (getter) => {
    const values = rows
      .map((row) => parseFloat(getter(row)))
      .filter((val) => !isNaN(val));
    if (values.length === 0) return '';
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return avg.toFixed(1);
  };

  const handleSave = () => {
    const rowsToSave = rows.map((row) => ({
      ...row,
      humedad_autoclave: getHumedadAutoclave(row),
      humedad_50c: getHumedad50c(row),
      densidad: getDensidad(row),
      resistencia: getResistencia(row),
    }));
    console.log('Compression test data:', { rows: rowsToSave, averageInfo });
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
        <Modal.Title>Испытания на сжатие</Modal.Title>
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
              {rows.map((row, index) => (
                <tr key={index}>
                  <td>
                    {index === 0 ? (
                      <div>
                        {date}
                        <br />
                        Batch id: {batch_id}
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
                        handleInputChange(index, 'largo', e.target.value)
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
                        handleInputChange(index, 'ancho', e.target.value)
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
                        handleInputChange(index, 'alto', e.target.value)
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
                        handleInputChange(index, 'peso_autoclave', e.target.value)
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
                        handleInputChange(index, 'peso_50c', e.target.value)
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
                        handleInputChange(index, 'peso_105c', e.target.value)
                      }
                    />
                  </td>
                  <td className="text-center align-middle">
                    {getHumedadAutoclave(row)}
                  </td>
                  <td className="text-center align-middle">{getHumedad50c(row)}</td>
                  <td className="text-center align-middle">{getDensidad(row)}</td>
                  <td>
                    <Form.Control
                      type="number"
                      step="0.001"
                      size="sm"
                      value={row.carga_kn}
                      onChange={(e) =>
                        handleInputChange(index, 'carga_kn', e.target.value)
                      }
                    />
                  </td>
                  <td className="text-center align-middle">{getResistencia(row)}</td>
                  <td className="text-center text-muted"></td>
                </tr>
              ))}

              <tr>
                <td>
                  <div
                    style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
                  >
                    <Form.Control
                      type="text"
                      size="sm"
                      placeholder="Cake ID"
                      value={averageInfo.cakeId}
                      readOnly
                      className="bg-light"
                    />
                    <Form.Control
                      type="text"
                      size="sm"
                      placeholder="Size"
                      value={averageInfo.size}
                      readOnly
                      className="bg-light"
                    />
                    <Form.Control
                      type="text"
                      size="sm"
                      placeholder="Product"
                      value={averageInfo.product}
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
                  {averageOf(getHumedadAutoclave)}
                </td>
                <td className="text-center align-middle fw-bold">
                  {averageOf(getHumedad50c)}
                </td>
                <td className="text-center align-middle fw-bold">
                  {averageOf(getDensidad)}
                </td>
                <td className="text-center align-middle fw-bold">
                  {averageOf((row) => row.carga_kn)}{' '}
                </td>
                <td className="text-center align-middle fw-bold">
                  {averageOf(getResistencia)}
                </td>
                <td>
                  <div
                    style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
                  >
                    <Form.Control
                      type="text"
                      size="sm"
                      placeholder="A value"
                      value={averageInfo.aValue}
                      onChange={(e) =>
                        handleAverageInfoChange('aValue', e.target.value)
                      }
                    />
                  </div>
                </td>
              </tr>
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

export default CompressTestModal;
