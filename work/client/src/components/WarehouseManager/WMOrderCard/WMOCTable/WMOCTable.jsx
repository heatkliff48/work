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
  } = useWarehouseContext();

  const {
    productsOfOrders,
    list_of_orders,
    dryMixedProductsOfOrders,
    anchorProductsOfOrders,
    toolProductsOfOrders,
    relMatProductsOfOrders,
  } = useOrderContext();

  const {
    wmoctModal,
    setWmoctModal,
    wmoctPdfModal,
    setWmoctPdfModal,
    wmoctPdfAddDataModal,
    setWmoctPdfAddDataModal,
  } = useModalContext();

  const { latestProducts } = useProductsContext();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { latestDryMix, latestAnchors, latestTools, latestRelatedMaterials } =
    useProductsTypeJournalContext();

  const productMap = {
    product: [latestProducts, productsOfOrders],
    dryMixed: [latestDryMix, dryMixedProductsOfOrders],
    anchor: [latestAnchors, anchorProductsOfOrders],
    tool: [latestTools, toolProductsOfOrders],
    relMat: [latestRelatedMaterials, relMatProductsOfOrders],
  };

  useEffect(() => {
    console.log('wmoctProduct state:', wmoctProduct);
  }, [wmoctProduct]);

  const handlePlusBatch = (product) => {
    console.log('Adding batch for product:', product.article);
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

              // const canPlus =
              //   remainingInBatch > 0 && qty_rem > 0 && shipped < qty_total;

              // const result = canPlus ? allocated + 1 : allocated;

              // const newRemainingInBatch = canPlus
              //   ? remainingInBatch - 1
              //   : remainingInBatch;

              // shipped = canPlus ? shipped + 1 : shipped;
              // qty_rem = canPlus ? qty_rem - 1 : qty_rem;

              // return {
              //   ...el,
              //   allocated: result,
              //   remainingInBatch: newRemainingInBatch,
              // };
            }

            return el;
          });

          return { ...wmoctItem, shipped, qty_rem, batches: newBatches };
        }

        return wmoctItem;
      })
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
      })
    );
  };

  // const handleMinus = (batch, batchIndex) => {
  //   setWmoctProduct((prev) =>
  //     prev.map((wmoctItem) => {
  //       if (wmoctItem.article === batch.article) {
  //         let { shipped, qty_rem } = wmoctItem;

  //         const newBatches = wmoctItem.batches.map((el, i) => {
  //           if (i === batchIndex) {
  //             const { allocated, minAllocated, remainingInBatch } = el;

  //             let minimunAllocated = !minAllocated ? 0 : minAllocated;
  //             const canMinus = allocated !== 0 && allocated > minimunAllocated;

  //             if (canMinus) {
  //               const newAllocated = allocated - 1;
  //               const newRemainingInBatch = remainingInBatch + 1;

  //               shipped = shipped - 1;
  //               qty_rem = qty_rem + 1;

  //               return {
  //                 ...el,
  //                 allocated: newAllocated,
  //                 remainingInBatch: newRemainingInBatch,
  //               };
  //             } else {
  //               return el;
  //             }
  //           }
  //           return el;
  //         });

  //         return { ...wmoctItem, shipped, qty_rem, batches: newBatches };
  //       }

  //       return wmoctItem;
  //     })
  //   );
  // };

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

  // useEffect(() => {
  //   setWmoctProductShippedBD([]);
  //   const shippedBDNext = [];
  //   console.log('product_list', product_list);

  //   const initialProducts = product_list.orders_products.map((el) => {
  //     const [article, quantityStr] = el.split(':').map((s) => s.trim());
  //     const quantity = Number(String(quantityStr).replace(/[^\d.]/g, ''));
  //     console.log('quantity', quantity);

  //     let shipped = 0;
  //     let qty_rem = quantity;
  //     const batches = [];

  //     const productType = getProductType(article);

  //     console.log('productType', productType);

  //     const warehouseMap = {
  //       product: warehouse_data,
  //       dryMixed: dry_mixes_warehouse_data,
  //       anchor: anchors_warehouse_data,
  //       tool: tools_warehouse_data,
  //       relMat: related_materials_warehouse_data,
  //     };

  //     const wh_arr = warehouseMap[productType];
  //     const [arr, orderArr] = productMap[productType] || [[], []];
  //     console.log('arr', arr);
  //     console.log('orderArr', orderArr);
  //     console.log('article', article);
  //     const product_from_list_id = arr?.find((p) => p.article === article)?.id;
  //     console.log('product_from_list_id', product_from_list_id);

  //     const order_from_list_id = product_list.order_id;

  //     const orders_products_id = orderArr?.find((poo) => {
  //       const productId =
  //         poo.product_id ||
  //         poo.dry_mixed_id ||
  //         poo.anchor_id ||
  //         poo.tool_id ||
  //         poo.rel_mat_id;

  //       return (
  //         productId == product_from_list_id && poo.order_id == order_from_list_id
  //       );
  //     })?.id;

  //     let list_of_batches;

  //     switch (productType) {
  //       case 'product':
  //         list_of_batches = list_of_reserved_products.filter(
  //           (batch) => batch.orders_products_id == orders_products_id
  //         );
  //         break;

  //       case 'relMat':
  //         list_of_batches = list_of_rel_mat_reserved_products?.filter(
  //           (batch) => batch.orders_products_id == orders_products_id
  //         );
  //         break;

  //       case 'tool':
  //         list_of_batches = list_of_tool_reserved_products?.filter(
  //           (batch) => batch.orders_products_id == orders_products_id
  //         );
  //         break;

  //       case 'dryMixed':
  //         list_of_batches = list_of_dry_mix_reserved_products?.filter(
  //           (batch) => batch.orders_products_id == orders_products_id
  //         );
  //         break;

  //       case 'anchor':
  //         list_of_batches = list_of_anchor_reserved_products?.filter(
  //           (batch) => batch.orders_products_id == orders_products_id
  //         );
  //         break;

  //       default:
  //         break;
  //     }

  //     if (list_of_batches?.length > 0) {
  //       list_of_batches.forEach((batch) => {
  //         console.log('batch', batch);
  //         const { quantity } = batch;

  //         const wrh_item = wh_arr.find((el) => el.id == batch.warehouse_id);

  //         console.log('WH ITEM', article, productType, {
  //           wh_article: wrh_item?.article,
  //           total: wrh_item?.total_quantity,
  //           ordered: wrh_item?.ordered_quantity,
  //           free: wrh_item?.free_quantity_remaining,
  //         });

  //         const base = wrh_item?.total_quantity ?? wrh_item?.ordered_quantity ?? 0;
  //         const min = quantity ?? 0;

  //         batches.push({
  //           batchId: wrh_item?.article,

  //           baseRemainingInBatch: base,
  //           remainingInBatch: base,

  //           allocated: min,
  //           minAllocated: min,
  //         });

  //         shipped += quantity;
  //         qty_rem -= quantity;
  //       });
  //     }

  //     shippedBDNext.push({ article, shipped, order_id: order_from_list_id });

  //     let productObj = {
  //       article,
  //       order_id: order_from_list_id,
  //       qty_total: quantity,
  //       shipped,
  //       qty_rem,
  //       batches,
  //       orders_products_id,
  //     };

  //     return productObj;
  //   });

  //   setWmoctProductShippedBD(shippedBDNext);
  //   setWmoctProduct(initialProducts);
  // }, [
  //   product_list,

  //   list_of_orders,

  //   latestProducts,
  //   latestDryMix,
  //   latestAnchors,
  //   latestTools,
  //   latestRelatedMaterials,

  //   productsOfOrders,
  //   dryMixedProductsOfOrders,
  //   anchorProductsOfOrders,
  //   toolProductsOfOrders,
  //   relMatProductsOfOrders,

  //   warehouse_data,
  //   dry_mixes_warehouse_data,
  //   anchors_warehouse_data,
  //   tools_warehouse_data,
  //   related_materials_warehouse_data,

  //   list_of_reserved_products,
  //   list_of_dry_mix_reserved_products,
  //   list_of_anchor_reserved_products,
  //   list_of_tool_reserved_products,
  //   list_of_rel_mat_reserved_products,
  // ]);

  useEffect(() => {
    if (!product_list?.orders_products) return;

    setWmoctProductShippedBD([]);
    const shippedBDNext = [];

    const initialProducts = product_list.orders_products
      .map((el) => {
        const match = el.match(/^([^:]+):\s*([\d.,]+)/);
        if (!match) {
          console.warn('Invalid product format:', el);
          return null;
        }

        const article = match[1].trim();
        let quantityStr = match[2].trim();

        quantityStr = quantityStr.replace(/[^\d.]/g, '');
        const quantity = parseFloat(quantityStr) || 0;

        let shipped = 0;
        let qty_rem = quantity;
        const batches = [];

        const productType = getProductType(article);

        const warehouseMap = {
          product: warehouse_data,
          dryMixed: dry_mixes_warehouse_data,
          anchor: anchors_warehouse_data,
          tool: tools_warehouse_data,
          relMat: related_materials_warehouse_data,
        };

        const wh_arr = warehouseMap[productType];
        const [arr, orderArr] = productMap[productType] || [[], []];

        const product_from_list_id = arr?.find((p) => p.article === article)?.id;
        const order_from_list_id = product_list.order_id;

        // Находим orders_products_id
        let orders_products_id = null;
        if (orderArr && product_from_list_id) {
          const orderProduct = orderArr.find((poo) => {
            const productId =
              poo.product_id ||
              poo.dry_mixed_id ||
              poo.anchor_id ||
              poo.tool_id ||
              poo.rel_mat_id;
            return (
              productId == product_from_list_id && poo.order_id == order_from_list_id
            );
          });

          orders_products_id = orderProduct?.id;
        }

        let list_of_batches = [];
        const reservedMap = {
          product: list_of_reserved_products,
          dryMixed: list_of_dry_mix_reserved_products,
          anchor: list_of_anchor_reserved_products,
          tool: list_of_tool_reserved_products,
          relMat: list_of_rel_mat_reserved_products,
        };

        if (orders_products_id) {
          switch (productType) {
            case 'product':
              list_of_batches = list_of_reserved_products.filter(
                (batch) => batch.orders_products_id == orders_products_id
              );
              break;

            case 'relMat':
              list_of_batches = list_of_rel_mat_reserved_products?.filter(
                (batch) => batch.orders_products_id == orders_products_id
              );
              break;

            case 'tool':
              list_of_batches = list_of_tool_reserved_products?.filter(
                (batch) => batch.orders_products_id == orders_products_id
              );
              break;

            case 'dryMixed':
              list_of_batches = list_of_dry_mix_reserved_products?.filter(
                (batch) => batch.orders_products_id == orders_products_id
              );
              break;

            case 'anchor':
              list_of_batches = list_of_anchor_reserved_products?.filter(
                (batch) => batch.orders_products_id == orders_products_id
              );
              break;

            default:
              break;
          }
        }

        // Формируем batches
        if (list_of_batches?.length > 0) {
          const processedWarehouseIds = new Set();

          list_of_batches.forEach((batch) => {
            const wh_item = wh_arr?.find((el) => el.id == batch.warehouse_id);

            if (wh_item && !processedWarehouseIds.has(wh_item.id)) {
              processedWarehouseIds.add(wh_item.id);

              const batchQuantity = Number(batch.quantity) || 0;
              const totalQuantity = Number(wh_item.total_quantity) || 0;
              const orderedQuantity = Number(wh_item.ordered_quantity) || 0;

              const baseAvailable = Math.max(
                totalQuantity - orderedQuantity + batchQuantity,
                0
              );

              batches.push({
                batchId: wh_item.article,
                baseRemainingInBatch: baseAvailable,
                remainingInBatch: baseAvailable,
                allocated: batchQuantity,
                minAllocated: batchQuantity,
                warehouseId: wh_item.id,
                orders_products_id: orders_products_id,
              });

              shipped += batchQuantity;
              qty_rem = Math.max(quantity - shipped, 0);
            }
          });

          // list_of_batches.forEach((batch) => {
          //   const wh_item = wh_arr?.find((el) => el.id == batch.warehouse_id);

          //   if (wh_item) {
          //     const batchQuantity = Number(batch.quantity) || 0;
          //     const totalQuantity = Number(wh_item.total_quantity) || 0;
          //     const orderedQuantity = Number(wh_item.ordered_quantity) || 0;

          //     // Рассчитываем доступное количество в партии
          //     const baseAvailable = Math.max(
          //       totalQuantity - orderedQuantity + batchQuantity,
          //       0
          //     );

          //     batches.push({
          //       batchId: wh_item.article || batch.warehouse_id,
          //       baseRemainingInBatch: baseAvailable,
          //       remainingInBatch: baseAvailable,
          //       allocated: batchQuantity,
          //       minAllocated: batchQuantity,
          //       warehouseId: wh_item.id,
          //     });

          //     shipped += batchQuantity;
          //     qty_rem = Math.max(quantity - shipped, 0);
          //   }
          // });
        }

        shippedBDNext.push({
          article,
          shipped,
          order_id: order_from_list_id,
          orders_products_id,
        });

        return {
          article,
          order_id: order_from_list_id,
          qty_total: quantity,
          shipped,
          qty_rem,
          batches,
          orders_products_id,
          product_name: arr?.find((p) => p.article === article)?.name || article,
        };
      })
      .filter((product) => product !== null);

    console.log('Initial products:', initialProducts);
    setWmoctProductShippedBD(shippedBDNext);
    setWmoctProduct(initialProducts);
  }, [
    product_list,

    list_of_orders,

    latestProducts,
    latestDryMix,
    latestAnchors,
    latestTools,
    latestRelatedMaterials,

    productsOfOrders,
    dryMixedProductsOfOrders,
    anchorProductsOfOrders,
    toolProductsOfOrders,
    relMatProductsOfOrders,

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
