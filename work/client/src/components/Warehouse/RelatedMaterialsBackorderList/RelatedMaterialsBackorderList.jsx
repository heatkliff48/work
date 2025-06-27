import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import Table from '#components/Table/Table.jsx';

function RelatedMaterialsBackorderList() {
  const {
    COLUMNS_RELATED_MATERIALS_BACKORDER_LIST,
    listOfOrderedAuxilary,
  } = useWarehouseContext();

  return (
    <>
      <Table
        COLUMN_DATA={COLUMNS_RELATED_MATERIALS_BACKORDER_LIST}
        dataOfTable={listOfOrderedAuxilary}
        // userAccess={userAccess}
        onClickButton={() => {}}
        buttonText={''}
        tableName={'Related materials backorder list'}
        handleRowClick={(row) => {}}
      />
    </>
  );
}
export default RelatedMaterialsBackorderList;
