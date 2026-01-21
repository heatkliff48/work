import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../Table/Table';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import ShowProductsTypeWarehouseModal from './Modal/ProductsTypeWarehouseModal';
import ListOfReservedAuxilaryModal from './ListOfReservedProducts/ListOfReservedAuxilaryModal';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { getToolsWarehouse } from '#components/redux/actions/productsTypeWarehouseAction.js';

function Warehouse() {
  const { COLUMNS_WAREHOUSE_AUX, tools_warehouse_data } = useWarehouseContext();
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();
  const { setWarehouseInfoCurIdModal } = useModalContext();

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [modalShow, setModalShow] = useState(false);

  const handleRowClick = useCallback((row) => {
    setWarehouseInfoCurIdModal(row.original.id);
    // setWarehouseInfoModal(!warehouseInfoModal);
    setModalShow(true);
  }, []);

  useEffect(() => {
    dispatch(getToolsWarehouse());
  }, []);

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Warehouse');

      if (JSON.stringify(access) !== JSON.stringify(userAccess)) {
        setUserAccess(access);
      }
    }
  }, [user, roles, checkUserAccess, userAccess, setUserAccess]);

  return (
    <>
      {userAccess?.canWrite && (
        <ShowProductsTypeWarehouseModal target={4} title={'tool'} />
      )}

      <Table
        COLUMN_DATA={COLUMNS_WAREHOUSE_AUX}
        dataOfTable={tools_warehouse_data}
        userAccess={userAccess}
        tableName={'Tools Warehouse'}
        handleRowClick={handleRowClick}
      />
      <ListOfReservedAuxilaryModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        target={4}
      />
    </>
  );
}
export default Warehouse;
