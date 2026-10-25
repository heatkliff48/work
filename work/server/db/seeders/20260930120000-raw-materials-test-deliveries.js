'use strict';

// Test deliveries for the raw materials warehouse, so the tables are not
// empty after `npm run db`. Must run after 20250926143441-raw-materials-init.js
// (it creates the RawMaterialsWarehouses rows that are recalculated here).

const TEST_SUPPLIER_PREFIX = 'TEST ';

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split('.');
  return new Date(`${year}-${month}-${day}`);
};

const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return formatDate(date);
};

const MATERIALS = [
  {
    table: 'WarehouseSands',
    material_type: 'Sand (dry)',
    rows: [
      { supplier: 'Arenas del Sur', quantity: 25000, type: 'SILICA 0-2 WS', date: daysAgo(30) },
      { supplier: 'Arenas del Sur', quantity: 24000, type: 'SILICA 0-2 WS', date: daysAgo(15) },
      { supplier: 'Silices Levante', quantity: 26000, type: 'SILICA 0-2 WS', date: daysAgo(3) },
    ],
  },
  {
    table: 'WarehouseLimes',
    material_type: 'Lime',
    rows: [
      { supplier: 'Calcinor', quantity: 12000, type: 'CL 90Q', date: daysAgo(25) },
      { supplier: 'Calcinor', quantity: 11500, type: 'CL 90Q', date: daysAgo(5) },
    ],
  },
  {
    table: 'WarehouseCements',
    material_type: 'Cement',
    rows: [
      { supplier: 'Cementos Portland', quantity: 28000, type: 'CEM I 52.5 R-SR3', date: daysAgo(20) },
      { supplier: 'Cementos Portland', quantity: 27500, type: 'CEM I 52.5 R-SR3', date: daysAgo(4) },
    ],
  },
  {
    table: 'WarehouseGypsums',
    material_type: 'Gypsum (dry)',
    rows: [
      { supplier: 'Yesos Iberica', quantity: 8000, date: daysAgo(18) },
      { supplier: 'Yesos Iberica', quantity: 7500, date: daysAgo(6) },
    ],
  },
  {
    table: 'WarehouseGypsumStones',
    material_type: 'Gypsum stone',
    rows: [
      { supplier: 'Canteras Norte', quantity: 15000, date: daysAgo(22) },
      { supplier: 'Canteras Norte', quantity: 14000, date: daysAgo(8) },
    ],
  },
  {
    table: 'WarehouseAluminum1s',
    material_type: 'Aluminum',
    rows: [
      { supplier: 'Eckart', quantity: 500, consumed_quantity: 0, type: '7040-10/70WB28', date: daysAgo(28) },
      { supplier: 'Eckart', quantity: 450, consumed_quantity: 0, type: '7100-30/70WB28', date: daysAgo(10) },
      { supplier: 'Schlenk', quantity: 400, consumed_quantity: 0, type: '7040-10/70WB28', date: daysAgo(2) },
    ],
  },
  {
    table: 'WarehouseGrindingBalls',
    material_type: 'Grinding Balls',
    rows: [
      { supplier: 'Magotteaux', quantity: 2000, diameter: 30, date: daysAgo(40) },
      { supplier: 'Magotteaux', quantity: 1500, diameter: 40, date: daysAgo(12) },
    ],
  },
  {
    table: 'WarehouseAACs',
    material_type: 'AAC',
    rows: [
      { supplier: 'Produccion propia', quantity: 3000, date: daysAgo(14) },
      { supplier: 'Produccion propia', quantity: 2500, date: daysAgo(1) },
    ],
  },
  {
    table: 'WarehousePallets',
    material_type: 'Pallets',
    rows: [
      { supplier: 'Palets Martinez', quantity: 300, type: 'AMERICANO', date: daysAgo(21) },
      { supplier: 'Palets Martinez', quantity: 40, type: 'EUROPEO', date: daysAgo(9) },
      { supplier: 'Embalajes Garcia', quantity: 60, type: 'EUROPEO', date: daysAgo(2) },
    ],
  },
  {
    table: 'WarehousePlastics',
    material_type: 'Plastics',
    rows: [
      { supplier: 'Plasticos Valencia', quantity: 600, date: daysAgo(16) },
      { supplier: 'Plasticos Valencia', quantity: 550, date: daysAgo(3) },
    ],
  },
  {
    table: 'WarehouseSandPowders',
    material_type: 'Sand powder (dry)',
    rows: [
      { supplier: 'Silices Levante', quantity: 9000, date: daysAgo(19) },
      { supplier: 'Silices Levante', quantity: 8500, date: daysAgo(7) },
    ],
  },
  {
    table: 'WarehouseReleaseOils',
    material_type: 'Release oil',
    rows: [
      { supplier: 'Desencofrantes Iberia', quantity: 1000, date: daysAgo(24) },
      { supplier: 'Desencofrantes Iberia', quantity: 1000, date: daysAgo(6) },
    ],
  },
];

// Same logic as POST /raw-materials-warehouse/<material> in the router:
// remaining = sum(quantity) - consumed_quantity, last_updated = latest date.
const recalculateWarehouse = async (queryInterface, { table, material_type }) => {
  const [record] = await queryInterface.select(null, 'RawMaterialsWarehouses', {
    where: { material_type },
  });
  if (!record) return;

  const rows = await queryInterface.select(null, table, {});
  const totalQuantity = rows.reduce(
    (sum, row) => sum + (Number(row.quantity) || 0),
    0,
  );
  const latestRecord = rows
    .filter((row) => row.date != null)
    .sort((a, b) => parseDate(b.date) - parseDate(a.date))[0];

  await queryInterface.bulkUpdate(
    'RawMaterialsWarehouses',
    {
      remaining_quantity: totalQuantity - (Number(record.consumed_quantity) || 0),
      last_updated: latestRecord ? latestRecord.date : formatDate(new Date()),
      updatedAt: new Date(),
    },
    { material_type },
  );
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    for (const material of MATERIALS) {
      await queryInterface.bulkInsert(
        material.table,
        material.rows.map((row) => ({
          ...row,
          supplier: `${TEST_SUPPLIER_PREFIX}${row.supplier}`,
          createdAt: now,
          updatedAt: now,
        })),
        {},
      );
      await recalculateWarehouse(queryInterface, material);
    }
  },

  async down(queryInterface, Sequelize) {
    const { Op } = Sequelize;

    for (const material of MATERIALS) {
      await queryInterface.bulkDelete(
        material.table,
        { supplier: { [Op.like]: `${TEST_SUPPLIER_PREFIX}%` } },
        {},
      );
      await recalculateWarehouse(queryInterface, material);
    }
  },
};
