import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalBody, Button, Table } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import ReservedProductModal from './ReserveProductModal';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import {
  deleteReservedProducts,
  deleteWarehouse,
  updateRemainingStock,
} from '#components/redux/actions/warehouseAction.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useModalContext } from '#components/contexts/ModalContext.js';
import FilesMain from '#components/FileUpload/Warehouse/FilesMain.jsx';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { updateOrderStatus } from '#components/redux/actions/ordersAction.js';
import ShowSortingModal from './SortingModal';
import ShowAddBatchID from './AddBatchID';

const ListOfReservedProductsModal = React.memo(({ isOpen, toggle }) => {
  const {
    warehouse_data,
    list_of_reserved_products,
    filteredProducts,
    setFilteredProducts,
  } = useWarehouseContext();

  const {
    warehouseInfoCurIdModal,
    reserveProductModal,
    setReserveProductModal,
  } = useModalContext();
  const { roles, checkUserAccess, userAccess, setUserAccess } =
    useUsersContext();

  const user = useSelector((state) => state.user);

  const { productsOfOrders, list_of_orders } = useOrderContext();
  const { latestProducts } = useProductsContext();

  const [currentListOfResProd, setCurrentListOfResProd] = useState();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const curr_warehouse = warehouse_data.find(
    (wh) => wh.id === warehouseInfoCurIdModal,
  );

  const getWarehouse = () => {
    const product = latestProducts.find(
      (el) => el.article === curr_warehouse.product_article,
    );

    return { ...curr_warehouse, product_id: product.id };
  };

  const getOrderArticle = (orders_products_id) => {
    const orderProductMark = productsOfOrders.find(
      (el) => el.id === orders_products_id,
    );

    const order = list_of_orders.find(
      (el) => el.id === orderProductMark?.order_id,
    );

    return order?.article;
  };

  const deleteHandler = (el) => {
    const { id, free_quantity_remaining } = curr_warehouse;

    const reservedProduct = productsOfOrders.find(
      (orderedProduct) => orderedProduct.id === el.orders_products_id,
    );
    const new_remaining_stock = free_quantity_remaining + el.quantity;

    dispatch(deleteReservedProducts(el.id));
    dispatch(updateRemainingStock({ warehouse_id: id, new_remaining_stock }));

    dispatch(
      updateOrderStatus({
        order_id: reservedProduct.order_id,
        status: 6,
      }),
    );
  };

  const deleteWarehouseHandler = () => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete warehouse entry ${curr_warehouse.article} (NOT OK)?\n` +
        `Press 'OK' to confirm or 'Cancel' to exit.`,
    );

    if (!isConfirmed) return;

    dispatch(deleteWarehouse(curr_warehouse.id));
    toggle();
  };

  // Запись могли удалить (в т.ч. другой пользователь) — закрываем модалку
  useEffect(() => {
    if (!curr_warehouse) toggle();
  }, [curr_warehouse]);

  useEffect(() => {
    const curr_res_prod_list = list_of_reserved_products.filter(
      (el) => el?.warehouse_id == curr_warehouse?.id,
    );

    setCurrentListOfResProd(curr_res_prod_list);
  }, [list_of_reserved_products]);

  useEffect(() => {
    if (!curr_warehouse) return;

    const wh = getWarehouse();

    const result = productsOfOrders
      .filter((item) => {
        const haveReserve = list_of_reserved_products.find(
          (el) => el.orders_products_id === item.id,
        );
        return !haveReserve && item.product_id === wh.product_id;
      })
      .map((product) => {
        const order = list_of_orders.find(
          (order) => order.id === product.order_id,
        );
        return {
          productsOfOrders_id: product.id,
          order_article: order ? order.article : '',
          quantity_palet: product.quantity_palet,
        };
      });

    setFilteredProducts(result);
  }, [productsOfOrders, list_of_reserved_products]);

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Warehouse');
      setUserAccess(access);

      console.log('access', access);

      if (!access?.canRead) {
        navigate('/'); // Перенаправление на главную страницу, если нет прав на чтение
      }
    }
  }, [user, roles]);

  if (!curr_warehouse) return null;

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
            <span>Product article: {curr_warehouse.product_article}</span>
            <span>
              Free products,{' '}
              {curr_warehouse?.type == 'OK' ? 'pallet' : 'blocks'}:{' '}
              {curr_warehouse.free_quantity_remaining}
            </span>
          </div>
          <div className="warehouseInfo">
            <span>Location: {curr_warehouse.warehouse_loc}</span>
          </div>
          {/* {userAccess?.canWrite && (
            <Button
              style={{ marginBottom: '10px' }}
              color="primary"
              disabled={
                curr_warehouse?.free_quantity_remaining === 0 ||
                filteredProducts?.length === 0
              }
              onClick={() => {
                setReserveProductModal(!reserveProductModal);
              }}
            >
              Reserve product
            </Button>
          )} */}
          {curr_warehouse.type === 'Sorting' && <ShowSortingModal />}
          <ShowAddBatchID />
          {curr_warehouse.type === 'NOT OK' && userAccess?.canWrite && (
            <Button color="danger" onClick={deleteWarehouseHandler}>
              Delete
            </Button>
          )}
          <FilesMain type={0} />
          <Table>
            <thead>
              <tr>
                <th>UID of an order</th>
                <th>Quantity</th>
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
                          deleteHandler(el);
                        }}
                      >
                        Delete
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
