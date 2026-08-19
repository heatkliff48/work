// Shared helpers for mapping "scheduled autoclaves" (autoclave_calendar) to the
// actual product placements saved in batchOutside, for a given production date.
// Used by BatchOutside.jsx (Batch calendar grid) and ProductionBatchDesignerNew.jsx
// (date-scoped fill/edit) so both stay in sync about what counts as "filled".

export function computeQuantityArrays(row, latestProducts) {
  const product = (latestProducts || []).find((p) => p.article === row.product_article);
  if (!product) return 0;

  const m3InArray = Number(product.m3InArray) || 0;
  const volumeBlockOnPallet = Number(product.volumeBlockOnPallet) || 0;
  const palletsPerArray = Math.max(1, Math.floor(m3InArray / volumeBlockOnPallet) || 1);

  return Math.ceil(Number(row.quantity_pallets || 0) / palletsPerArray);
}

export function getBatchOutsideRowsForDate(batchOutside, date) {
  return (Array.isArray(batchOutside) ? batchOutside : [])
    .filter((row) => String(row?.date).slice(0, 10) === date)
    .slice()
    .sort(
      (a, b) => (Number(a.position_in_autoclave) || 0) - (Number(b.position_in_autoclave) || 0),
    );
}

export function getScheduledAutoclavesForDate(autoclaveCalendar, date) {
  const record = (Array.isArray(autoclaveCalendar) ? autoclaveCalendar : []).find(
    (el) => String(el.date).slice(0, 10) === date,
  );
  return Number(record?.scheduled_autoclaves) || 0;
}

export function getFilledAutoclaveCountForDate(
  batchOutside,
  latestProducts,
  date,
  cellsPerAutoclave,
) {
  const rows = getBatchOutsideRowsForDate(batchOutside, date);
  const totalSlots = rows.reduce(
    (sum, row) => sum + computeQuantityArrays(row, latestProducts),
    0,
  );
  return Math.ceil(totalSlots / cellsPerAutoclave) || 0;
}

export function getEmptyAutoclaveCountForDate(
  batchOutside,
  latestProducts,
  autoclaveCalendar,
  date,
  cellsPerAutoclave,
) {
  const scheduled = getScheduledAutoclavesForDate(autoclaveCalendar, date);
  const filled = getFilledAutoclaveCountForDate(
    batchOutside,
    latestProducts,
    date,
    cellsPerAutoclave,
  );
  return Math.max(0, scheduled - filled);
}
