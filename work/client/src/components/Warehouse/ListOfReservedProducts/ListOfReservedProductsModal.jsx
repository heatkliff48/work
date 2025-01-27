import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalBody, Button, Table } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import ReservedProductModal from './ReserveProductModal';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import {
  deleteReservedProducts,
  updateRemainingStock,
} from '#components/redux/actions/warehouseAction.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useModalContext } from '#components/contexts/ModalContext.js';
import FilesMain from '#components/FileUpload/Warehouse/FilesMain.jsx';
import { useUsersContext } from '#components/contexts/UserContext.js';

const ListOfReservedProductsModal = React.memo(({ isOpen, toggle }) => {
  const {
    warehouse_data,
    list_of_reserved_products,
    filteredProducts,
    setFilteredProducts,
  } = useWarehouseContext();

  const { warehouseInfoCurIdModal, reserveProductModal, setReserveProductModal } =
    useModalContext();
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();

  const user = useSelector((state) => state.user);

  const { productsOfOrders, list_of_orders } = useOrderContext();
  const { latestProducts } = useProductsContext();

  const [currentListOfResProd, setCurrentListOfResProd] = useState();

  const navigate = useNavigate();
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

  const deleteHandler = (el) => {
    const { id, remaining_stock } = curr_warehouse;

    const new_remaining_stock = remaining_stock + el.quantity;

    dispatch(deleteReservedProducts(el.id));
    dispatch(updateRemainingStock({ warehouse_id: id, new_remaining_stock }));
  };

  useEffect(() => {
    const curr_res_prod_list = list_of_reserved_products.filter(
      (el) => el?.warehouse_id == curr_warehouse.id
    );

    setCurrentListOfResProd(curr_res_prod_list);
  }, [list_of_reserved_products]);

  useEffect(() => {
    const wh = getWarehouse();

    const result = productsOfOrders
      .filter((item) => {
        const haveReserve = list_of_reserved_products.find(
          (el) => el.orders_products_id === item.id
        );
        return !haveReserve && item.product_id === wh.product_id;
      })
      .map((product) => {
        const order = list_of_orders.find((order) => order.id === product.order_id);
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
      const access = checkUserAccess(user, roles, 'Warehouse_reservation');
      setUserAccess(access);

      console.log('access', access);

      if (!access?.canRead) {
        navigate('/'); // Перенаправление на главную страницу, если нет прав на чтение
      }
    }
  }, [user, roles]);

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
              Остаток свободной продукции,{' '}
              {curr_warehouse?.type == 'OK' ? 'палет' : 'шт. блоков'}:{' '}
              {curr_warehouse.remaining_stock}
            </span>
          </div>
          <div className="warehouseInfo">
            <span>Местоположение: {curr_warehouse.warehouse_loc}</span>
          </div>
          {userAccess?.canWrite && (
            <Button
              style={{ marginBottom: '10px' }}
              color="primary"
              disabled={
                curr_warehouse?.remaining_stock === 0 ||
                filteredProducts?.length === 0
              }
              onClick={() => {
                setReserveProductModal(!reserveProductModal);
              }}
            >
              Зарезервировать продукцию
            </Button>
          )}
          <FilesMain />
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
                          deleteHandler(el);
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
