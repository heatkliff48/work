import { palletRows } from '#utils/palletDimensions.js';

export const round2 = (n) => parseFloat(Number(n).toFixed(2));

// Blocks are sold by area, except U- and O-blocks which are sold by linear
// meter — both live in the same quantity_m2 / m2 fields across the order tables.
export const isLinearBlock = (catalog) =>
  catalog?.form === 'U-block' || catalog?.form === 'O-block';

// Linear metres one block covers: a U-block is counted along its length
// (600 mm), an O-block along its height (250 mm).
export const linearMetresPerBlock = (catalog) =>
  (Number(catalog?.form === 'O-block' ? catalog?.height : catalog?.lengths) ||
    0) / 1000;

// The stored `m` of a product is counted along the block length, which is
// right for U-blocks only, so for O-blocks it's derived from the block height.
export const m2PerPallet = (catalog) => {
  if (catalog?.form === 'O-block') {
    const m = round2(
      (Number(catalog?.quantityBlockOnPallet) || 0) *
        linearMetresPerBlock(catalog),
    );
    return m || catalog?.m || 1;
  }
  return catalog?.form === 'U-block' ? catalog?.m || 1 : catalog?.m2 || 1;
};

// Linear metres for a number of U-/O-blocks, and back to whole pieces.
export const linearMetresForPieces = (pieces, catalog) =>
  round2((Number(pieces) || 0) * linearMetresPerBlock(catalog));

export const piecesForLinearMetres = (metres, catalog) => {
  const perBlock = linearMetresPerBlock(catalog);
  return perBlock ? Math.round((Number(metres) || 0) / perBlock) : 0;
};

// Blocks in one m² (one linear m for U-/O-blocks): turns a price per m² into a
// price per piece.
export const piecesPerQuantityUnit = (catalog) =>
  (Number(catalog?.quantityBlockOnPallet) || 0) / m2PerPallet(catalog);

// Whole pallets needed for a quantity in m² (linear m for U-/O-blocks). The ratio
// is trimmed to 6 decimals before rounding up: 3 × 13.2 m² is stored as 39.6,
// and 39.6 / 13.2 = 3.0000000000000004 would otherwise become 4 pallets.
export const palletsForQuantity = (quantity, catalog) =>
  Math.ceil(Number(((Number(quantity) || 0) / m2PerPallet(catalog)).toFixed(6)));

// Block article layout: `T.` + form letter + packaging letter + `H<rows>` +
// `D<density>` + `W<width>` + certificate letter, e.g. `T.NAH5D35W20C`;
// articles made before rows were stored have no `H<rows>`: `T.NAD35W20C`.
// The packaging letter (place of production / type of packaging / pallet size)
// and the rows of blocks make the package, so two articles differing only
// there are the same block in a different package.
const BLOCK_PACKAGING = /^(T\..)(.)(H\d+)?/;
const withoutPackaging = (article) => article.replace(BLOCK_PACKAGING, '$1');

// Order line type by article: 'N' — any block (`T.N…`, `T.O…` O-TEC,
// `T.U…` U-TEC, …), otherwise the letter after `X.`: 'M' dry mix,
// 'P' related material, 'F' anchor, 'T' tool. The form letter of a block
// can't be used for this — it may coincide with another type's letter.
export const orderProductType = (article = '') =>
  article.startsWith('T.') ? 'N' : article.slice(2, 3);

export const isSameBlockOtherPackaging = (a = '', b = '') =>
  withoutPackaging(a) === withoutPackaging(b);

// Catalog entry a block order line points at, and every package the same block
// is available in (the line's own package included, so the list doubles as the
// options of a "ship as" selector).
// The line keeps the product version it was ordered with, so the origin is
// looked up by id among all versions, and it stands in for its own package in
// the variants; other packages are offered in their latest version.
export const findBlockPackaging = (orderRow, catalogProducts, productVersions) => {
  const catalog = catalogProducts || [];
  const origin =
    (productVersions || catalog).find((c) => c.id === orderRow?.product_id) ||
    catalog.find((c) => c.article === orderRow?.product_article);
  const variants = origin
    ? catalog
        .filter((c) => isSameBlockOtherPackaging(c.article, origin.article))
        .map((c) => (c.article === origin.article ? origin : c))
    : [];

  return { origin, variants };
};

// Short human label for a package, e.g. "Disposable · 1200x800 · 5 blocks · Spain".
export const packagingLabel = (catalog) => {
  const rows = palletRows(catalog);
  return [
    catalog?.typeOfPackaging,
    catalog?.palletSize,
    rows && `${rows} ${rows === 1 ? 'block' : 'blocks'}`,
    catalog?.placeOfProduction,
  ]
    .filter(Boolean)
    .join(' · ');
};

// Height of the block stack on one pallet, in cm, with the rows counted the
// way the product card counts them for blocks per pallet.
export const palletHeightCm = (catalog) => {
  const width = Number(catalog?.width);
  const rows = palletRows(catalog);
  if (!width || !rows) return null;
  return round2((rows * width) / 10);
};

// Pallet a block is packed on: size, stack height and volume, e.g.
// "1200x800 · 90 cm · 1.44 m3".
export const palletPackagingLabel = (catalog) => {
  const height = palletHeightCm(catalog);
  const m3 = Number(catalog?.volumeBlockOnPallet);
  return [
    catalog?.palletSize,
    height && `${height} cm`,
    m3 && `${parseFloat(m3.toFixed(3))} m3`,
  ]
    .filter(Boolean)
    .join(' · ');
};

// One option of a "ship as" selector, e.g.
// "T.NDH3D30W30C — Disposable · 1200x800 · 3 blocks · Spain (1.44 m²/pal · 90 cm)".
export const packageOptionLabel = (catalog) => {
  const label = packagingLabel(catalog);
  const height = palletHeightCm(catalog);
  const specs = [`${m2PerPallet(catalog)} m²/pal`, height && `${height} cm`]
    .filter(Boolean)
    .join(' · ');
  return `${catalog.article}${label ? ` — ${label}` : ''} (${specs})`;
};
