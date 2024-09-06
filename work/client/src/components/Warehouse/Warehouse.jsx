import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Table from '../Table/Table';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import WarehouseAddModal from './WarehouseAddModal';
import ListOfReservedProductsModal from '#components/Warehouse/ListOfReservedProducts/ListOfReservedProductsModal.jsx';
import { useProjectContext } from '#components/contexts/Context.js';

function Warehouse() {
  const {
    COLUMNS_WAREHOUSE,
    setWarehouseModal,
    warehouseModal,
    warehouse_data,
    warehouseInfoModal,
    setWarehouseInfoModal,
    setWarehouseInfoCurIdModal,
  } = useWarehouseContext();

  const { roles, checkUserAccess, userAccess, setUserAccess } = useProjectContext();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Warehouse');
      setUserAccess(access);
    }
  }, [user, roles]);

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
        handleRowClick={(row) => {
          setWarehouseInfoCurIdModal(row.original.id);
          setWarehouseInfoModal(!warehouseInfoModal);
        }}
      />
    </>
  );
}
export default Warehouse;
