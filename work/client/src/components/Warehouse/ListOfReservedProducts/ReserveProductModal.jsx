import { useOrderContext } from '#components/contexts/OrderContext.js';
import {
  addNewReservedProducts,
  updateRemainingStock,
} from '#components/redux/actions/warehouseAction.js';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Modal, ModalHeader, ModalBody, Table } from 'reactstrap';

const ReservedProductModal = ({ isOpen, toggle, warehouse }) => {
  const dispatch = useDispatch();

  const { list_of_orders, productsOfOrders } = useOrderContext();

  const filteredProducts = useMemo(() => {
    const filteredProductsOfOrders = productsOfOrders.filter(
      (item) => item.product_id === warehouse.product_id
    );

    const result = filteredProductsOfOrders.map((product) => {
      const order = list_of_orders.find((order) => order.id === product.order_id);
      return {
        productsOfOrders_id: product.id,
        order_article: order ? order.article : '',
        quantity_real: product.quantity_real,
      };
    });

    return result;
  }, [productsOfOrders]);

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
            {filteredProducts.map((item) => (
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
