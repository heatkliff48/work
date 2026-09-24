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

export const calcBlockPriceWithDelivery = (product, deliveryPricePerM2) => {
  const price_m2 = Number(product?.price_m2 || 0);
  const quantity_m2 = Number(product?.quantity_m2 || 0);
  const discount = Number(product?.discount || 0);

  const price_m2_with_delivery = price_m2 + deliveryPricePerM2;
  const final_price =
    (price_m2_with_delivery * quantity_m2 * (100 - discount)) / 100;

  return {
    price_m2_with_delivery: Number(price_m2_with_delivery.toFixed(2)),
    final_price: Number(final_price.toFixed(2)),
  };
};
