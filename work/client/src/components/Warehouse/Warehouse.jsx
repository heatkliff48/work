import { useDispatch, useSelector } from 'react-redux';
import Table from '../Table/Table';
import { useEffect, useState } from 'react';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import WarehouseAddModal from './WarehouseAddModal';

function Warehouse() {
  const {
    COLUMNS_WAREHOUSE,
    setWarehouseModal,
    warehouseModal,
    warehouse_data
  } = useWarehouseContext();

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
      <Table
        COLUMN_DATA={COLUMNS_WAREHOUSE}
        dataOfTable={warehouse_data}
        // userAccess={userAccess}
        onClickButton={() => {
          setWarehouseModal(!warehouseModal);
        }}
        buttonText={'Add new product on warehouse'}
        tableName={'Warehouse'}
        handleRowClick={(row) => {
          // dispatch(getProductsOfOrders(row.original.id));
        }}
      />
    </>
  );
}
export default Warehouse;
