import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import {
  addNewReservedProducts,
  addNewWarehouse,
  updateRemainingStock,
} from '#components/redux/actions/warehouseAction.js';
import { useDispatch } from 'react-redux';
import { deleteBatchOutside } from '#components/redux/actions/batchOutsideAction.js';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { deleteMaterialPlan } from '#components/redux/actions/recipeAction.js';

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
  const { productsOfOrders, list_of_orders } = useOrderContext();
  const {
    warehouse_data,
    filteredProducts,
    setFilteredProducts,
    currentOrderedProducts,
    setCurrentOrderedProducts,
    currentBatchId,
  } = useWarehouseContext();
  const { warehouseInfoCurIdModal, setWarehouseInfoCurIdModal } = useModalContext();
  const [warehouseData, setWarehouseData] = useState({});

  const [counter, setCounter] = useState(0);

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
    const product = latestProducts.find((el) => el.id === currentOrderedProducts?.id);

    let versionNumber = '0001';
    let incVersion = 1;
    let ok = false;
    if (batchOutsideInput.quality_product) {
      dispatch(deleteMaterialPlan(currentBatchId))
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
          type: 'OK',
        })
      );
      setCounter((prev) => prev + 1);
      ok = true;
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
          type: 'Remnants',
        })
      );
      setCounter((prev) => prev + 1);
      ok = true;
    }
    if (ok) {
      // delete
      await dispatch(deleteBatchOutside(currentBatchId));
    }
  };

  // ---------------------AUTO WAREHOUSE STOCK RESERVE-----------------

  // useEffect(() => {
  //   // setWarehouseInfoCurIdModal(warehouse_data[warehouse_data.length - 1].id);

  //   // let j = 2;
  //   // for (let i = 0; i < counter; i++) {
  //   if (counter > 0) {
  //     const curr_warehouse = warehouse_data.find(
  //       (wh) => wh.id === warehouse_data[warehouse_data.length - counter].id
  //     );
  //     const { id, remaining_stock } = curr_warehouse;
  //     let remaining_stock_buff = remaining_stock;

  //     const product_id = latestProducts.find(
  //       (el) => el.article === curr_warehouse.product_article
  //     );

  //     const filteredProductsOfOrders = productsOfOrders.filter(
  //       (item) => item.product_id === product_id.id
  //     );
//filteredProductsOfOrders);

  //     const result = filteredProductsOfOrders.map((product) => {
  //       const order = list_of_orders.find((order) => order.id === product.order_id);
  //       return {
  //         productsOfOrders_id: product.id,
  //         order_article: order ? order.article : '',
  //         quantity_palet: product.quantity_palet,
  //       };
  //     });
  //     setFilteredProducts(result);

  //     result?.forEach((el) => {
  //       const { quantity_palet, productsOfOrders_id } = el;

  //       if (quantity_palet > remaining_stock_buff) {
  //         console.log(
  //           'Колличество заказной продукции превышает коллиичество продукции на складе!'
  //         );
  //         // const new_quantity_palet = quantity_palet - remaining_stock;
  //         return;
  //       }
  //       remaining_stock_buff = remaining_stock_buff - quantity_palet;

  //       dispatch(
  //         updateRemainingStock({
  //           warehouse_id: id,
  //           new_remaining_stock: remaining_stock_buff,
  //         })
  //       );

  //       dispatch(
  //         addNewReservedProducts({
  //           warehouse_id: id,
  //           orders_products_id: productsOfOrders_id,
  //           quantity: quantity_palet,
  //         })
  //       );
  //     });

  //     // --j;
  //     // if (j <= 0) {
  //     //   j = 2;
  //     setCounter(0);
  //     //   }
  //     // }
  //   }
  // }, [warehouse_data]);

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
