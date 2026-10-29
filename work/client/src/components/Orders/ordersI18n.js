// Переводы для заказов. Статусы и заголовки колонок в OrderContext остаются
// английскими: по Header статуса работают Accounting и фильтры, поэтому
// переводим только при отображении.

// Название поля заказа/клиента/строки товара по ключу (accessor).
// Для полей без перевода — английский текст из контекста или сам ключ
export const fieldLabel = (t, key, fallback) =>
  t(`fields.${key}`, { ns: 'orders', defaultValue: fallback || key });

// Колонки из OrderContext с переведённым Header.
// keys — свой ключ перевода для accessor, например { total: 'totalUd' }
export const translateColumns = (t, columns, keys = {}) =>
  (columns || []).map((col) => ({
    ...col,
    Header: fieldLabel(t, keys[col.accessor] ?? col.accessor, col.Header),
  }));

export const statusLabel = (t, accessor, fallback) =>
  t(`statuses.${accessor}`, { ns: 'orders', defaultValue: fallback });
