import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../Table/Table';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import ShowProductsTypeWarehouseModal from './Modal/ProductsTypeWarehouseModal';
import { getRelatedMaterialsWarehouse } from '#components/redux/actions/productsTypeWarehouseAction.js';
import { useModalContext } from '#components/contexts/ModalContext.js';
import ListOfReservedAuxilaryModal from './ListOfReservedProducts/ListOfReservedAuxilaryModal';

function Warehouse() {
  const { COLUMNS_WAREHOUSE, related_materials_warehouse_data } =
    useWarehouseContext();
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();
  const { setWarehouseInfoCurIdModal } = useModalContext();

  const user = useSelector((state) => state.user);

  const [modalShow, setModalShow] = useState(false);

  const dispatch = useDispatch();

  const handleRowClick = useCallback((row) => {
    setWarehouseInfoCurIdModal(row.original.id);
    // setWarehouseInfoModal(!warehouseInfoModal);
    setModalShow(true);
  }, []);

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Warehouse');

      if (JSON.stringify(access) !== JSON.stringify(userAccess)) {
        setUserAccess(access);
      }
    }
  }, [user, roles, checkUserAccess, userAccess, setUserAccess]);

  useEffect(() => {
    dispatch(getRelatedMaterialsWarehouse());
  }, []);

  return (
    <>
      {userAccess?.canWrite && (
        <ShowProductsTypeWarehouseModal target={2} title={'related material'} />
      )}

      <Table
        COLUMN_DATA={COLUMNS_WAREHOUSE}
        dataOfTable={related_materials_warehouse_data}
        userAccess={userAccess}
        tableName={'Related Materials Warehouse'}
        handleRowClick={handleRowClick}
      />
      <ListOfReservedAuxilaryModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        target={2}
      />
    </>
  );
}
export default Warehouse;
