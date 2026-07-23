import React from 'react';

/* ──────────────────────────────────────────────────────────────────
   Презентационные хелперы для таблицы клиентов.
   Только ВИД ячеек. Данные/accessor не меняются.
   ────────────────────────────────────────────────────────────────── */

const AVATARS = [
  { bg: '#fbe9e9', fg: '#bc1212' },
  { bg: '#e8eefc', fg: '#2563eb' },
  { bg: '#efe9fb', fg: '#7c3aed' },
  { bg: '#e6f3f6', fg: '#0891b2' },
  { bg: '#fdf3e3', fg: '#b45309' },
  { bg: '#e9f6ed', fg: '#16a34a' },
];

const DOT_COLORS = [
  '#2563eb', '#7c3aed', '#0891b2', '#be123c',
  '#ca8a04', '#d97706', '#16a34a', '#64748b', '#0d9488',
];

export function getInitials(name = '') {
  const parts = String(name)
    .replace(/[^A-Za-zÀ-ÿ\s]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return '—';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function pickAvatar(id) {
  const n = Number(id) || 0;
  return AVATARS[n % AVATARS.length];
}

function dotForCategory(category = '') {
  let h = 0;
  const s = String(category);
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return DOT_COLORS[h % DOT_COLORS.length];
}

/* Ячейка имени: квадратный аватар с инициалами + имя. */
export function ClientNameCell({ value, row }) {
  const name = value || '';
  const av = pickAvatar(row?.original?.id);
  return (
    <div className="cl-cell-name">
      <div
        className="cl-avatar cl-avatar--sm"
        style={{ background: av.bg, color: av.fg }}
      >
        {getInitials(name)}
      </div>
      <div className="cl-min0">
        <div className="cl-cell-name__title">{name}</div>
      </div>
    </div>
  );
}

/* Ячейка CIF/VAT: моноширинный. */
export function MonoCell({ value }) {
  return <span className="cl-mono cl-cell-mono">{value}</span>;
}

/* Ячейка категории: пилюля с цветной точкой. */
export function CategoryPillCell({ value }) {
  if (!value) return <span className="cl-muted">—</span>;
  return (
    <span className="cl-pill">
      <span className="cl-dot" style={{ background: dotForCategory(value) }} />
      {value}
    </span>
  );
}
