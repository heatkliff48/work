import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import Table from '#components/Table/Table.jsx';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function ListOfOrderedProduction() {
  const {
    COLUMNS_LIST_OF_ORDERED_PRODUCTION,
    list_of_ordered_production,
    list_of_reserved_products,
  } = useWarehouseContext();
  const { list_of_orders, productsOfOrders } = useOrderContext();
  const batchOutside = useSelector((state) => state.batchOutside);

  const [listOfOrdered, setListOfOrdered] = useState([]);

  useEffect(() => {
    const data = list_of_ordered_production.map((el) => {
      const quantity_cakes = (el.quantity / 3).toFixed(2);
      const orderId = list_of_orders.find(
        (order) => order.article === el.order_article
      ).id;

      const prodOrdId = productsOfOrders.filter((elem) => elem.order_id === orderId);

      const quantity_in_warehouse = list_of_reserved_products.find((res_prod) =>
        prodOrdId.find((prod) => res_prod.orders_products_id === prod.id)
      )?.quantity;

      const quantity_in_batch = (
        batchOutside.find((batch) => batch.id_list_of_ordered_production === el.id)
          ?.quantity_pallets / 4
      ).toFixed(2);

      return {
        ...el,
        quantity_cakes,
        quantity_in_batch,
        quantity_in_warehouse,
      };
    });
    setListOfOrdered(data);
  }, [list_of_ordered_production]);

  return (
    <>
      <Table
        COLUMN_DATA={COLUMNS_LIST_OF_ORDERED_PRODUCTION}
        dataOfTable={listOfOrdered}
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
