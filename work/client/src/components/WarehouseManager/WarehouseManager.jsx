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
import './warehouseManagerView.css';
import WMModalTrailer from './WMModal/WMModalTrailer';
import WMModalTrailerModal from './WMModal/WMModalTrailerModal';
import { useNavigate } from 'react-router-dom';

// Row tint by trailer_stage (0-4). The stage value itself is never shown as
// text/label anywhere — only used to color the row background.
const STAGE_ROW_BG = {
  0: '#f3f4f6',
  1: '#eaf7ee',
  2: '#fef6e0',
  3: '#fdeaea',
  4: '#f2eafb',
};

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
  const [showStage4, setShowStage4] = useState(false);

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

  const getOrderDispatchId = (item) => {
    const rawId = item?.id ?? item?.order_dispatch_id ?? item?.orderDispatchId;

    if (rawId === undefined || rawId === null || rawId === '') {
      return null;
    }

    const numericId = Number(rawId);

    return Number.isFinite(numericId) ? numericId : null;
  };

  useEffect(() => {
    if (!order_dispatch_data || order_dispatch_data.length === 0) {
      setWarehouseMdata([]);
      setWmoctProductShippedBD([]);
      return;
    }

    const groupedData = order_dispatch_data
      .filter((el) => showStage4 || el.trailer_stage < 4)
      .reduce((acc, item) => {
        const orderId = Number(item.orderId);
        const trailer = Number(item.trailer);

        const key = `${orderId}_${trailer}`;

        if (!acc[key]) {
          acc[key] = {
            orderId,
            trailer,
            products: [],
            fecha: item.fecha || '',
            articles: [],
            dispatchItems: [],
            trailer_stage: item.trailer_stage,
          };
        }

        acc[key].products.push(`${item.title}: ${Number(item.quantity || 0)}, `);
        acc[key].articles.push(`${item.article}: ${Number(item.quantity || 0)}, `);

        const orderDispatchId = getOrderDispatchId(item);

        if (!orderDispatchId) {
          console.error('order_dispatch_data row has no database ID:', item);
        }

        acc[key].dispatchItems.push({
          id: orderDispatchId,

          orderId: Number(item.orderId),
          trailer: Number(item.trailer),
          orderProductId: Number(item.orderProductId),

          product_table: item.product_table,
          quantity: Number(item.quantity || 0),
          article: item.article,
          title: item.title,
        });

        if (item.fecha && !acc[key].fecha) {
          acc[key].fecha = item.fecha;
        }

        return acc;
      }, {});

    const result = Object.values(groupedData).map((group) => {
      const order = list_of_orders.find(
        (item) => Number(item.id) === Number(group.orderId),
      );

      const delivery = deliveryAddresses.find(
        (item) => Number(item.id) === Number(order?.del_adr_id),
      );

      return {
        order_id: group.orderId,
        orders_article: order?.article || '',
        projects_name: delivery?.project_name || '',
        fecha: group.fecha || order?.due_date || '',
        orders_products: group.products,
        orders_products_articles: group.articles,
        trailer: group.trailer,
        dispatchItems: group.dispatchItems,
        trailer_stage: group.trailer_stage,
      };
    });

    setWarehouseMdata(result);
    setWmoctProductShippedBD([]);
  }, [order_dispatch_data, list_of_orders, deliveryAddresses, showStage4]);

  return (
    <>
      <div className="wm-page">
        <Table
          COLUMN_DATA={WAREHOUSE_MANAGER_TRAILER_TABLE}
          dataOfTable={warehouseMdata}
          // userAccess={userAccess}
          onClickButton={() => {}}
          buttonText={''}
          tableName={'Order dispatch'}
          variant="card"
          getRowProps={(row) => ({
            style: {
              background:
                STAGE_ROW_BG[row.original.trailer_stage] ?? STAGE_ROW_BG[0],
            },
          })}
          handleRowClick={(row) => {
            getCurrentOrderInfoHandler({ order_id: row.original.order_id });

            setSelectedOrder(row.original);
            navigate('/warehouse-manager/order-card');
          }}
          renderToolbar={({ globalFilter, setGlobalFilter }) => (
            <div className="wm-toolbar">
              <div className="wm-search">
                <svg
                  className="wm-search__ic"
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9aa0ac"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.2-3.2" />
                </svg>
                <input
                  type="text"
                  className="wm-search__input"
                  placeholder="Search…"
                  value={globalFilter || ''}
                  onChange={(e) => setGlobalFilter(e.target.value || undefined)}
                />
              </div>

              <div className="wm-toggle">
                <span className="wm-toggle__label">Show stage 4</span>
                <button
                  type="button"
                  className={`wm-toggle__switch${
                    showStage4 ? ' wm-toggle__switch--on' : ''
                  }`}
                  onClick={() => setShowStage4((prev) => !prev)}
                >
                  <span
                    className={`wm-toggle__knob${
                      showStage4 ? ' wm-toggle__knob--on' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="wm-toolbar__spacer" />

              <button
                type="button"
                className="wm-btn wm-btn--primary"
                onClick={() => setwmmodalTrailer(!wmmodalTrailer)}
              >
                Plan nuevo trailer
              </button>
            </div>
          )}
        />
      </div>

      {wmmodalTrailer && <WMModalTrailer setTrailerOrder={setTrailerOrder} />}
      {wmmodalTrailerModal && <WMModalTrailerModal trailer_order={trailer_order} />}
    </>
  );
}
export default WarehouseManager;
