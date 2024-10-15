import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Table from '../Table/Table';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import WarehouseAddModal from './WarehouseAddModal';
import ListOfReservedProductsModal from '#components/Warehouse/ListOfReservedProducts/ListOfReservedProductsModal.jsx';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import ErrorBoundary from './ErrorBiundary';

function Warehouse() {
  const { COLUMNS_WAREHOUSE } = useWarehouseContext();

  const {
    setWarehouseModal,
    warehouseModal,
    warehouseInfoModal,
    setWarehouseInfoModal,
    setWarehouseInfoCurIdModal,
  } = useModalContext();

  const { warehouse_data } = useWarehouseContext();

  const handleRowClick = useCallback((row) => {
    setWarehouseInfoCurIdModal(row.original.id);
    setWarehouseInfoModal(!warehouseInfoModal);
  }, []);

  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();
  const user = useSelector((state) => state.user);

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
      {warehouseModal && (
        <WarehouseAddModal
          isOpen={warehouseModal}
          toggle={() => setWarehouseModal(!warehouseModal)}
          COLUMNS_WAREHOUSE={COLUMNS_WAREHOUSE}
          warehouse_data={warehouse_data}
        />
      )}
      {warehouseInfoModal && (
        <ListOfReservedProductsModal
          isOpen={warehouseInfoModal}
          toggle={() => setWarehouseInfoModal(!warehouseInfoModal)}
        />
      )}

      <Table
        COLUMN_DATA={COLUMNS_WAREHOUSE}
        dataOfTable={warehouse_data}
        userAccess={userAccess}
        onClickButton={() => {
          setWarehouseModal(!warehouseModal);
        }}
        buttonText={'Add new product on warehouse'}
        tableName={'Warehouse'}
        handleRowClick={handleRowClick}
      />
    </>
  );
}
export default Warehouse;
