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

// The client pays for the m2 actually shipped (whole pallets), so the line is
// priced on quantity_real, not on the requested quantity_m2.
export const calcBlockPriceWithDelivery = (
  product,
  deliveryPricePerM2,
  agentCommission = 0,
) => {
  const price_m2_with_agent = applyAgentCommission(
    product?.price_m2,
    agentCommission,
  );
  const quantity_real = Number(product?.quantity_real || 0);
  const discount = Number(product?.discount || 0);

  const price_m2_with_delivery = price_m2_with_agent + deliveryPricePerM2;
  const final_price =
    (price_m2_with_delivery * quantity_real * (100 - discount)) / 100;

  return {
    price_m2_with_agent: Number(price_m2_with_agent.toFixed(2)),
    price_m2_with_delivery: Number(price_m2_with_delivery.toFixed(2)),
    final_price: Number(final_price.toFixed(2)),
  };
};
