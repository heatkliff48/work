import { useCallback, useEffect, useState } from 'react';
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
import { Switch, FormControlLabel } from '@mui/material';

function Warehouse() {
  const { COLUMNS_WAREHOUSE, warehouse_data } = useWarehouseContext();
  const { latestProducts } = useProductsContext();
  const { roles, checkUserAccess, userAccess, setUserAccess } =
    useUsersContext();
  const {
    setWarehouseModal,
    warehouseModal,
    warehouseInfoModal,
    setWarehouseInfoModal,
    setWarehouseInfoCurIdModal,
  } = useModalContext();

  const user = useSelector((state) => state.user);
  const lotesListBatches = useSelector((state) => state.lotesListBatches);

  const [hideZeroQuantity, setHideZeroQuantity] = useState(false);

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

    const processedData = warehouse_data.map((item) => {
      const product = latestProducts.find(
        (product) => product.article === item.product_article,
      );

      const m3Value = product?.volumeBlockOnPallet || 0;
      const totalQuantity = item.total_quantity || 0;
      const total_m3 = Math.round(m3Value * totalQuantity * 100) / 100;

      const production_date = item?.batch_id
        ? lotesListBatches.find((batch) => batch?.batch_id == item?.batch_id)
            ?.production_date
        : null;

      return {
        ...item,
        total_m3,
        production_date,
      };
    });

    // Фильтрация по состоянию радиокнопки
    if (hideZeroQuantity) {
      return processedData.filter((item) => item.total_quantity > 0);
    }

    return processedData;
  }, [warehouse_data, latestProducts, hideZeroQuantity]);

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

      <FormControlLabel
        control={
          <Switch
            checked={hideZeroQuantity}
            onChange={(e) => setHideZeroQuantity(e.target.checked)}
          />
        }
        label="Toggle to show empty entries"
      />

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
