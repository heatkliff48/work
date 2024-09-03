import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import Table from '#components/Table/Table.jsx';

function ListOfOrderedProductionOEM() {
  const { COLUMNS_LIST_OF_ORDERED_PRODUCTION_OEM, list_of_ordered_production_oem } =
    useWarehouseContext();

  return (
    <>
      <Table
        COLUMN_DATA={COLUMNS_LIST_OF_ORDERED_PRODUCTION_OEM}
        dataOfTable={list_of_ordered_production_oem}
        // userAccess={userAccess}
        onClickButton={() => {}}
        buttonText={''}
        tableName={'List of ordered production OEM'}
        handleRowClick={(row) => {
          console.log('row.original', row.original);
        }}
      />
    </>
  );
}
export default ListOfOrderedProductionOEM;
