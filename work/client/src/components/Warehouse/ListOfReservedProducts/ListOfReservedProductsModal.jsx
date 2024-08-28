import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalBody, Button, Table } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import ReservedProductModal from './ReserveProductModal';
import { useProjectContext } from '#components/contexts/Context.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { deleteReservedProducts } from '#components/redux/actions/warehouseAction.js';

const ListOfReservedProductsModal = React.memo(({ isOpen, toggle }) => {
  const {
    warehouse_data,
    list_of_reserved_products,
    warehouseInfoCurIdModal,
    reserveProductModal,
    setReserveProductModal,
    filteredProducts,
    setFilteredProducts,
  } = useWarehouseContext();

  const { productsOfOrders, list_of_orders } = useOrderContext();
  const { latestProducts } = useProjectContext();

  const [currentListOfResProd, setCurrentListOfResProd] = useState();
  const dispatch = useDispatch();

  const curr_warehouse = warehouse_data.find(
    (wh) => wh.id === warehouseInfoCurIdModal
  );

  const getWarehouse = () => {
    const product = latestProducts.find(
      (el) => el.article === curr_warehouse.product_article
    );

    return { ...curr_warehouse, product_id: product.id };
  };

  const getOrderArticle = (orders_products_id) => {
    const orderProductMark = productsOfOrders.find(
      (el) => el.id === orders_products_id
    );

    const order = list_of_orders.find((el) => el.id === orderProductMark?.order_id);
    return order?.article;
  };

  const deleteHandler = (id) => {
    dispatch(deleteReservedProducts(id));
  };

  useEffect(() => {
    const curr_res_prod_list = list_of_reserved_products.filter(
      (el) => el.warehouse_id == curr_warehouse.id
    );
    setCurrentListOfResProd(curr_res_prod_list);
  }, []);

  useEffect(() => {
    const wh = getWarehouse();
    const filteredProductsOfOrders = productsOfOrders.filter(
      (item) => item.product_id === wh.product_id
    );

    const result = filteredProductsOfOrders.map((product) => {
      const order = list_of_orders.find((order) => order.id === product.order_id);
      return {
        productsOfOrders_id: product.id,
        order_article: order ? order.article : '',
        quantity_real: product.quantity_real,
      };
    });
    setFilteredProducts(result);
  }, [productsOfOrders]);

  return (
    <div>
      {reserveProductModal && (
        <ReservedProductModal
          isOpen={reserveProductModal}
          toggle={() => setReserveProductModal(!reserveProductModal)}
          warehouse={getWarehouse()}
        />
      )}
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader className="styledModalHeader" toggle={toggle}>
          <span>{curr_warehouse.article}</span>
        </ModalHeader>
        <ModalBody>
          <div className="warehouseInfo">
            <span>Тип продукта: {curr_warehouse.product_article}</span>
            <span>
              Остаток свободной продукции: {curr_warehouse.remaining_stock}
            </span>
          </div>
          <div className="warehouseInfo">
            <span>Местоположение: {curr_warehouse.warehouse_loc}</span>
          </div>
          <Button
            style={{ marginBottom: '10px' }}
            color="primary"
            disabled={
              curr_warehouse?.remaining_stock === 0 || filteredProducts?.length === 0
            }
            onClick={() => {
              setReserveProductModal(!reserveProductModal);
            }}
          >
            Зарезервировать продукцию
          </Button>
          <Table>
            <thead>
              <tr>
                <th>UID заказа</th>
                <th>Количество</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentListOfResProd?.map((el) => {
                return (
                  <tr>
                    <td>{getOrderArticle(el?.orders_products_id)}</td>
                    <td>{el?.quantity}</td>
                    <td>
                      <Button
                        color="danger"
                        onClick={() => {
                          deleteHandler(el.id);
                        }}
                      >
                        Удалить
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </ModalBody>
      </Modal>
    </div>
  );
});
export default ListOfReservedProductsModal;
