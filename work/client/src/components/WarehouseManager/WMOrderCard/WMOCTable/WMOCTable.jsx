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

  //ради коммента
  useEffect(() => {
    console.log('wmoctProduct state:', wmoctProduct);
  }, [wmoctProduct]);

  const handlePlusBatch = (product) => {
    setSelectedProduct(product.article);
    setWmoctModal(true);
  };

  const handlePlus = (batch, batchIndex) => {
    console.log('handlePlus called with:', { batch, batchIndex });
    setWmoctProduct((prev) =>
      prev.map((wmoctItem) => {
        if (wmoctItem.article === batch.article) {
          let { shipped, qty_rem, qty_total } = wmoctItem;

          const newBatches = wmoctItem.batches.map((el, i) => {
            if (i === batchIndex) {
              const { allocated, remainingInBatch } = el;

              // Исправленная логика проверки
              const canPlus =
                remainingInBatch > 0 && // есть остаток в партии
                qty_rem > 0 && // есть неотгруженное количество
                shipped < qty_total; // общее отгруженное меньше общего заказанного

              console.log('Plus check:', {
                remainingInBatch,
                qty_rem,
                shipped,
                qty_total,
                canPlus,
              });

              const result = canPlus ? allocated + 1 : allocated;

              shipped = canPlus ? shipped + 1 : shipped;
              qty_rem = canPlus ? qty_rem - 1 : qty_rem;

              return { ...el, allocated: result };
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
        if (wmoctItem.article === batch.article) {
          // Изменено с == на ===
          let { shipped, qty_rem } = wmoctItem;

          const newBatches = wmoctItem.batches.map((el, i) => {
            const { allocated, minAllocated } = el;

            if (i === batchIndex) {
              // Изменено с == на ===
              let minimunAllocated = !minAllocated ? 0 : minAllocated;
              const canMinus = allocated != 0 && allocated > minimunAllocated;

              const result = canMinus ? allocated - 1 : minimunAllocated;
              shipped = canMinus ? shipped - 1 : shipped;
              qty_rem = canMinus ? qty_rem + 1 : qty_rem;

              return { ...el, allocated: result };
            }
            return el;
          });
          return { ...wmoctItem, shipped, qty_rem, batches: newBatches };
        }

        return wmoctItem;
      })
    );
  };

  const haveBatches = (i) => {
    return wmoctProduct[i]?.batches?.length > 0;
  };

  const isDisablePlus = (article) => {
    const result = wmoctProduct.some((el) => {
      if (el.article !== article) return false;
      const shouldDisable = el.qty_total === el.shipped || el.qty_rem === 0;
      console.log(`isDisablePlus for ${article}:`, {
        qty_total: el.qty_total,
        shipped: el.shipped,
        qty_rem: el.qty_rem,
        shouldDisable,
      });
      return shouldDisable;
    });
    return result;
  };

  const isDisableMinus = (article, batch) => {
    const result = wmoctProduct.some((el) => {
      const shouldDisable = el.article === article && batch.allocated === 0;
      console.log(`isDisableMinus for ${article}:`, {
        article: el.article,
        allocated: batch.allocated,
        shouldDisable,
      });
      return shouldDisable;
    });
    return result;
  };

  useEffect(() => {
    const initialProducts = product_list.orders_products.map((el) => {
      const [article, quantityStr] = el.split(':').map((s) => s.trim());
      const quantity = Number(quantityStr.slice(0, -1));

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

      const order_from_list_id = list_of_orders.find(
        (o) => o.article === product_list.orders_article
      )?.id;

      const orders_products_id = orderArr?.find((poo) => {
        const productId =
          poo.product_id ||
          poo.dry_mixed_id ||
          poo.anchor_id ||
          poo.tool_id ||
          poo.rel_mat_id;

        return (
          productId === product_from_list_id && poo.order_id === order_from_list_id
        );
      })?.id;

      let list_of_batches;

      switch (productType) {
        case 'product':
          list_of_batches = list_of_reserved_products.filter(
            (batch) => batch.orders_products_id === orders_products_id
          );
          break;

        case 'relMat':
          list_of_batches = list_of_rel_mat_reserved_products?.filter(
            (batch) => batch.orders_products_id === orders_products_id
          );
          break;

        case 'tool':
          list_of_batches = list_of_tool_reserved_products?.filter(
            (batch) => batch.orders_products_id === orders_products_id
          );
          break;

        case 'dryMixed':
          list_of_batches = list_of_dry_mix_reserved_products?.filter(
            (batch) => batch.orders_products_id === orders_products_id
          );
          break;

        case 'anchor':
          list_of_batches = list_of_anchor_reserved_products?.filter(
            (batch) => batch.orders_products_id === orders_products_id
          );
          break;

        default:
          break;
      }

      if (list_of_batches?.length > 0) {
        list_of_batches.forEach((batch) => {
          const { quantity } = batch;

          const wrh_item = wh_arr.find((el) => el.id == batch.warehouse_id);

          batches.push({
            batchId: wrh_item?.article,
            remainingInBatch: wrh_item?.ordered_quantity,
            allocated: quantity,
            minAllocated: quantity ?? 0,
          });
          shipped += quantity;
          qty_rem -= quantity;
        });
      }

      setWmoctProductShippedBD((prev) => {
        const haveProd = prev.find((el) => el.article == article);
        if (haveProd) return prev;
        return [...prev, { article, shipped }];
      });

      let productObj = {
        article,
        order_id: order_from_list_id,
        qty_total: quantity,
        shipped,
        qty_rem,
        batches,
        orders_products_id,
      };

      return productObj;
    });

    setWmoctProduct(initialProducts);
  }, [product_list, latestProducts, list_of_orders, list_of_reserved_products]);

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
