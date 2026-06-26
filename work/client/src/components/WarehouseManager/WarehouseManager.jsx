import { useProjectContext } from '#components/contexts/Context.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import Table from '../Table/Table';
import { useEffect, useState } from 'react';
import WMOrderCard from './WMOrderCard/WMOrderCard';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { useDispatch } from 'react-redux';
import {
  getAllWarehouse,
  getListOfAnchorReservedProducts,
  getListOfDryMixedReservedProducts,
  getListOfRelMatReservedProducts,
  getListOfReservedProducts,
  getListOfToolReservedProducts,
} from '#components/redux/actions/warehouseAction.js';
import {
  getAnchorProductsOfOrders,
  getDryMixedProductsOfOrders,
  getProductsOfOrders,
  getRelMatProductsOfOrders,
  getToolProductsOfOrders,
} from '#components/redux/actions/ordersAction.js';
import {
  getAnchorsWarehouse,
  getDryMixesWarehouse,
  getRelatedMaterialsWarehouse,
  getToolsWarehouse,
} from '#components/redux/actions/productsTypeWarehouseAction.js';

import '#components/Styles/main-pages.css';
import WMModalTrailer from './WMModal/WMModalTrailer';
import WMModalTrailerModal from './WMModal/WMModalTrailerModal';

function WarehouseManager() {
  // const { roles, user, checkUserAccess, userAccess, setUserAccess } =
  //   useUsersContext();
  const { WAREHOUSE_MANAGER_TRAILER_TABLE } = useProjectContext();
  const {
    setWmoctProductShippedBD,
    selectedOrder,
    setSelectedOrder,
    order_dispatch_data,
  } = useWarehouseContext();
  const { list_of_orders, deliveryAddresses, getCurrentOrderInfoHandler } =
    useOrderContext();

  const {
    setWmoctPdfModal,
    wmmodalTrailer,
    setwmmodalTrailer,
    wmmodalTrailerModal,
  } = useModalContext();

  const [warehouseMdata, setWarehouseMdata] = useState([]);
  const [trailer_order, setTrailerOrder] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    setWmoctPdfModal(false);
    setSelectedOrder(null);
  }, []);

  useEffect(() => {
    // Fetch reserved products data
    dispatch(getListOfReservedProducts());
    dispatch(getListOfDryMixedReservedProducts());
    dispatch(getListOfAnchorReservedProducts());
    dispatch(getListOfToolReservedProducts());
    dispatch(getListOfRelMatReservedProducts());
    // Fetch products of orders data
    dispatch(getProductsOfOrders());
    dispatch(getDryMixedProductsOfOrders());
    dispatch(getAnchorProductsOfOrders());
    dispatch(getToolProductsOfOrders());
    dispatch(getRelMatProductsOfOrders());
    // Fetch products of orders data
    dispatch(getAllWarehouse());
    dispatch(getDryMixesWarehouse());
    dispatch(getAnchorsWarehouse());
    dispatch(getToolsWarehouse());
    dispatch(getRelatedMaterialsWarehouse());
  }, []);

  useEffect(() => {
    if (!order_dispatch_data || order_dispatch_data.length === 0) {
      setWarehouseMdata([]);
      setWmoctProductShippedBD([]);
      return;
    }

    const result = order_dispatch_data.map((item) => {
      const order = list_of_orders.find((o) => o.id === item.orderId);
      const delivery = deliveryAddresses.find((d) => d.id === order?.del_adr_id);

      const productDisplay = `${item.title || 'Без названия'}: ${item.quantity}`;

      const fecha = item.fecha || order?.due_date || '';

      return {
        order_id: item.orderId,
        orders_article: order?.article || '',
        projects_name: delivery?.project_name || '',
        fecha: fecha,
        orders_products: [productDisplay],
      };
    });

    setWarehouseMdata(result);
    setWmoctProductShippedBD([]);
  }, [order_dispatch_data, list_of_orders, deliveryAddresses]);
  return (
    <>
      {selectedOrder ? (
        <WMOrderCard selectedOrder={selectedOrder} />
      ) : (
        <div>
          <button onClick={() => setwmmodalTrailer(!wmmodalTrailer)}>
            Plan nuevo trailer
          </button>
          <Table
            COLUMN_DATA={WAREHOUSE_MANAGER_TRAILER_TABLE}
            dataOfTable={warehouseMdata}
            // userAccess={userAccess}
            onClickButton={() => {}}
            buttonText={''}
            tableName={'Order dispatch'}
            handleRowClick={(row) => {
              getCurrentOrderInfoHandler({ order_id: row.original.order_id });

              setSelectedOrder(row.original);
            }}
          />
        </div>
      )}
      {wmmodalTrailer && <WMModalTrailer setTrailerOrder={setTrailerOrder} />}
      {wmmodalTrailerModal && <WMModalTrailerModal trailer_order={trailer_order} />}
    </>
  );
}
export default WarehouseManager;
