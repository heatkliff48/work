import { useProjectContext } from '#components/contexts/Context.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
// import { useUsersContext } from '#components/contexts/UserContext.js';
import Table from '../Table/Table';
import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import WMOrderCard from './WMOrderCard/WMOrderCard';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';

function WarehouseManager() {
  // const { roles, user, checkUserAccess, userAccess, setUserAccess } =
  //   useUsersContext();
  const { WAREHOUSE_MANAGER_TABLE } = useProjectContext();
  const { latestProducts } = useProductsContext();
  const { setWmoctProductShippedBD } = useWarehouseContext();
  const {
    list_of_orders,
    deliveryAddresses,
    productsOfOrders,
    getCurrentOrderInfoHandler,
  } = useOrderContext();

  // const navigate = useNavigate();

  const [warehouseMdata, setWarehouseMdata] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // useEffect(() => {
  //   if (user && roles.length > 0) {
  //     const access = checkUserAccess(user, roles, 'Orders');
  //     setUserAccess(access);

  //     if (!access?.canRead) {
  //       navigate('/'); // Перенаправление на главную страницу, если нет прав на чтение
  //     }
  //   }
  // }, [user, roles]);

  useEffect(() => {
    const result = list_of_orders
      .filter((el) => el.status === 8)
      .reduce((acc, el) => {
        const del_adr = deliveryAddresses?.find((del) => del?.id == el?.del_adr_id);

        const products = productsOfOrders
          .filter((prod) => prod.order_id == el.id)
          .map((prod) => {
            const lProduct = latestProducts.find((lp) => lp.id == prod.product_id);
            return `${lProduct.article}: ${prod.quantity_palet}`;
          });

        const obj = {
          orders_article: el.article,
          projects_name: del_adr?.project_name || '',
          production_date: el.shipping_date || '',
          orders_products: products || [],
        };
        acc.push(obj);
        return acc;
      }, []);

    setWarehouseMdata(result);
    setWmoctProductShippedBD([]);

  }, [list_of_orders]);

  return (
    <>
      {selectedOrder ? (
        <WMOrderCard selectedOrder={selectedOrder} />
      ) : (
        <Table
          COLUMN_DATA={WAREHOUSE_MANAGER_TABLE}
          dataOfTable={warehouseMdata}
          // userAccess={userAccess}
          onClickButton={() => {}}
          buttonText={''}
          tableName={'Warehouse Manager'}
          handleRowClick={(row) => {
            getCurrentOrderInfoHandler({ article: row.original.orders_article });

            setSelectedOrder(row.original);
          }}
        />
      )}
    </>
  );
}
export default WarehouseManager;
