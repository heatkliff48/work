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
import { useNavigate } from 'react-router-dom';

function WarehouseManager() {
  // const { roles, user, checkUserAccess, userAccess, setUserAccess } =
  //   useUsersContext();
  const { WAREHOUSE_MANAGER_TRAILER_TABLE } = useProjectContext();
  const { setWmoctProductShippedBD, setSelectedOrder, order_dispatch_data } =
    useWarehouseContext();
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
  const navigate = useNavigate();

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

    const groupedData = order_dispatch_data.reduce((acc, item) => {
      const key = `${item.orderId}_${item.trailer}`;

      if (!acc[key]) {
        acc[key] = {
          orderId: item.orderId,
          trailer: item.trailer,
          products: [],
          fecha: item.fecha || '',
        };
      }

      acc[key].products.push(`${item.title}: ${item.quantity}`);

      if (item.fecha && !acc[key].fecha) {
        acc[key].fecha = item.fecha;
      }

      return acc;
    }, {});

    const result = Object.values(groupedData).map((group) => {
      const order = list_of_orders.find((o) => o.id === group.orderId);
      const delivery = deliveryAddresses.find((d) => d.id === order?.del_adr_id);

      return {
        order_id: group.orderId,
        orders_article: order?.article || '',
        projects_name: delivery?.project_name || '',
        fecha: group.fecha || order?.due_date || '',
        orders_products: group.products,
        trailer: group.trailer,
      };
    });

    setWarehouseMdata(result);
    setWmoctProductShippedBD([]);
  }, [order_dispatch_data, list_of_orders, deliveryAddresses]);

  return (
    <>
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
            navigate('/warehouse-manager/order-card');
          }}
        />
      </div>

      {wmmodalTrailer && <WMModalTrailer setTrailerOrder={setTrailerOrder} />}
      {wmmodalTrailerModal && <WMModalTrailerModal trailer_order={trailer_order} />}
    </>
  );
}
export default WarehouseManager;
