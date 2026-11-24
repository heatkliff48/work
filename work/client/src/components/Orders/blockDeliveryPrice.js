import { orderLineHasClientPrice } from '#utils/clientProductPrice.js';

// delivery_m2 is the order's delivery cost for all HCCA blocks. It is spread
// evenly over the blocks' real m2 and added to each line's price per m2.
// Lines whose product and client are in the client price table are left out:
// that delivery does not apply to them. Shared by the order card and the
// accounting card so both show the same prices and totals.
//
// When an order has lines with a fixed price with delivery (fixed_price_m2_with_delivery),
// the transport cost embedded in those lines ((fixed - base) * qty) is already
// included in their line price. Only delivery exceeding that fixed sum should
// be spread over the remaining lines.

export const blockGetsOrderDelivery = (product, clientPrices, clientId) => {
  const hasFixedDeliveryPrice =
    product?.fixed_price_m2_with_delivery != null &&
    product?.fixed_price_m2_with_delivery !== '';
  if (hasFixedDeliveryPrice) return false;
  return !orderLineHasClientPrice(clientPrices, {
    productId: product?.product_id,
    clientId,
  });
};

export const getFixedDeliveryTotal = (blocks) => {
  return (blocks || []).reduce((acc, el) => {
    const fixedPrice = el?.fixed_price_m2_with_delivery;
    if (fixedPrice != null && fixedPrice !== '') {
      const fixed = Number(fixedPrice);
      const base = Number(el?.price_m2 || 0);
      const qty = Number(el?.quantity_real ?? el?.quantity_m2 ?? 0);
      if (fixed > base && qty > 0) {
        return acc + Number(((fixed - base) * qty).toFixed(2));
      }
    }
    return acc;
  }, 0);
};

export const getDeliveryPricePerM2 = (
  blocks,
  deliveryM2Total,
  allBlocks = null,
) => {
  const totalRealM2 = (blocks || []).reduce(
    (acc, el) => acc + (Number(el?.quantity_real) || 0),
    0,
  );
  const delivery = Number(deliveryM2Total || 0);
  if (!delivery || !totalRealM2) return 0;

  const blocksForFixed = allBlocks || blocks;
  const fixedDelivery = getFixedDeliveryTotal(blocksForFixed);
  const remainingDelivery = Math.max(
    0,
    Number((delivery - fixedDelivery).toFixed(2)),
  );

  if (!remainingDelivery) return 0;
  return remainingDelivery / totalRealM2;
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

// The confirming surcharge, % (see getOrderConfirmingSurcharge), is a payment
// term markup on HCCA blocks only. It is applied to the price that already
// includes the delivery share, which is the price used for the line total.
// The base price per m2 is left unchanged. Dry mixes, anchors, tools, related
// materials and the separate explicit delivery amount are not affected. Like
// the agent commission it is layered on at display time and is not stored on
// the line.
export const applyConfirmingSurcharge = (price, surcharge) =>
  Number(price || 0) * (1 + Number(surcharge || 0) / 100);

const round2 = (value) => Number(value.toFixed(2));

// The client pays for the m2 actually shipped (whole pallets), so the line is
// priced on quantity_real, not on the requested quantity_m2.
// price_m2_with_markups is the list price_m2 raised by the agent commission
// only. The confirming surcharge does not change it.
// Скидка клиента применяется ТОЛЬКО к цене блока и НЕ влияет на доставку.
// price_m2_with_delivery — цена за м² с доставкой, которую платит клиент
// (цена блока со скидкой + доставка за 1 м²).
export const calcBlockPriceWithDelivery = (
  product,
  deliveryPricePerM2,
  agentCommission = 0,
  confirmingSurcharge = 0,
  orderDeliveryM2 = null,
) => {
  const fixedDeliveryPrice = product?.fixed_price_m2_with_delivery;
  if (fixedDeliveryPrice != null && fixedDeliveryPrice !== '') {
    // Цена с проектом — это сама Price with delivery. Цена за м² остаётся
    // ценой клиента без проекта, и к ней по-прежнему добавляется комиссия агента.
    const price_m2_with_delivery = round2(Number(fixedDeliveryPrice));
    const price_m2_with_markups = round2(
      applyAgentCommission(product?.price_m2, agentCommission),
    );
    const quantity_real = Number(product?.quantity_real || 0);
    const discount = Number(product?.discount || 0);
    const netPrice = (price_m2_with_delivery * (100 - discount)) / 100;
    const final_price = netPrice * quantity_real;

    // Вывод в консоль для фиксированной проектной цены
    console.log('[price_m2_with_delivery (фиксированная)]', {
      product: product?.name || product?.product_article || product?.id,
      priceAfterAgent: price_m2_with_markups,
      deliveryPricePerM2: Number(deliveryPricePerM2) ? round2(deliveryPricePerM2) : 0,
      'order.delivery_m2': orderDeliveryM2,
      quantity_real,
      agent_commission: agentCommission,
      priceWithDeliveryBase: price_m2_with_delivery,
      price_m2_with_delivery: round2(netPrice),
      surcharge: confirmingSurcharge,
    });

    return {
      price_m2_with_markups,
      price_m2_with_delivery: round2(netPrice),
      final_price: round2(final_price),
    };
  }

  // 1. priceAfterAgent: цена за м² с учетом комиссии агента (agent_commission, %)
  const priceAfterAgent = applyAgentCommission(
    product?.price_m2,
    agentCommission,
  );

  // 2. deliveryPricePerM2: доля стоимости доставки на 1 м²
  const delivery = Number(deliveryPricePerM2 || 0);

  // 3. priceWithDeliveryBase: базовая цена м² с доставкой (цена после агента + доставка)
  const priceWithDeliveryBase = priceAfterAgent + delivery;

  // Надбавка confirming на цену блока и доставку
  const blockPriceWithSurcharge = applyConfirmingSurcharge(
    priceAfterAgent,
    confirmingSurcharge,
  );
  const deliveryWithSurcharge = applyConfirmingSurcharge(
    delivery,
    confirmingSurcharge,
  );

  const price_m2_with_markups = priceAfterAgent;
  const quantity_real = Number(product?.quantity_real || 0);
  const discount = Number(product?.discount || 0);

  // 4. Скидка применяется ТОЛЬКО к цене блока, НЕ к доставке
  const blockNetPriceM2 = (blockPriceWithSurcharge * (100 - discount)) / 100;
  const blockTotal = blockNetPriceM2 * quantity_real;

  // 5. Стоимость доставки без применения скидки
  const deliveryTotal = deliveryWithSurcharge * quantity_real;

  // 6. Итоговая сумма по строке (блок со скидкой + доставка)
  const final_price = blockTotal + deliveryTotal;

  // 7. Итоговая цена за м² с доставкой, которую платит клиент:
  // цена блока со скидкой + доставка за 1 м²
  const price_m2_with_delivery = blockNetPriceM2 + deliveryWithSurcharge;

  // Вывод параметров расчета в консоль браузера
  console.log('[price_m2_with_delivery]', {
    product: product?.name || product?.product_article || product?.id,
    priceAfterAgent: round2(priceAfterAgent),
    deliveryPricePerM2: Number(deliveryPricePerM2) ? round2(deliveryPricePerM2) : 0,
    'order.delivery_m2': orderDeliveryM2,
    quantity_real,
    agent_commission: agentCommission,
    priceWithDeliveryBase: round2(priceWithDeliveryBase),
    price_m2_with_delivery: round2(price_m2_with_delivery),
    surcharge: confirmingSurcharge,
  });

  return {
    price_m2_with_markups: round2(price_m2_with_markups),
    price_m2_with_delivery: round2(price_m2_with_delivery),
    final_price: round2(final_price),
  };
};
