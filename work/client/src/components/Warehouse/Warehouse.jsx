import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../Table/Table';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import WarehouseAddModal from './WarehouseAddModal';
import ListOfReservedProductsModal from '#components/Warehouse/ListOfReservedProducts/ListOfReservedProductsModal.jsx';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useMemo } from 'react';
import { getAllWarehouse } from '#components/redux/actions/warehouseAction.js';

function Warehouse() {
  const { COLUMNS_WAREHOUSE, warehouse_data } = useWarehouseContext();
  const { latestProducts } = useProductsContext();
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();
  const {
    setWarehouseModal,
    warehouseModal,
    warehouseInfoModal,
    setWarehouseInfoModal,
    setWarehouseInfoCurIdModal,
  } = useModalContext();

  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const handleRowClick = useCallback((row) => {
    setWarehouseInfoCurIdModal(row.original.id);
    setWarehouseInfoModal(!warehouseInfoModal);
  }, []);

  useEffect(() => {
    dispatch(getAllWarehouse());
  }, []);

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Warehouse');

      if (JSON.stringify(access) !== JSON.stringify(userAccess)) {
        setUserAccess(access);
      }
    }
  }, [user, roles, checkUserAccess, userAccess, setUserAccess]);

  const extendedWarehouseData = useMemo(() => {
    if (!warehouse_data || !latestProducts) return warehouse_data || [];

    return warehouse_data.map((item) => {
      const product = latestProducts.find(
        (product) => product.article === item.product_article,
      );

      const m3Value = product?.volumeBlockOnPallet || 0;
      const totalQuantity = item.total_quantity || 0;
      const total_m3 = m3Value * totalQuantity;

      return {
        ...item,
        total_m3,
      };
    });
  }, [warehouse_data, latestProducts]);

  return (
    <>
      {warehouseModal && userAccess?.canWrite && (
        <WarehouseAddModal
          isOpen={warehouseModal}
          toggle={() => setWarehouseModal(!warehouseModal)}
          COLUMNS_WAREHOUSE={COLUMNS_WAREHOUSE}
          warehouse_data={extendedWarehouseData}
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
        dataOfTable={extendedWarehouseData}
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
