import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../Table/Table';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import ShowProductsTypeWarehouseModal from './Modal/ProductsTypeWarehouseModal';
import { getToolsWarehouse } from '#components/redux/actions/productsTypeWarehouseAction.js';

function Warehouse() {
  const { COLUMNS_WAREHOUSE, tools_warehouse_data } = useWarehouseContext();
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();

  const user = useSelector((state) => state.user);

  // const handleRowClick = useCallback((row) => {
  //   setWarehouseInfoCurIdModal(row.original.id);
  //   setWarehouseInfoModal(!warehouseInfoModal);
  // }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Warehouse');

      if (JSON.stringify(access) !== JSON.stringify(userAccess)) {
        setUserAccess(access);
      }
    }
  }, [user, roles, checkUserAccess, userAccess, setUserAccess]);

  useEffect(() => {
    dispatch(getToolsWarehouse());
  }, []);

  return (
    <>
      <ShowProductsTypeWarehouseModal target={4} title={'tool'} />

      <Table
        COLUMN_DATA={COLUMNS_WAREHOUSE}
        dataOfTable={tools_warehouse_data}
        userAccess={userAccess}
        tableName={'Tools Warehouse'}
        // handleRowClick={handleRowClick}
      />
    </>
  );
}
export default Warehouse;
