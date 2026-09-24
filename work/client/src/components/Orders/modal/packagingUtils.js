export const round2 = (n) => parseFloat(Number(n).toFixed(2));

// Blocks are sold by area, except U-blocks which are sold by linear meter —
// both live in the same quantity_m2 / m2 fields across the order tables.
export const m2PerPallet = (catalog) =>
  catalog?.form === 'U-block' ? catalog?.m || 1 : catalog?.m2 || 1;

// Block article layout: `T.` + form letter + packaging letter + `D<density>` +
// `W<width>` + certificate letter, e.g. `T.NAD35W20C`. The letter at index 3
// encodes place of production / type of packaging / pallet size, so two
// articles differing only there are the same block in a different package.
const PACKAGING_LETTER_INDEX = 3;

export const isSameBlockOtherPackaging = (a = '', b = '') =>
  a.length === b.length &&
  a.slice(0, PACKAGING_LETTER_INDEX) === b.slice(0, PACKAGING_LETTER_INDEX) &&
  a.slice(PACKAGING_LETTER_INDEX + 1) === b.slice(PACKAGING_LETTER_INDEX + 1);

// Catalog entry a block order line points at, and every package the same block
// is available in (the line's own package included, so the list doubles as the
// options of a "ship as" selector).
export const findBlockPackaging = (orderRow, catalogProducts) => {
  const catalog = catalogProducts || [];
  const origin =
    catalog.find((c) => c.id === orderRow?.product_id) ||
    catalog.find((c) => c.article === orderRow?.product_article);
  const variants = origin
    ? catalog.filter((c) => isSameBlockOtherPackaging(c.article, origin.article))
    : [];

  return { origin, variants };
};

// Short human label for a package, e.g. "Disposable · 1200x800 · Spain".
export const packagingLabel = (catalog) =>
  [catalog?.typeOfPackaging, catalog?.palletSize, catalog?.placeOfProduction]
    .filter(Boolean)
    .join(' · ');
