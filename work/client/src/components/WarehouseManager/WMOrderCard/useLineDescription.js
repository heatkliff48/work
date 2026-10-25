import { useCallback } from 'react';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import {
  extractProductTitle,
  useProductsContext,
} from '#components/contexts/ProductContext.js';
import { palletRows } from '#utils/palletDimensions.js';

// Block on its pallet, e.g. "TERMECO 30. Pall 1200*800. Height 90cm (3 blocks)."
// Height is the block stack only: rows counted the way the product card
// counts them for blocks per pallet.
const blockDescription = (catalog) => {
  if (!catalog) return '';

  const parts = [
    extractProductTitle(catalog.description) || catalog.tradingMark,
    catalog.palletSize && `Pall ${catalog.palletSize.replace('x', '*')}`,
  ];

  const width = Number(catalog.width);
  const rows = palletRows(catalog);
  if (width && rows) {
    const heightCm = parseFloat(((rows * width) / 10).toFixed(2));

    parts.push(
      `Height ${heightCm}cm (${rows} ${rows === 1 ? 'block' : 'blocks'})`,
    );
  }

  return parts
    .filter(Boolean)
    .map((part) => `${part}.`)
    .join(' ');
};

// Description of a wmoctProduct line, shared by the order card table and the
// printed warehouse sheet.
export const useLineDescription = () => {
  const { productsOfOrders } = useOrderContext();
  const { latestProducts, productVersions } = useProductsContext();

  // The order line keeps the product version it was ordered with; if the line
  // isn't loaded, the latest card of the same article has the same packaging.
  return useCallback(
    (product) => {
      if (product.product_type !== 'product') return product.product_name;

      const orderLine = (productsOfOrders || []).find(
        (line) => Number(line.id) === Number(product.orders_products_id),
      );
      const catalog =
        (productVersions || []).find((c) => c.id === orderLine?.product_id) ||
        (latestProducts || []).find((c) => c.article === product.article);

      return blockDescription(catalog) || product.product_name;
    },
    [productsOfOrders, latestProducts, productVersions],
  );
};
