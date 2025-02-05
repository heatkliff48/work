import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import Table from '#components/Table/Table.jsx';
import { useState } from 'react';
import ListOfOrderedProductionReserveModal from './ListOfOrderedProductionReserveModal';

function ListOfOrderedProduction() {
  const {
    COLUMNS_LIST_OF_ORDERED_PRODUCTION,
    listOfOrderedCakes,
    warehouse_data,
    filteredWarehouseByProduct,
    setFilteredWarehouseByProduct,
  } = useWarehouseContext();

  const [modalShow, setModalShow] = useState(false);
  const [currentOrderedProduct, setCurrentOrderedProduct] = useState({});

  const productHandler = (product) => {
    const filteredWarehouse = warehouse_data.filter(
      (entry) =>
        entry.product_article === product.product_article &&
        entry.remaining_stock > 0
    );

    setCurrentOrderedProduct(product);
    setFilteredWarehouseByProduct(filteredWarehouse);
    setModalShow(true);
  };

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
          productHandler(row.original);
        }}
      />
      <ListOfOrderedProductionReserveModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        listOfOrderedProductionReserveData={filteredWarehouseByProduct}
        currentOrderedProduct={currentOrderedProduct}
        needToReserve={true}
      />
    </>
  );
}
export default ListOfOrderedProduction;
