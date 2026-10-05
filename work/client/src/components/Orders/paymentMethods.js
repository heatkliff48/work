// value сохраняется в Orders.payment_method, поэтому должен быть уникальным
export const PAYMENT_METHOD_OPTIONS = [
  { value: 'prepayment', label: 'Prepago' },
  { value: 'bank_transfer', label: 'Transferencia bancaria 30 dias' },
  { value: 'promissory_note', label: 'Pagaré' },
  { value: 'confirming_30', label: 'Confirming 30 dias' },
  { value: 'confirming_45', label: 'Confirming 45 dias' },
  { value: 'confirming_60', label: 'Confirming 60 dias' },
  { value: 'confirming_90', label: 'Confirming 90 dias' },
  { value: 'confirming_120', label: 'Confirming 120 dias' },
  { value: 'confirming_180', label: 'Confirming 180 dias' },
  { value: 'confirming_210', label: 'Confirming 210 dias' },
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
