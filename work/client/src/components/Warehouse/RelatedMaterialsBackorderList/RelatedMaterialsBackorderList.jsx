import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import Table from '#components/Table/Table.jsx';
import { useState } from 'react';

function RelatedMaterialsBackorderList() {
  const {
    COLUMNS_RELATED_MATERIALS_BACKORDER_LIST,
    listOfOrderedAuxilary,
    warehouse_data,
    filteredWarehouseByProduct,
    setFilteredWarehouseByProduct,
  } = useWarehouseContext();

  const [modalShow, setModalShow] = useState(false);
  const [currentOrderedProduct, setCurrentOrderedProduct] = useState({});

  return (
    <>
      <Table
        COLUMN_DATA={COLUMNS_RELATED_MATERIALS_BACKORDER_LIST}
        dataOfTable={listOfOrderedAuxilary}
        // userAccess={userAccess}
        onClickButton={() => {}}
        buttonText={''}
        tableName={'Related materials backorder list'}
      />
    </>
  );
}
export default RelatedMaterialsBackorderList;
