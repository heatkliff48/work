// value сохраняется в Orders.payment_method, поэтому должен быть уникальным.
// surcharge — надбавка за отсрочку по confirming, % к цене всех товаров
// заказа; применяется, только если в заказе отмечена галочка
// Orders.confirming_surcharge.
export const PAYMENT_METHOD_OPTIONS = [
  { value: 'prepayment', label: 'Prepago' },
  { value: 'bank_transfer', label: 'Transferencia bancaria 30 dias' },
  { value: 'promissory_note', label: 'Pagaré' },
  { value: 'confirming_30', label: 'Confirming 30 dias' },
  { value: 'confirming_45', label: 'Confirming 45 dias' },
  { value: 'confirming_60', label: 'Confirming 60 dias', surcharge: 1.5 },
  { value: 'confirming_90', label: 'Confirming 90 dias', surcharge: 2.0 },
  { value: 'confirming_120', label: 'Confirming 120 dias', surcharge: 2.5 },
  { value: 'confirming_150', label: 'Confirming 150 dias', surcharge: 3.0 },
  { value: 'confirming_180', label: 'Confirming 180 dias', surcharge: 3.5 },
  { value: 'confirming_210', label: 'Confirming 210 dias', surcharge: 4.0 },
  { value: 'confirming_240', label: 'Confirming 240 dias', surcharge: 4.5 },
  { value: 'confirming_without_recourse', label: 'Confirming sin recurso' },
];

// старые заказы сохранены с 'confirming' без срока — в UI они показывались как 30 дней
const LEGACY_VALUES = { confirming: 'confirming_30' };

export const getPaymentMethodOption = (value) => {
  const normalized = LEGACY_VALUES[value] ?? value;
  return PAYMENT_METHOD_OPTIONS.find((option) => option.value === normalized);
};

export const getPaymentMethodLabel = (value) =>
  getPaymentMethodOption(value)?.label ?? value;

// Надбавка, которую даёт способ оплаты, %; 0 — галочку не показываем
export const getConfirmingSurchargeRate = (value) =>
  getPaymentMethodOption(value)?.surcharge ?? 0;

// Надбавка, действующая в заказе, %
export const getOrderConfirmingSurcharge = (order) =>
  order?.confirming_surcharge
    ? getConfirmingSurchargeRate(order?.payment_method)
    : 0;
