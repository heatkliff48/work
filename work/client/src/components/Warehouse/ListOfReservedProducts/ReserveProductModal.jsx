import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { updateAutoclave } from '#components/redux/actions/autoclaveAction.js';
import { deleteBatchOutside } from '#components/redux/actions/batchOutsideAction.js';
import {
  addNewReservedProducts,
  updateRemainingStock,
  updListOfOrderedProductionOEM,
} from '#components/redux/actions/warehouseAction.js';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, ModalHeader, ModalBody, Table } from 'reactstrap';

const ReservedProductModal = ({ isOpen, toggle, warehouse }) => {
  const {
    filteredProducts,
    list_of_ordered_production,
    list_of_ordered_production_oem,
  } = useWarehouseContext();
  const { latestProducts } = useProductsContext();
  const dispatch = useDispatch();
  const batchOutside = useSelector((state) => state.batchOutside);

  const addReservedProductHandler = (res_prod) => {
    const { quantity_palet, productsOfOrders_id, order_article } = res_prod;
    const { id, remaining_stock, product_article } = warehouse;

    if (quantity_palet > remaining_stock) {
      alert(
        'Колличество заказной продукции превышает коллиичество продукции на складе!'
      );
      return;
    }
    const new_remaining_stock = remaining_stock - quantity_palet;

    dispatch(updateRemainingStock({ warehouse_id: id, new_remaining_stock }));

    const list_of_order_id = list_of_ordered_production.find(
      (el) =>
        el.order_article === order_article && el.product_article === product_article
    );
    console.log('list_of_order_id', list_of_order_id);
    if (list_of_order_id) {
      dispatch(updateAutoclave(list_of_order_id));
      const currBatchID = batchOutside.find(
        (el) => el.id_list_of_ordered_production === list_of_order_id.id
      );
      console.log('currBatchID', currBatchID?.id);
      if (currBatchID) {
        dispatch(deleteBatchOutside(currBatchID.id));
      }
    }

    dispatch(
      addNewReservedProducts({
        warehouse_id: id,
        orders_products_id: productsOfOrders_id,
        quantity: quantity_palet,
      })
    );

    if (
      latestProducts.find((el) => el.id === warehouse.product_id)
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
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Choose product</ModalHeader>
      <ModalBody>
        <Table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts?.map((item) => (
              <tr
                key={item.order_id}
                onClick={() => {
                  addReservedProductHandler(item);
                  toggle();
                }}
              >
                <td>{item.order_article}</td>
                <td>{item.quantity_palet}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ModalBody>
    </Modal>
  );
};

export default ReservedProductModal;
