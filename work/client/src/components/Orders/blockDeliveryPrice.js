// delivery_m2 is the order's delivery cost for all HCCA blocks. It is spread
// evenly over the blocks' real m2 and added to each line's price per m2.
// Shared by the order card and the accounting card so both show the same
// prices and totals.

export const getDeliveryPricePerM2 = (blocks, deliveryM2Total) => {
  const totalRealM2 = (blocks || []).reduce(
    (acc, el) => acc + (Number(el?.quantity_real) || 0),
    0,
  );
  const delivery = Number(deliveryM2Total || 0);
  if (!delivery || !totalRealM2) return 0;
  return delivery / totalRealM2;
};

// price_m2 and price_m2_with_delivery are list prices: the line's discount is
// applied only to final_price. This is the price per m2 the client pays.
export const applyDiscount = (price, discount) =>
  Math.round(Number(price || 0) * (100 - Number(discount || 0))) / 100;

// agent_commission is the order's agent fee, %. It raises the blocks' price
// per m2 and is layered on top of the stored list price_m2 at display time,
// like the delivery share, so a changed commission reprices the whole order.
export const applyAgentCommission = (price, agentCommission) =>
  Number(price || 0) * (1 + Number(agentCommission || 0) / 100);

// The confirming surcharge, % (see getOrderConfirmingSurcharge), raises the
// price of every product of the order, but not the delivery. Like the agent
// commission it is layered on top of the stored prices at display time.
export const applyConfirmingSurcharge = (price, surcharge) =>
  Number(price || 0) * (1 + Number(surcharge || 0) / 100);

const round2 = (value) => Number(value.toFixed(2));

// Dry mixes, anchors, tools and related materials: pvp and final_price with
// the surcharge. Only for display — Liberar saves the order's lines back as
// they are, so the stored prices must stay without it.
export const applyConfirmingSurchargeToLines = (lines, surcharge) => {
  if (!Number(surcharge)) return lines;

  return (lines || []).map((line) => ({
    ...line,
    pvp:
      line.pvp == null
        ? line.pvp
        : round2(applyConfirmingSurcharge(line.pvp, surcharge)),
    final_price:
      line.final_price == null
        ? line.final_price
        : round2(applyConfirmingSurcharge(line.final_price, surcharge)),
  }));
};

// Blocks get the surcharge in calcBlockPriceWithDelivery
export const applyConfirmingSurchargeToProductLists = (
  productLists,
  surcharge,
) => ({
  ...productLists,
  dryMixes: applyConfirmingSurchargeToLines(productLists.dryMixes, surcharge),
  anchors: applyConfirmingSurchargeToLines(productLists.anchors, surcharge),
  tools: applyConfirmingSurchargeToLines(productLists.tools, surcharge),
  related_materials: applyConfirmingSurchargeToLines(
    productLists.related_materials,
    surcharge,
  ),
});

// The client pays for the m2 actually shipped (whole pallets), so the line is
// priced on quantity_real, not on the requested quantity_m2.
// price_m2_with_markups is the list price_m2 raised by the agent commission
// and the confirming surcharge, without delivery.
export const calcBlockPriceWithDelivery = (
  product,
  deliveryPricePerM2,
  agentCommission = 0,
  confirmingSurcharge = 0,
) => {
  const price_m2_with_markups = applyConfirmingSurcharge(
    applyAgentCommission(product?.price_m2, agentCommission),
    confirmingSurcharge,
  );
  const quantity_real = Number(product?.quantity_real || 0);
  const discount = Number(product?.discount || 0);

  const price_m2_with_delivery = price_m2_with_markups + deliveryPricePerM2;
  const final_price =
    (price_m2_with_delivery * quantity_real * (100 - discount)) / 100;

  return {
    price_m2_with_markups: round2(price_m2_with_markups),
    price_m2_with_delivery: round2(price_m2_with_delivery),
    final_price: round2(final_price),
  };
};
