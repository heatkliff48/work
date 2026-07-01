import { useProjectContext } from '#components/contexts/Context.js';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useProductsTypeJournalContext } from '#components/contexts/ProductsTypeJournalContext.js';
import Table from '#components/Table/Table.jsx';
import { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

function WMModalTrailer({ setTrailerOrder }) {
  const { latestProducts } = useProductsContext();
  const {
    wmmodalTrailer,
    setwmmodalTrailer,
    wmmodalTrailerModal,
    setwmmodalTrailerModal,
  } = useModalContext();
  const { WAREHOUSE_MANAGER_TRAILER_TABLE } = useProjectContext();
  const { latestDryMix, latestAnchors, latestTools, latestRelatedMaterials } =
    useProductsTypeJournalContext();
  const {
    list_of_orders,
    deliveryAddresses,
    productsOfOrders,
    dryMixedProductsOfOrders,
    anchorProductsOfOrders,
    toolProductsOfOrders,
    getCurrentOrderInfoHandler,
    relMatProductsOfOrders,
  } = useOrderContext();

  const [warehouse_trailer_data, setWarehouseTrailerData] = useState([]);

  const toggle = () => {
    setwmmodalTrailer(!wmmodalTrailer);
  };

  const getRemainingQuantityOfPallets = (arr, order_id) => {
    return arr
      .filter((prod) => prod.order_id === order_id)
      .reduce((acc, num) => {
        const quantity =
          num?.quantity_palet ??
          num?.quantity_palet_dry ??
          num?.quantity_palet_anchor ??
          num?.quantity_ud ??
          num?.quantity_palet_tool;
        acc += quantity;
        return acc;
      }, 0);
  };

  useEffect(() => {
    const readies_orders = list_of_orders
      .filter((order) => order.status >= 6)
      .reduce((acc, order) => {
        const id = order.id;
        const order_products = getRemainingQuantityOfPallets(productsOfOrders, id);
        const order_tools = getRemainingQuantityOfPallets(toolProductsOfOrders, id);
        const order_dry_mixes = getRemainingQuantityOfPallets(
          dryMixedProductsOfOrders,
          id,
        );
        const order_anchors = getRemainingQuantityOfPallets(
          anchorProductsOfOrders,
          id,
        );
        const order_rel_mats = getRemainingQuantityOfPallets(
          relMatProductsOfOrders,
          id,
        );

        const remaining_quantity_of_pallets =
          order_products +
          order_dry_mixes +
          order_anchors +
          order_tools +
          order_rel_mats;

        const del_adr = deliveryAddresses?.find(
          (del) => del?.id == order?.del_adr_id,
        );

        const obj = {
          orders_article: order.article,
          projects_name: del_adr?.project_name,
          fecha: order?.shipping_date,
          orders_products: remaining_quantity_of_pallets,
        };

        acc.push(obj);

        return acc;
      }, []);

    setWarehouseTrailerData(readies_orders);
  }, [list_of_orders]);

  const extractProductTitle = (value = '') => {
    if (!value) return '';

    return String(value)
      .replace(/BAUBLOCK®/gi, '')
      .replace(/\s*Medidas[\s\S]*$/i, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const getTrailerProductsByOrder = (order) => {
    if (!order?.id) return [];

    const sources = [
      {
        type: 'product',
        orderRows: productsOfOrders,
        productTable: latestProducts,
        orderProductIdKey: 'product_id',
        quantityKey: 'quantity_palet',
      },
      {
        type: 'dryMix',
        orderRows: dryMixedProductsOfOrders,
        productTable: latestDryMix,
        orderProductIdKey: 'dry_mixed_id',
        quantityKey: 'quantity_palet_dry',
      },
      {
        type: 'anchor',
        orderRows: anchorProductsOfOrders,
        productTable: latestAnchors,
        orderProductIdKey: 'anchor_id',
        quantityKey: 'quantity_palet_anchor',
      },
      {
        type: 'tool',
        orderRows: toolProductsOfOrders,
        productTable: latestTools,
        orderProductIdKey: 'tool_id',
        quantityKey: 'quantity_ud',
      },
      {
        type: 'relMat',
        orderRows: relMatProductsOfOrders,
        productTable: latestRelatedMaterials,
        orderProductIdKey: 'rel_mat_id',
        quantityKey: 'quantity_ud',
      },
    ];

    return sources.flatMap(
      ({ type, orderRows, productTable, orderProductIdKey, quantityKey }) => {
        return orderRows
          .filter((row) => Number(row.order_id) === Number(order.id))
          .map((orderProductRow) => {
            const productId = orderProductRow[orderProductIdKey];

            const productInfo = productTable.find(
              (product) => Number(product.id) === Number(productId),
            );

            if (!productInfo) return null;

            const fullDescription =
              productInfo.description ||
              productInfo.name ||
              productInfo.title ||
              productInfo.article ||
              '';

            return {
              type,
              orderProductId: orderProductRow.id,
              productId,
              article: productInfo.article || '',
              title: extractProductTitle(fullDescription),
              quantity: Number(orderProductRow[quantityKey] || 0),
            };
          })
          .filter(Boolean);
      },
    );
  };

  const onClickTrailer = (data) => {
    const currentOrder = list_of_orders.find(
      (order) => order.article === data.orders_article,
    );

    if (!currentOrder) return;

    getCurrentOrderInfoHandler(currentOrder);

    const trailerProducts = getTrailerProductsByOrder(currentOrder);

    const productNames = trailerProducts.map((product) => product.title);

    const uniqueProductNames = [
      ...new Set(trailerProducts.map((product) => product.title)),
    ];

    // console.log('trailerProducts', trailerProducts);
    // console.log('productNames', productNames);
    // console.log(
    //   'uniqueProductNames WMModalTrailer.jsx line 182',
    //   uniqueProductNames,
    // );

    setTrailerOrder(trailerProducts);
  };

  return (
    <Modal
      isOpen={wmmodalTrailer}
      toggle={toggle}
      size="lg"
      centered
      className="modal-auto-size"
    >
      <ModalHeader toggle={toggle}>Plan nuevo trailer</ModalHeader>

      <ModalBody>
        <Table
          COLUMN_DATA={WAREHOUSE_MANAGER_TRAILER_TABLE}
          dataOfTable={warehouse_trailer_data}
          // userAccess={userAccess}
          onClickButton={() => {}}
          buttonText={''}
          tableName={'Order dispatch'}
          handleRowClick={(row) => {
            onClickTrailer(row.original);
            setwmmodalTrailerModal(!wmmodalTrailerModal);
          }}
        />
      </ModalBody>

      <ModalFooter>
        <Button onClick={() => setwmmodalTrailer(!wmmodalTrailer)}>Close</Button>
      </ModalFooter>
    </Modal>
  );
}

export default WMModalTrailer;
