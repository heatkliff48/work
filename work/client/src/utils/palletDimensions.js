// Pallet footprint and maximum load height, in mm, for a product card.
export const calculatePalletDimensions = (palletSize, palletHeight) => {
  // Определение ширины и длины паллета
  let palletLengthValue;
  let palletWidthValue;

  if (typeof palletSize === 'string' && palletSize.includes('x')) {
    const [lengthStr, widthStr] = palletSize.split('x');
    palletLengthValue = parseInt(lengthStr) || 1200;
    palletWidthValue = parseInt(widthStr) || 800;
  } else {
    palletWidthValue = parseInt(palletSize) === 0 ? 1000 : 800;
    palletLengthValue = 1200;
  }

  // Определение высоты паллета — только для прежних карточек, новые хранят ряды блоков (palletRows)
  // При редактировании приходит label ('Std' / 'Marine' / 'High' / 'Std+1'), при создании — value (0 / 1 / 2 / 3)
  const palletHeightMap = {
    0: 1150,
    1: 950,
    2: 1500,
    3: 1150,
    std: 1150,
    marine: 950,
    high: 1500,
    'std+1': 1150,
  };

  // Std+1 — как Std, но с дополнительным рядом блоков сверху
  const extraRowsMap = {
    3: 1,
    'std+1': 1,
  };

  const palletHeightKey =
    typeof palletHeight === 'string' ? palletHeight.toLowerCase() : palletHeight;
  const palletHeightValue = palletHeightMap[palletHeightKey] ?? 1140;
  const extraRowsValue = extraRowsMap[palletHeightKey] ?? 0;

  return {
    palletWidth: palletWidthValue,
    palletLength: palletLengthValue,
    palletHeight: palletHeightValue,
    extraRows: extraRowsValue,
  };
};

// Rows of blocks stacked on a pallet: blocks lie on their width, as many rows
// as fit under the pallet's maximum height, plus the extra row of Std+1.
export const blocksInHeight = (palletHeight, extraRows, blockWidth) =>
  Math.floor(palletHeight / blockWidth) + extraRows;

// Rows of blocks on a product's pallet. Cards store them in palletHeightBlocks;
// older cards have only the pallet height option (palletHeight: code or label),
// and their rows are counted from its height. undefined if neither is known.
export const palletRows = (product) => {
  const storedRows = Number(product?.palletHeightBlocks);
  if (storedRows > 0) return storedRows;

  const width = Number(product?.width);
  if (!width || product?.palletHeight == null || product.palletHeight === '') {
    return undefined;
  }

  const { palletHeight, extraRows } = calculatePalletDimensions(
    product.palletSize,
    product.palletHeight,
  );
  return blocksInHeight(palletHeight, extraRows, width);
};
