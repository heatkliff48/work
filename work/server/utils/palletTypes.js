// Pallet types in WarehousePallets.type (names given by the factory).
// Keep in sync with client/src/utils/palletTypes.js
const PALLET_TYPES = {
  EUROPEO: 'EUROPEO', // 1200x800
  AMERICANO: 'AMERICANO', // 1200x1000
};

// Products.palletSize: 0 / '1200x1000' — AMERICANO, 1 / '1200x800' — EUROPEO
const getPalletTypeByPalletSize = (palletSize) =>
  String(palletSize) === '1' || String(palletSize) === '1200x800'
    ? PALLET_TYPES.EUROPEO
    : PALLET_TYPES.AMERICANO;

module.exports = { PALLET_TYPES, getPalletTypeByPalletSize };
