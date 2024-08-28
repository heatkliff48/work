import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import {
  addNewReservedProducts,
  updateRemainingStock,
} from '#components/redux/actions/warehouseAction.js';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Modal, ModalHeader, ModalBody, Table } from 'reactstrap';

const ReservedProductModal = ({ isOpen, toggle, warehouse }) => {
  const { filteredProducts } = useWarehouseContext();
  const dispatch = useDispatch();

  const addReservedProductHandler = (res_prod) => {
    const { quantity_real, productsOfOrders_id } = res_prod;
    const { id, remaining_stock } = warehouse;

    if (quantity_real > remaining_stock) {
      alert(
        'Колличество заказной продукции превышает коллиичество продукции на складе!'
      );
      return;
    }
    const new_remaining_stock = remaining_stock - quantity_real;

    dispatch(updateRemainingStock({ warehouse_id: id, new_remaining_stock }));

    dispatch(
      addNewReservedProducts({
        warehouse_id: id,
        orders_products_id: productsOfOrders_id,
        quantity: quantity_real,
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
                }}
              >
                <td>{item.order_article}</td>
                <td>{item.quantity_real}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ModalBody>
    </Modal>
  );
};

export default ReservedProductModal;
