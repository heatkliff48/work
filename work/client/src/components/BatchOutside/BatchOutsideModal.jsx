import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { deleteBatchOutside } from '#components/redux/actions/batchOutsideAction.js';
import { deleteMaterialPlan } from '#components/redux/actions/recipeAction.js';
import {
  addNewReservedProducts,
  addNewWarehouse,
  updateRemainingStock,
} from '#components/redux/actions/warehouseAction.js';
import React, { useCallback, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { useDispatch } from 'react-redux';

function BatchOutsideModal(props) {
  const { latestProducts } = useProductsContext();
  const { list_of_orders } = useOrderContext();
  const { warehouse_data, currentOrderedProducts, currentBatchId } =
    useWarehouseContext();

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

  const [batchOutsideInput, setBatchOutsideInput] = useState({});

  const getWarehouseArticle = (product, type, versionNumber) => {
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const day = new Date().getDate();

    const certificate = product.certificate.slice(0, 1);
    const density = product.density.toString().slice(0, 1);

    const warehouseArticle = `S${type}0${certificate}${density}${year}${month}${day}${versionNumber}`;

    return warehouseArticle;
  };

  const handleBatchOutsideInfoInputChange = useCallback((e) => {
    setBatchOutsideInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const checkInput = async () => {
    const product = latestProducts.find(
      (el) => el.id === currentOrderedProducts?.id
    );

    let versionNumber = '0001';
    let incVersion = 1;
    let ok = false;
    if (batchOutsideInput.quality_product) {
      await dispatch(deleteMaterialPlan(currentBatchId));
      const type = 0;
      const articleId =
        warehouse_data.length === 0 ? 1 : warehouse_data.length + incVersion++;
      versionNumber = `0000000${articleId}`.slice(-6);
      const warehouse_article = getWarehouseArticle(product, type, versionNumber);
      await dispatch(
        addNewWarehouse({
          product_article: currentOrderedProducts.product_article,
          article: warehouse_article,
          warehouse_loc: 'local',
          remaining_stock: batchOutsideInput.quality_product,
          type: 'OK',
        })
      );
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
          product_article: currentOrderedProducts.product_article,
          article: warehouse_article,
          warehouse_loc: 'local',
          remaining_stock: batchOutsideInput.remnants,
          type: 'Remnants',
        })
      );
      ok = true;
    }
    if (ok) {
      await dispatch(deleteBatchOutside(currentBatchId));
    }
  };

  const addReservedProductHandler = () => {
    console.log('currentOrderedProducts', currentOrderedProducts);
    console.log('batchOutsideInput', batchOutsideInput);
    // const { quantity_palet, productsOfOrders_id, order_article } = res_prod;
    // const { id, remaining_stock, product_article } = warehouse;

    // if (quantity_palet > remaining_stock) {
    //   alert(
    //     'Колличество заказной продукции превышает коллиичество продукции на складе!'
    //   );
    //   return;
    // }
    // const new_remaining_stock = remaining_stock - quantity_palet;

    // dispatch(updateRemainingStock({ warehouse_id: id, new_remaining_stock }));

    // const list_of_order_id = list_of_ordered_production.find(
    //   (el) =>
    //     el.order_article === order_article && el.product_article === product_article
    // );

    // if (list_of_order_id) {
    //   const currBatchID = batchOutside.find(
    //     (el) => el.id_list_of_ordered_production === list_of_order_id.id
    //   );
    //   if (currBatchID) {
    //     dispatch(deleteBatchOutside(currBatchID.id));
    //   }
    // }

    // dispatch(
    //   addNewReservedProducts({
    //     warehouse_id: id,
    //     orders_products_id: productsOfOrders_id,
    //     quantity: quantity_palet,
    //   })
    // );

    // if (
    //   latestProducts.find((el) => el.id === warehouse.product_id)
    //     ?.placeOfProduction !== 'Spain'
    // ) {
    //   const list_of_order_oem_id = list_of_ordered_production_oem.find(
    //     (el) =>
    //       el.order_article === order_article &&
    //       el.product_article === product_article
    //   );
    //   if (list_of_order_oem_id) {
    //     dispatch(
    //       updListOfOrderedProductionOEM({
    //         id: list_of_order_oem_id.id,
    //         status: 'Reserved',
    //       })
    //     );
    //     const order_id = list_of_orders.find(
    //       (el) => el.article === order_article
    //     )?.id;
    //     dispatch(
    //       updateOrderStatus({
    //         order_id,
    //         status: 7,
    //       })
    //     );
    //   }
    // }
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    // checkInput();
    addReservedProductHandler();

    // props.onHide();
    // setBatchOutsideInput({});
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
