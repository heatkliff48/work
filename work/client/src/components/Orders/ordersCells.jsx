import React from 'react';

/* ──────────────────────────────────────────────────────────────────
   Презентационные хелперы для таблицы заказов (OrdersTable).
   Только ВИД ячеек. accessor/данные не меняются — Cell получает то
   же самое value, что и раньше, просто рисует его иначе.
   ────────────────────────────────────────────────────────────────── */

const ORDER_STATUS_THEME = [
  { max: 3, bg: '#f3f4f6', color: '#565d6d', dot: '#9aa0ac' },
  { max: 5, bg: '#fdf3e3', color: '#b45309', dot: '#d97706' },
  { max: 8, bg: '#e8eefc', color: '#1d4ed8', dot: '#2563eb' },
  { max: 9, bg: '#efe9fb', color: '#6d28d9', dot: '#7c3aed' },
  { max: 10, bg: '#e9f6ed', color: '#15803d', dot: '#16a34a' },
];

export function statusThemeFor(accessor) {
  const n = Number(accessor);
  return (
    ORDER_STATUS_THEME.find((r) => n <= r.max) ||
    ORDER_STATUS_THEME[ORDER_STATUS_THEME.length - 1]
  );
}

/* value стоит как раньше — просто текстовая метка статуса (Header из
   status_list). Цвет пилюли ищем через status_list, который уже есть
   в контексте, никаких новых запросов. */
export function makeStatusPillCell(status_list) {
  return function StatusPillCell({ value }) {
    if (!value) return <span className="ord-muted">—</span>;
    const statusDef = (status_list || []).find((s) => s.Header === value);
    const theme = statusThemeFor(statusDef?.accessor);
    return (
      <span className="ord-pill" style={{ background: theme.bg, color: theme.color }}>
        <span className="ord-pill__dot" style={{ background: theme.dot }} />
        {value}
      </span>
    );
  };
}

export function ArticleMonoCell({ value }) {
  return <span className="ord-mono ord-article-cell">{value}</span>;
}
