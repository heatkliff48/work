// Shared with WarehouseContext.js (source of ListOfOrderedProduction.jsx /
// listOfOrderedCakes) and ProductionBatchDesigner (which needs to reproduce
// that same calculation locally, e.g. to work out the true un-padded amount
// still owed to an order while editing an already-saved autoclave, before any
// of it is reflected in the server-side batchOutside/list_of_ordered_production
// state).

const ORDER_STATUS_EXCLUDED = [7, 8, 9, 10];

function toTime(d) {
  if (d == null) return Number.MAX_SAFE_INTEGER; // empty => sort to the end
  if (typeof d === 'number') return d;
  if (d instanceof Date) return d.getTime();
  if (typeof d === 'string') {
    const t = Date.parse(d);
    if (!Number.isNaN(t)) return t;

    const m = d.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    if (m) {
      const [, dd, mm, yyyy] = m;
      return new Date(+yyyy, +mm - 1, +dd).getTime();
    }
  }
  return Number.MAX_SAFE_INTEGER;
}

function extractProductTitle(value = '') {
  if (!value) return '';

  return String(value)
    .replace(/BAUBLOCK®/gi, '')
    .replace(/\s*Medidas[\s\S]*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Rebuilds "listOfOrderedCakes": for every still-open order in
// list_of_ordered_production, works out how much of it is already covered by
// batchOutside (quantity_in_batch), distributing produced quantity FIFO by
// shipping date across orders of the same article. Pass a `batchOutside`
// array that differs from the live redux state (e.g. with one date's records
// removed) to see what the table would look like without that date's
// contribution.
export function computeListOfOrderedCakes({
  latestProducts,
  list_of_orders,
  list_of_ordered_production,
  batchOutside,
}) {
  if (!Array.isArray(latestProducts) || latestProducts.length === 0) return [];
  if (!Array.isArray(list_of_orders) || list_of_orders.length === 0) return [];
  if (!Array.isArray(list_of_ordered_production)) return [];

  const baseOrders = list_of_ordered_production
    .filter((el) => {
      const orderStatus = list_of_orders.find(
        (order) => order.article === el.order_article,
      )?.status;

      return !ORDER_STATUS_EXCLUDED.includes(orderStatus);
    })
    .map((el) => {
      const product = latestProducts.find((prod) => prod.article === el.product_article);

      const arraysPerPalletRaw = Math.floor(
        (product?.m3InArray ?? 0) / (product?.volumeBlockOnPallet ?? 1),
      );
      const arraysPerPallet = arraysPerPalletRaw > 0 ? arraysPerPalletRaw : 1;

      const quantity_cakes = Math.ceil((Number(el.quantity) || 0) / arraysPerPallet);

      return {
        ...el,
        quantity_cakes,
        quantity_in_batch: 0,
        shipping_ts: toTime(el.shipping_date),
      };
    });

  const byArticle = new Map();
  const idSetByArticle = new Map();

  for (const item of baseOrders) {
    if (!byArticle.has(item.product_article)) {
      byArticle.set(item.product_article, []);
      idSetByArticle.set(item.product_article, new Set());
    }
    byArticle.get(item.product_article).push(item);
    idSetByArticle.get(item.product_article).add(item.id);
  }

  for (const list of byArticle.values()) {
    list.sort((a, b) => a.shipping_ts - b.shipping_ts || a.id - b.id);
  }

  const producedByArticle = new Map();

  for (const batch of Array.isArray(batchOutside) ? batchOutside : []) {
    const m3InArray = latestProducts?.find(
      (p) => p.article == batch.product_article,
    )?.m3InArray;
    const volumeBlockOnPallet = latestProducts?.find(
      (p) => p.article == batch.product_article,
    )?.volumeBlockOnPallet;

    const producedUnits =
      (Number(batch.quantity_pallets) || 0) / Math.floor(m3InArray / volumeBlockOnPallet);

    let art = batch.product_article;

    if (!art) {
      for (const [pa, idSet] of idSetByArticle.entries()) {
        if (
          batch.id_list_of_ordered_production &&
          idSet.has(batch.id_list_of_ordered_production)
        ) {
          art = pa;
          break;
        }
      }
    }

    if (!art) continue;

    producedByArticle.set(art, (producedByArticle.get(art) || 0) + producedUnits);
  }

  for (const [article, orders] of byArticle.entries()) {
    let remaining = producedByArticle.get(article) || 0;

    for (const order of orders) {
      if (remaining <= 0) {
        order.quantity_in_batch = 0;
        continue;
      }

      const need = Number(order.quantity_cakes) || 0;
      const alloc = Math.min(need, remaining);

      order.quantity_in_batch = alloc;
      remaining -= alloc;
    }
  }

  return Array.from(byArticle.values())
    .flat()
    .reduce((uniqueItems, item) => {
      if (
        !uniqueItems.some(
          (el) =>
            el.product_article === item.product_article &&
            el.order_article === item.order_article,
        )
      ) {
        const product = latestProducts.find((prod) => prod.article == item.product_article);
        const tradingMark = extractProductTitle(product?.description || '');
        uniqueItems.push({ ...item, tradingMark });
      }
      return uniqueItems;
    }, []);
}

// Same "how many cakes are actually still owed" formula used when building
// productionBatchDesigner rows from an order record (see
// ProductionBatchDesignerNew.jsx): pallets ordered minus what's already in
// the warehouse and already accounted for in batches, converted to cakes with
// the defect norm applied.
export function computeOrderRemainingCakes(orderRecord, product) {
  if (!orderRecord || !product) {
    return { rightQuantity: 0, palletsPerArray: 1, total_cakes: 0 };
  }

  const { quantity, quantity_in_warehouse, quantity_in_batch } = orderRecord;
  const { volumeBlockOnPallet, normOfBrack, m3InArray } = product;

  const palletsPerArray = Math.max(
    1,
    Math.floor(Number(m3InArray || 0) / Number(volumeBlockOnPallet || 1)) || 1,
  );

  const rightQuantity =
    (Number(quantity) || 0) -
    ((Number(quantity_in_warehouse) || 0) + (Number(quantity_in_batch) || 0) * palletsPerArray);

  const product_with_brack = rightQuantity / palletsPerArray + Number(normOfBrack || 0);

  const total_cakes = Math.max(0, Math.ceil(product_with_brack));

  return { rightQuantity, palletsPerArray, total_cakes };
}
