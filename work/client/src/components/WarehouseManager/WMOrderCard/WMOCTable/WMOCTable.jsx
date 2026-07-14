import { Fragment, useEffect, useState } from 'react';
import WMOCTableModal from './WMOCTableModal';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import WMOCPDFModal from '../WMOPdf/WMOPDFModal';
import WMOCTableDataModal from './WMOCTableDataModal';
import WMOCTProduct from './WMOCTProduct/WMOCTProduct';
import { useProductsTypeJournalContext } from '#components/contexts/ProductsTypeJournalContext.js';

const WMOCTable = ({ product_list, orderCartData }) => {
  const {
    wmoctProduct,
    setWmoctProduct,
    setWmoctProductShippedBD,
    warehouse_data,
    list_of_reserved_products,
    list_of_dry_mix_reserved_products,
    list_of_anchor_reserved_products,
    list_of_tool_reserved_products,
    list_of_rel_mat_reserved_products,
    setAldabaranNum,
    aldabaran,
    getProductType,
    dry_mixes_warehouse_data,
    anchors_warehouse_data,
    tools_warehouse_data,
    related_materials_warehouse_data,
    normalizeProductType,
  } = useWarehouseContext();

  // const {
  //   productsOfOrders,
  //   list_of_orders,
  //   dryMixedProductsOfOrders,
  //   anchorProductsOfOrders,
  //   toolProductsOfOrders,
  //   relMatProductsOfOrders,
  // } = useOrderContext();

  const {
    wmoctModal,
    setWmoctModal,
    wmoctPdfModal,
    setWmoctPdfModal,
    wmoctPdfAddDataModal,
    setWmoctPdfAddDataModal,
  } = useModalContext();

  // const { latestDryMix, latestAnchors, latestTools, latestRelatedMaterials } =
  //   useProductsTypeJournalContext();

  // const { latestProducts } = useProductsContext();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const currentRecordKey = `${Number(product_list?.order_id || 0)}_${Number(
    product_list?.trailer || 0,
  )}`;

  useEffect(() => {
    // setWmoctProduct([]);
    // setWmoctProductShippedBD([]);

    setSelectedProduct(null);
    setWmoctModal(false);
  }, [currentRecordKey]);

  // const productMap = {
  //   product: [latestProducts, productsOfOrders],
  //   dryMixed: [latestDryMix, dryMixedProductsOfOrders],
  //   anchor: [latestAnchors, anchorProductsOfOrders],
  //   tool: [latestTools, toolProductsOfOrders],
  //   relMat: [latestRelatedMaterials, relMatProductsOfOrders],
  // };

  const handlePlusBatch = (product) => {
    setSelectedProduct(product.article);
    setWmoctModal(true);
  };

  const handlePlus = (productObj, batchIndex) => {
    setWmoctProduct((prev) =>
      prev.map((wmoctItem) => {
        if (wmoctItem.article === productObj.article) {
          let { shipped, qty_rem, qty_total } = wmoctItem;

          const newBatches = wmoctItem.batches.map((el, i) => {
            if (i === batchIndex) {
              const { allocated, baseRemainingInBatch, minAllocated = 0 } = el;

              const allocatedNum = Number(allocated || 0);
              const minNum = Number(minAllocated || 0);
              const baseNum = Number(baseRemainingInBatch || 0);

              const delta = allocatedNum - minNum;

              const canPlus = delta < baseNum && qty_rem > 0 && shipped < qty_total;

              if (!canPlus) return el;

              const newAllocated = allocatedNum + 1;
              const newDelta = newAllocated - minNum;
              const newRemainingInBatch = Math.max(baseNum - newDelta, 0);

              shipped += 1;
              qty_rem -= 1;

              return {
                ...el,
                allocated: newAllocated,
                remainingInBatch: newRemainingInBatch,
              };
            }

            return el;
          });

          return { ...wmoctItem, shipped, qty_rem, batches: newBatches };
        }

        return wmoctItem;
      }),
    );
  };

  const handleMinus = (batch, batchIndex) => {
    setWmoctProduct((prev) =>
      prev.map((wmoctItem) => {
        if (wmoctItem.article !== batch.article) return wmoctItem;

        let { shipped, qty_rem } = wmoctItem;

        const newBatches = wmoctItem.batches.map((el, i) => {
          if (i !== batchIndex) return el;

          const allocatedNum = Number(el.allocated || 0);
          const minNum = Number(el.minAllocated || 0);
          const baseNum = Number(el.baseRemainingInBatch || 0);

          if (allocatedNum <= minNum) return el;

          const newAllocated = allocatedNum - 1;
          const newDelta = newAllocated - minNum;
          const newRemainingInBatch = Math.max(baseNum - newDelta, 0);

          shipped -= 1;
          qty_rem += 1;

          return {
            ...el,
            allocated: newAllocated,
            remainingInBatch: newRemainingInBatch,
          };
        });

        return { ...wmoctItem, shipped, qty_rem, batches: newBatches };
      }),
    );
  };

  const haveBatches = (i) => {
    return wmoctProduct[i]?.batches?.length > 0;
  };

  const isDisablePlus = (article) => {
    const result = wmoctProduct.some((el) => {
      if (el.article !== article) return false;
      const shouldDisable = el.qty_total === el.shipped || el.qty_rem === 0;

      return shouldDisable;
    });
    return result;
  };

  const isDisableMinus = (article, batch) => {
    const result = wmoctProduct.some((el) => {
      const shouldDisable = el.article === article && batch.allocated === 0;

      return shouldDisable;
    });
    return result;
  };

  useEffect(() => {
    if (
      !Array.isArray(product_list?.dispatchItems) ||
      product_list.dispatchItems.length === 0
    ) {
      return;
    }

    const getReservedList = (type) => {
      switch (type) {
        case 'product':
          return list_of_reserved_products || [];

        case 'dryMixed':
          return list_of_dry_mix_reserved_products || [];

        case 'anchor':
          return list_of_anchor_reserved_products || [];

        case 'tool':
          return list_of_tool_reserved_products || [];

        case 'relMat':
          return list_of_rel_mat_reserved_products || [];

        default:
          return [];
      }
    };
    console.log('warehouse_data WMOCTable.jsx line 214', warehouse_data);
    const warehouseByType = {
      product: warehouse_data || [],
      dryMixed: dry_mixes_warehouse_data || [],
      anchor: anchors_warehouse_data || [],
      tool: tools_warehouse_data || [],
      relMat: related_materials_warehouse_data || [],
    };

    const shippedBDNext = [];

    const initialProducts = product_list.dispatchItems
      .map((dispatchItem) => {
        const orderDispatchId = Number(dispatchItem.id);

        if (!Number.isFinite(orderDispatchId) || orderDispatchId <= 0) {
          console.warn('Invalid order_dispatch_id in WMOCTable:', dispatchItem);

          return null;
        }

        const article = dispatchItem.article;

        const quantity = Number(dispatchItem.quantity || 0);

        const orderId = Number(dispatchItem.orderId ?? product_list.order_id);

        const trailer = Number(dispatchItem.trailer ?? product_list.trailer);

        const ordersProductsId = Number(dispatchItem.orderProductId);

        const productType = normalizeProductType(
          dispatchItem.product_table || getProductType(article),
        );

        const warehouseArray = warehouseByType[productType] || [];

        const reservedList = getReservedList(productType);

        console.log('reservedList WMOCTable.jsx line 253', reservedList);
        const reservedForCurrentDispatch = reservedList.filter(
          (reservedItem) =>
            Number(reservedItem.order_dispatch_id) === orderDispatchId &&
            Number(reservedItem.orders_products_id) === ordersProductsId,
        );

        console.log('RESTORE RESERVE', {
          article,
          productType,
          orderDispatchId,
          ordersProductsId,
          reservedList,
          reservedForCurrentDispatch,
        });

        const reservedByWarehouse = Array.from(
          reservedForCurrentDispatch
            .reduce((map, reservedItem) => {
              const warehouseId = Number(reservedItem.warehouse_id);

              const previous = map.get(warehouseId);

              if (previous) {
                previous.quantity += Number(reservedItem.quantity || 0);
              } else {
                map.set(warehouseId, {
                  ...reservedItem,
                  warehouse_id: warehouseId,
                  quantity: Number(reservedItem.quantity || 0),
                });
              }

              return map;
            }, new Map())
            .values(),
        );

        const totalReserved = reservedByWarehouse.reduce(
          (sum, reservedItem) => sum + Number(reservedItem.quantity || 0),
          0,
        );

        const shipped = Math.min(totalReserved, quantity);

        const qtyRem = Math.max(quantity - shipped, 0);
        const batches = reservedByWarehouse
          .map((reservedItem) => {
            const warehouseItem = warehouseArray.find(
              (item) => Number(item.id) === Number(reservedItem.warehouse_id),
            );

            if (!warehouseItem) {
              console.warn('Warehouse item not found for reserve:', {
                productType,
                orderDispatchId,
                reservedItem,
                warehouseArray,
              });

              return null;
            }

            const allocated = Number(reservedItem.quantity || 0);

            const remainingInBatch = Number(warehouseItem.total_quantity || 0);

            return {
              batchId: warehouseItem.article,
              warehouseId: warehouseItem.id,

              orders_products_id: ordersProductsId,

              order_dispatch_id: orderDispatchId,

              baseRemainingInBatch: remainingInBatch,

              remainingInBatch,

              allocated,
              minAllocated: allocated,

              dbReservedQuantity: allocated,
            };
          })
          .filter(Boolean);

        shippedBDNext.push({
          article,
          shipped,
          order_id: orderId,

          orders_products_id: ordersProductsId,

          order_dispatch_id: orderDispatchId,

          product_type: productType,
        });

        return {
          article,
          order_id: orderId,
          trailer,
          product_type: productType,

          order_dispatch_id: orderDispatchId,

          qty_total: quantity,
          shipped,
          qty_rem: qtyRem,

          batches,

          orders_products_id: ordersProductsId,

          product_name: dispatchItem.title || article,
        };
      })
      .filter(Boolean);

    console.log('Restored wmoctProduct:', initialProducts);

    setWmoctProductShippedBD(shippedBDNext);

    setWmoctProduct(initialProducts);
  }, [
    product_list,

    warehouse_data,
    dry_mixes_warehouse_data,
    anchors_warehouse_data,
    tools_warehouse_data,
    related_materials_warehouse_data,

    list_of_reserved_products,
    list_of_dry_mix_reserved_products,
    list_of_anchor_reserved_products,
    list_of_tool_reserved_products,
    list_of_rel_mat_reserved_products,
  ]);

  useEffect(() => {
    const lastNum = aldabaran.length > 0 ? aldabaran.length + 1 : 1;
    setAldabaranNum(lastNum);
  }, [aldabaran]);

  return (
    <>
      <WMOCTableModal
        isOpen={wmoctModal}
        toggle={() => {
          setWmoctModal(!wmoctModal);
          setSelectedProduct(null);
        }}
        selectedProduct={selectedProduct}
      />
      <WMOCPDFModal
        isOpen={wmoctPdfModal}
        toggle={() => {
          setWmoctPdfModal(!wmoctPdfModal);
        }}
        orderCartData={orderCartData}
      />
      <WMOCTableDataModal
        isOpen={wmoctPdfAddDataModal}
        toggle={() => {
          setWmoctPdfAddDataModal(!wmoctPdfAddDataModal);
        }}
      />
      <WMOCTProduct
        haveBatches={haveBatches}
        handlePlusBatch={handlePlusBatch}
        handlePlus={handlePlus}
        handleMinus={handleMinus}
        isDisablePlus={isDisablePlus}
        isDisableMinus={isDisableMinus}
      />
    </>
  );
};

export default WMOCTable;
