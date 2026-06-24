import { useProjectContext } from '#components/contexts/Context.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
// import { useUsersContext } from '#components/contexts/UserContext.js';
import Table from '../Table/Table';
import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import WMOrderCard from './WMOrderCard/WMOrderCard';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useProductsTypeJournalContext } from '#components/contexts/ProductsTypeJournalContext.js';
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
  const { WAREHOUSE_MANAGER_TABLE } = useProjectContext();
  const { latestProducts } = useProductsContext();
  const { latestDryMix, latestAnchors, latestTools, latestRelatedMaterials } =
    useProductsTypeJournalContext();
  const {
    setWmoctProductShippedBD,
    selectedOrder,
    setSelectedOrder,
    getProductsByOrder,
  } = useWarehouseContext();
  const {
    list_of_orders,
    deliveryAddresses,
    productsOfOrders,
    getCurrentOrderInfoHandler,
    dryMixedProductsOfOrders,
    anchorProductsOfOrders,
    toolProductsOfOrders,
    relMatProductsOfOrders,
  } = useOrderContext();

  const {
    setWmoctPdfModal,
    wmmodalTrailer,
    setwmmodalTrailer,
    wmmodalTrailerModal,
    setwmmodalTrailerModal,
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
    const result = list_of_orders
      .filter((el) => el.status === 8)
      .reduce((acc, el) => {
        const del_adr = deliveryAddresses?.find((del) => del?.id == el?.del_adr_id);

        const products = [];

        const regularProducts = getProductsByOrder(
          el.id,
          productsOfOrders,
          latestProducts,
        );
        products.push(...regularProducts);

        const dryMixProducts = getProductsByOrder(
          el.id,
          dryMixedProductsOfOrders,
          latestDryMix,
        );
        products.push(...dryMixProducts);

        const anchorProducts = getProductsByOrder(
          el.id,
          anchorProductsOfOrders,
          latestAnchors,
        );
        products.push(...anchorProducts);

        const toolProducts = getProductsByOrder(
          el.id,
          toolProductsOfOrders,
          latestTools,
        );
        products.push(...toolProducts);

        const relMatProducts = getProductsByOrder(
          el.id,
          relMatProductsOfOrders,
          latestRelatedMaterials,
        );
        products.push(...relMatProducts);

        const normalizedProducts = products
          .map((product) => {
            if (!product) {
              return '';
            }
            const trimmed = product.trim().replace(/,\s*$/, ' ');
            return trimmed;
          })
          .filter((product) => product && product.length > 0);

        const obj = {
          order_id: el.id,
          orders_article: el.article,
          projects_name: del_adr?.project_name || '',
          // production_date: el.shipping_date || '',
          orders_products: normalizedProducts,
        };
        acc.push(obj);

        return acc;
      }, []);

    setWarehouseMdata(result);
    setWmoctProductShippedBD([]);
  }, [
    list_of_orders,
    deliveryAddresses,
    productsOfOrders,
    dryMixedProductsOfOrders,
    anchorProductsOfOrders,
    toolProductsOfOrders,
    relMatProductsOfOrders,
    latestProducts,
    latestDryMix,
    latestAnchors,
    latestTools,
    latestRelatedMaterials,
  ]);

  return (
    <>
      {selectedOrder && <WMOrderCard selectedOrder={selectedOrder} />}
      {wmmodalTrailer && <WMModalTrailer setTrailerOrder={setTrailerOrder} />}
      {wmmodalTrailerModal && <WMModalTrailerModal trailer_order={trailer_order} />}

      <div>
        <button onClick={() => setwmmodalTrailer(!wmmodalTrailer)}>
          Plan nuevo trailer
        </button>
        <Table
          COLUMN_DATA={WAREHOUSE_MANAGER_TABLE}
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
    </>
  );
}
export default WarehouseManager;
