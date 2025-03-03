import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import {
  deleteBatchOutside,
  updateBatchOutside,
} from '#components/redux/actions/batchOutsideAction.js';
import { updateOrderStatus } from '#components/redux/actions/ordersAction.js';
import { deleteMaterialPlan } from '#components/redux/actions/recipeAction.js';
import {
  addNewReservedProducts,
  addNewWarehouse,
  updateRemainingStock,
  updListOfOrderedProductionOEM,
} from '#components/redux/actions/warehouseAction.js';
import React, { useCallback, useState } from 'react';
import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { useDispatch } from 'react-redux';

function BatchOutsideModal(props) {
  const { latestProducts } = useProductsContext();
  const { list_of_orders, productsOfOrders } = useOrderContext();
  const {
    currentBatch,
    currentBatchId,
    warehouse_data,
    listOfOrderedCakes,
    currentOrderedProducts,
    list_of_ordered_production_oem,
  } = useWarehouseContext();

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
  const [autoSave, setAutoSave] = useState(false);

  const getWarehouseArticle = (product, type, versionNumber) => {
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const day = new Date().getDate();

    const certificate = product?.certificate.slice(0, 1);
    const density = product?.density.toString().slice(0, 1);

    const warehouseArticle = `S${type}0${certificate}${density}${year}${month}${day}${versionNumber}`;

    return warehouseArticle;
  };

  const handleBatchOutsideInfoInputChange = useCallback((e) => {
    setBatchOutsideInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const checkInput = async () => {
    const { quality_product } = batchOutsideInput;
    const product = latestProducts.find(
      (el) => el.id === currentOrderedProducts?.id
    );

    let versionNumber = '0001';
    let incVersion = 1;
    let ok = false;
    if (quality_product) {
      console.log('log', currentBatch.quantity_pallets - quality_product <= currentBatch.quantity_free);
      if (currentBatch.quantity_pallets - quality_product <= currentBatch.quantity_free)
        await dispatch(deleteBatchOutside(currentBatchId));
      const type = 0;
      const articleId =
        warehouse_data.length === 0 ? 1 : warehouse_data.length + incVersion++;

      versionNumber = `0000000${articleId}`.slice(-6);
      const warehouse_article = getWarehouseArticle(product, type, versionNumber);

      await dispatch(
        addNewWarehouse({
          product_article: product.article,
          article: warehouse_article,
          warehouse_loc: 'local',
          remaining_stock: quality_product,
          type: 'OK',
        })
      );
    }
    if (batchOutsideInput.remnants) {
      const type = 1;
      const articleId =
        warehouse_data.length === 0 ? 1 : warehouse_data.length + incVersion++;
      versionNumber = `0000000${articleId}`.slice(-6);
      const warehouse_article = getWarehouseArticle(product, type, versionNumber);

      await dispatch(
        addNewWarehouse({
          product_article: product.article,
          article: warehouse_article,
          warehouse_loc: 'local',
          remaining_stock: batchOutsideInput.remnants,
          type: 'Remnants',
        })
      );
    }
    setAutoSave(true);

    if (ok) {
      await dispatch(deleteBatchOutside(currentBatchId));
    }
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    checkInput();

    props.onHide();
  };

  useEffect(() => {
    if (!autoSave) return;
    const { quality_product } = batchOutsideInput;

    if (currentBatch?.id_list_of_ordered_production) {
      const { order_article, product_article, id } = currentOrderedProducts;

      const warehouse = warehouse_data.find(
        (el) => el.product_article === product_article && el.remaining_stock !== 0
      );


      const order_id = list_of_orders.find(
        (order) => order.article === order_article
      )?.id;

      const product_id = latestProducts.find(
        (product) => product.article === product_article
      )?.id;

      const productsOfOrders_id = productsOfOrders.find(
        (elem) => elem.order_id === order_id && elem.product_id === product_id
      )?.id;

      const order_not_reserved = listOfOrderedCakes?.find((el) => el.id == id);
      let result;

      if (order_not_reserved) {
        const { quantity, quantity_in_warehouse } = order_not_reserved;

        const needReserved = quantity - quantity_in_warehouse;
        result = quality_product <= needReserved ? quality_product : needReserved;
      } else {
        result = quality_product;
      }

      dispatch(
        addNewReservedProducts({
          warehouse_id: warehouse?.id,
          orders_products_id: productsOfOrders_id,
          quantity: result,
        })
      );

      if (order_not_reserved) {
        const stock = warehouse?.remaining_stock - result;
        const new_remaining_stock = stock > 0 ? stock : 0;

        dispatch(
          updateRemainingStock({ warehouse_id: warehouse?.id, new_remaining_stock })
        );
      }

      if (
        latestProducts.find((el) => el.article === product_article)
          ?.placeOfProduction !== 'Spain'
      ) {
        const list_of_order_oem_id = list_of_ordered_production_oem.find(
          (el) =>
            el.order_article === order_article &&
            el.product_article === product_article
        );
        if (list_of_order_oem_id) {
          dispatch(
            updListOfOrderedProductionOEM({
              id: list_of_order_oem_id.id,
              status: 'Reserved',
            })
          );
        }
      }
    }

    const new_quantity_pallets = currentBatch.quantity_pallets - quality_product;

    dispatch(
      updateBatchOutside({
        ...currentBatch,
        quantity_pallets: new_quantity_pallets <= 0 ? 0 : new_quantity_pallets,
      })
    );
    setAutoSave(false);
    setBatchOutsideInput({});
  }, [warehouse_data]);

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
