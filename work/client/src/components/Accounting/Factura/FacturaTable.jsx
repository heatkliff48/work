import { useEffect, useState } from 'react';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useProductsTypeJournalContext } from '#components/contexts/ProductsTypeJournalContext.js';

const FacturaTable = ({ product_list, orderCartData }) => {
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
    getProductType,
    dry_mixes_warehouse_data,
    anchors_warehouse_data,
    tools_warehouse_data,
    related_materials_warehouse_data,
    warehouseMap,
  } = useWarehouseContext();

  const {
    productsOfOrders,
    list_of_orders,
    dryMixedProductsOfOrders,
    anchorProductsOfOrders,
    toolProductsOfOrders,
    relMatProductsOfOrders,
  } = useOrderContext();

  const { latestProducts } = useProductsContext();
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
    if (!product_list?.orders_products_articles) return;

    setWmoctProductShippedBD([]);
    const shippedBDNext = [];

    const initialProducts = product_list.orders_products_articles
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

        const wh_arr = warehouseMap[productType];
        const [arr, orderArr] = productMap[productType] || [[], []];

        const product_from_list_id = arr?.find(
          (p) => p.article === article,
        )?.id;
        const order_from_list_id = product_list.order_id;

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
              productId == product_from_list_id &&
              poo.order_id == order_from_list_id
            );
          });

          orders_products_id = orderProduct?.id;
        }

        let list_of_batches = [];

        if (orders_products_id) {
          switch (productType) {
            case 'product':
              list_of_batches = list_of_reserved_products.filter(
                (batch) => batch.orders_products_id == orders_products_id,
              );
              break;

            case 'relMat':
              list_of_batches = list_of_rel_mat_reserved_products?.filter(
                (batch) => batch.orders_products_id == orders_products_id,
              );
              break;

            case 'tool':
              list_of_batches = list_of_tool_reserved_products?.filter(
                (batch) => batch.orders_products_id == orders_products_id,
              );
              break;

            case 'dryMixed':
              list_of_batches = list_of_dry_mix_reserved_products?.filter(
                (batch) => batch.orders_products_id == orders_products_id,
              );
              break;

            case 'anchor':
              list_of_batches = list_of_anchor_reserved_products?.filter(
                (batch) => batch.orders_products_id == orders_products_id,
              );
              break;

            default:
              break;
          }
        }

        if (list_of_batches?.length > 0) {
          const processedWarehouseIds = new Set();

          list_of_batches.forEach((batch) => {
            const wh_item = wh_arr?.find((el) => el.id == batch.warehouse_id);

            if (wh_item && !processedWarehouseIds.has(wh_item.id)) {
              processedWarehouseIds.add(wh_item.id);

              const batchQuantity = Number(batch.quantity) || 0;
              const orderedQuantity = Number(wh_item.total_quantity);

              batches.push({
                batchId: wh_item.article,
                baseRemainingInBatch: orderedQuantity,
                remainingInBatch: orderedQuantity,
                allocated: batchQuantity,
                minAllocated: batchQuantity,
                warehouseId: wh_item.id,
                orders_products_id: orders_products_id,
              });

              shipped += batchQuantity;
              qty_rem = Math.max(quantity - shipped, 0);
            }
          });
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
          product_name:
            arr?.find((p) => p.article === article)?.name || article,
        };
      })
      .filter((product) => product !== null);
    console.log(initialProducts, 'initialProducts FacturaTable.jsx line 186');

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

  return (
    <table className="ord-prod-table">
      <thead>
        <tr>
          <th>Product article</th>
          <th>Qty total, pallet</th>
          <th>Qty shipped, pallet</th>
          <th>Qty remaining, pallet</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(wmoctProduct) && wmoctProduct.length > 0 ? (
          wmoctProduct.map((product) => (
            <tr key={product.article}>
              <td>
                <span className="ord-mono">{product.article}</span>
              </td>
              <td>{product.qty_total}</td>
              <td>{product.shipped}</td>
              <td
                className={
                  product.qty_rem > 0 ? 'fac-qty-rem--pending' : undefined
                }
              >
                {product.qty_rem}
              </td>
              {/* {product.batches?.length > 0 ? (
                <>
                  <td className="border p-1">
                    {product.batches[0]?.batchId}
                  </td>
                  <td className="border p-1">
                    {product.batches[0]?.remainingInBatch}
                  </td>
                  <td className="border p-1">
                    {product.batches[0]?.allocated}
                  </td>
                </>
              ) : (
                <></>
              )} */}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={4} className="ord-empty-products">
              No products dispatched on this trailer.
            </td>
          </tr>
        )}
        {/* Дополнительные строки для батчей */}
        {/* {product.batches?.slice(1).map((batch, batchIndex) => (
          <tr key={`${product.article}__${batch.batchId}`}>
            <td className="border p-1"></td>
            <td className="border p-1"></td>
            <td className="border p-1"></td>
            <td className="border p-1"></td>
          </tr>
        ))} */}
      </tbody>
    </table>
  );
};

export default FacturaTable;
