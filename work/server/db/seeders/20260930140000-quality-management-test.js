'use strict';

// Test data for pallet write-off by type in Quality Management:
// - a 1200x800 product (EUROPEO pallets), copied from T.NAD35W36C (1200x1000);
// - two QM records, one per product, ready to be finished.
// Pallet stock for them comes from 20260930120000-raw-materials-test-deliveries.js

const SOURCE_ARTICLE = 'T.NAD35W36C'; // 1200x1000 — AMERICANO
// 'E' — Spain / Reusable / 1200x800 / Std, see articleCombinationMap in ProductContext.js
const TEST_ARTICLE = 'T.NED35W36C'; // 1200x800 — EUROPEO
const TEST_BATCH_PREFIX = 'TEST-';

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const [sourceProduct] = await queryInterface.select(null, 'Products', {
      where: { article: SOURCE_ARTICLE },
    });
    if (!sourceProduct) {
      throw new Error(`Source product ${SOURCE_ARTICLE} not found`);
    }

    const { id, ...productFields } = sourceProduct;
    const blocksOnPallet = 16; // 600x365 blocks: 2x2 per layer on 1200x800

    await queryInterface.bulkInsert('Products', [
      {
        ...productFields,
        article: TEST_ARTICLE,
        description: `TEST ${sourceProduct.description} (1200x800)`,
        version: 1,
        palletSize: 1,
        quantityBlockOnPallet: blocksOnPallet,
        volumeBlockOnPallet: +(blocksOnPallet * sourceProduct.volumeBlock).toFixed(3),
        createdAt: now,
        updatedAt: now,
      },
    ]);

    const qualityManagementRecord = {
      total_quantity_plan: 0,
      reserved_quantity: 0,
      reserved_quantity_allocated: 0,
      reserved_quantity_remaining: 0,
      sorting: 0,
      production_plan_id: null,
      raw_mat_cons_batch_id: null,
      id_ordered_product_to_warehouse: null,
      date: formatDate(now),
      createdAt: now,
      updatedAt: now,
    };

    await queryInterface.bulkInsert('QualityManagements', [
      {
        ...qualityManagementRecord,
        batch_id: `${TEST_BATCH_PREFIX}800`,
        product_article: TEST_ARTICLE,
        total_quantity_plan: 50,
        free_quantity_fact: 50,
      },
      {
        ...qualityManagementRecord,
        batch_id: `${TEST_BATCH_PREFIX}1000`,
        product_article: SOURCE_ARTICLE,
        total_quantity_plan: 22,
        free_quantity_fact: 20,
        sorting: 2,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    const { Op } = Sequelize;

    await queryInterface.bulkDelete(
      'QualityManagements',
      { batch_id: { [Op.like]: `${TEST_BATCH_PREFIX}%` } },
      {},
    );
    await queryInterface.bulkDelete('Products', { article: TEST_ARTICLE }, {});
  },
};
