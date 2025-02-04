import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import Table from '#components/Table/Table.jsx';
import { useEffect, useState } from 'react';
import ListOfOrderedProductionReserveModal from './ListOfOrderedProductionReserveModal';
import { useDispatch, useSelector } from 'react-redux';
import {
  addNewReservedProducts,
  updateRemainingStock,
  updListOfOrderedProductionOEM,
} from '#components/redux/actions/warehouseAction.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { updateOrderStatus } from '#components/redux/actions/ordersAction.js';

function ListOfOrderedProduction() {
  const {
    COLUMNS_LIST_OF_ORDERED_PRODUCTION,
    listOfOrderedCakes,
    warehouse_data,
    filteredWarehouseByProduct,
    setFilteredWarehouseByProduct,
    list_of_ordered_production_oem,
    list_of_reserved_products,
  } = useWarehouseContext();
  const { latestProducts } = useProductsContext();
  const { productsOfOrders, list_of_orders } = useOrderContext();

  const [modalShow, setModalShow] = useState(false);
  const [currentOrderedProduct, setCurrentOrderedProduct] = useState({});
  const dispatch = useDispatch();

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
