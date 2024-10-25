import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useCallback, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { addNewWarehouse } from '#components/redux/actions/warehouseAction.js';
import { useDispatch } from 'react-redux';
import { deleteBatchOutside } from '#components/redux/actions/batchOutsideAction.js';

function BatchOutsideModal(props) {
  const [batchOutsideInput, setBatchOutsideInput] = useState({});
  const dispatch = useDispatch();
  const batch_outside_info_table = [
    {
      Header: 'качественная продукция',
      accessor: 'quality_product',
    },
    {
      Header: 'хвосты',
      accessor: 'remnants',
    },
    {
      Header: 'некондиция',
      accessor: 'nonconditioning',
    },
    {
      Header: 'брак',
      accessor: 'discard',
    },
    {
      Header: 'не произведено',
      accessor: 'not_complete',
    },
  ];

  const { COLUMNS, latestProducts } = useProductsContext();
  const {
    warehouse_data,
    filteredProducts,
    currentOrderedProducts,
    setCurrentOrderedProducts,
    currentBatchId,
  } = useWarehouseContext();
  const [warehouseData, setWarehouseData] = useState({});

  const getWarehouseArticle = (product, type, versionNumber) => {
    // let versionNumber = '0001';
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const day = new Date().getDate();

    const certificate = product.certificate.slice(0, 1);
    const density = product.density.toString().slice(0, 1);

    // const articleId = warehouse_data.length === 0 ? 1 : warehouse_data.length + 1;
    // versionNumber = `0000000${articleId}`.slice(-6);

    const warehouseArticle = `S${type}0${certificate}${density}${year}${month}${day}${versionNumber}`;

    return warehouseArticle;
  };

  const handleBatchOutsideInfoInputChange = useCallback((e) => {
    setBatchOutsideInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const checkInput = async () => {
    const product = latestProducts.find((el) => el.id === currentOrderedProducts.id);

    let versionNumber = '0001';
    let incVersion = 1;
    let ok = false;
    if (batchOutsideInput.quality_product) {
      const type = 0;
      const articleId =
        warehouse_data.length === 0 ? 1 : warehouse_data.length + incVersion++;
      versionNumber = `0000000${articleId}`.slice(-6);
      const warehouse_article = getWarehouseArticle(product, type, versionNumber);
      await dispatch(
        addNewWarehouse({
          ...warehouseData,
          product_article: currentOrderedProducts.product_article,
          article: warehouse_article,
          warehouse_loc: 'local',
          remaining_stock: batchOutsideInput.quality_product,
        })
      );
      ok = true;
      const warehouse_data_last_id =
        warehouse_data.length === 0 ? 1 : warehouse_data.length;
      // warehouse_data[warehouse_data.length - 1].id + 1;
      console.log('warehouse_data_last_id', warehouse_data_last_id);
      // console.log('FILTERED FOR RESERVE', filteredProducts[warehouse_data_last_id]);
    }
    if (batchOutsideInput.remnants) {
      const type = 1;
      const articleId =
        warehouse_data.length === 0 ? 1 : warehouse_data.length + incVersion++;
      versionNumber = `0000000${articleId}`.slice(-6);
      const warehouse_article = getWarehouseArticle(product, type, versionNumber);
      await dispatch(
        addNewWarehouse({
          ...warehouseData,
          product_article: currentOrderedProducts.product_article,
          article: warehouse_article,
          warehouse_loc: 'local',
          remaining_stock: batchOutsideInput.remnants,
        })
      );
      ok = true;
    }
    if (ok) {
      await dispatch(deleteBatchOutside(currentBatchId));
    }
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    checkInput();

    props.onHide();
    setBatchOutsideInput({});
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dialogClassName="modal-auto-size"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Batch Modal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <form
            id="batchOutsideModal"
            className="w-full max-w-sm"
            onSubmit={(e) => {
              onSubmitForm(e);
            }}
          >
            <h3></h3>
            <Row>
              {batch_outside_info_table.map((el) => (
                <Col key={el.id}>
                  <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                      <label
                        className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                        for="version"
                      >
                        {el.Header}
                      </label>
                    </div>
                    <div className="md:w-2/3">
                      <input
                        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                        id={el.accessor}
                        name={el.accessor}
                        type="text"
                        value={batchOutsideInput[el.accessor] || ''}
                        onChange={(e) => handleBatchOutsideInfoInputChange(e)}
                      />
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <button form="batchOutsideModal">Сохранить</button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default BatchOutsideModal;
