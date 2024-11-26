import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import Table from '#components/Table/Table.jsx';

function ListOfOrderedProduction() {
  const { COLUMNS_LIST_OF_ORDERED_PRODUCTION, listOfOrderedCakes } =
    useWarehouseContext();
  return (
    <>
      <Table
        COLUMN_DATA={COLUMNS_LIST_OF_ORDERED_PRODUCTION}
        dataOfTable={listOfOrderedCakes}
        // userAccess={userAccess}
        onClickButton={() => {}}
        buttonText={''}
        tableName={'List of ordered production'}
        handleRowClick={(row) => {
          console.log('row.original', row.original);
        }}
      />
    </>
  );
}
export default ListOfOrderedProduction;
