import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button, Table } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import {
  deleteReservedProducts,
  updateRemainingStock,
} from '#components/redux/actions/warehouseAction.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useModalContext } from '#components/contexts/ModalContext.js';
import FilesMain from '#components/FileUpload/Warehouse/FilesMain.jsx';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { updateOrderStatus } from '#components/redux/actions/ordersAction.js';

function ListOfReservedAuxilaryModal(props) {
  const {
    dry_mixes_warehouse_data,
    related_materials_warehouse_data,
    anchors_warehouse_data,
    tools_warehouse_data,
    list_of_reserved_products,
    related_materials_backorder_list,
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

  const curr_warehouse =
    props.target == 1
      ? dry_mixes_warehouse_data.find((wh) => wh.id === warehouseInfoCurIdModal)
      : props.target == 2
      ? related_materials_warehouse_data.find(
          (wh) => wh.id === warehouseInfoCurIdModal
        )
      : props.target == 3
      ? anchors_warehouse_data.find((wh) => wh.id === warehouseInfoCurIdModal)
      : tools_warehouse_data.find((wh) => wh.id === warehouseInfoCurIdModal);

  useEffect(() => {
    const curr_res_prod_list = related_materials_backorder_list.filter(
      (el) => el?.product_article == curr_warehouse?.product_article
    );

    setCurrentListOfResProd(curr_res_prod_list);
  }, [related_materials_backorder_list, warehouseInfoCurIdModal]);

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

  return (
    <div>
      <Modal
        {...props}
        show={props.show}
        onHide={props.onHide}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header className="styledModalHeader" closeButton>
          <span>{curr_warehouse?.article}</span>
        </Modal.Header>
        <Modal.Body>
          <div className="warehouseInfo">
            <span>Product article: {curr_warehouse?.product_article}</span>
            <span>
              Free products, {curr_warehouse?.type == 'OK' ? 'pallet' : 'blocks'}:{' '}
              {curr_warehouse?.free_quantity_remaining}
            </span>
          </div>
          <div className="warehouseInfo">
            <span>Location: {curr_warehouse?.warehouse_loc}</span>
          </div>
          <FilesMain type={props.target} />
          <Table>
            <thead>
              <tr>
                <th>UID of an order</th>
                <th>Quantity</th>
                <th>Quantity reserved</th>
                {/* <th></th> */}
              </tr>
            </thead>
            <tbody>
              {currentListOfResProd?.map((el) => {
                return (
                  <tr>
                    <td>{el?.order_article}</td>
                    <td>{el?.quantity}</td>
                    <td>{el?.quantity_in_warehouse}</td>
                    {/* <td>
                      <Button
                        color="danger"
                        onClick={() => {
                          deleteHandler(el);
                        }}
                      >
                        Delete
                      </Button>
                    </td> */}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </div>
  );
}
export default ListOfReservedAuxilaryModal;
