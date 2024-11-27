import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { updateAutoclave } from '#components/redux/actions/autoclaveAction.js';
import {
  addNewReservedProducts,
  updateRemainingStock,
} from '#components/redux/actions/warehouseAction.js';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Modal, ModalHeader, ModalBody, Table } from 'reactstrap';

const ReservedProductModal = ({ isOpen, toggle, warehouse }) => {
  const { filteredProducts, list_of_ordered_production } = useWarehouseContext();
  const dispatch = useDispatch();

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
    if (list_of_order_id) {
      dispatch(updateAutoclave(list_of_order_id));
    }

    dispatch(
      addNewReservedProducts({
        warehouse_id: id,
        orders_products_id: productsOfOrders_id,
        quantity: quantity_palet,
      })
    );
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
