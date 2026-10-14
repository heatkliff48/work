// Pallet types in WarehousePallets.type (names given by the factory).
// Keep in sync with server/utils/palletTypes.js
export const PALLET_TYPES = {
  EUROPEO: 'EUROPEO', // 1200x800
  AMERICANO: 'AMERICANO', // 1200x1000
};

export const PALLET_TYPE_OPTIONS = [
  { value: PALLET_TYPES.EUROPEO, label: PALLET_TYPES.EUROPEO },
  { value: PALLET_TYPES.AMERICANO, label: PALLET_TYPES.AMERICANO },
];

// Products.palletSize: 0 / '1200x1000' — AMERICANO, 1 / '1200x800' — EUROPEO
export const getPalletTypeByPalletSize = (palletSize) =>
  String(palletSize) === '1' || String(palletSize) === '1200x800'
    ? PALLET_TYPES.EUROPEO
    : PALLET_TYPES.AMERICANO;

// Pallets still in stock per type: received minus consumed
export const getPalletsAvailableByType = (warehousePallets = []) =>
  warehousePallets.reduce((acc, item) => {
    const available =
      (Number(item.quantity) || 0) - (Number(item.consumed_quantity) || 0);
    if (item.type && available > 0) {
      acc[item.type] = (acc[item.type] || 0) + available;
    }
    return acc;
  }, {});
