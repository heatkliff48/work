'use strict';

// У сухих смесей колонка total («Total, kg») хранила число мешков.
// Пересчитываем в вес строки: паллеты × вес паллеты из справочника.
// PVP не трогаем — это цена за мешок, она уже посчитана верно

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      `UPDATE "OrderDryMixedProducts" AS o
          SET total = ROUND((COALESCE(o.quantity_palet_dry, 0) * d.pallet_weight)::numeric, 2)
         FROM "DryMixesJournals" AS d
        WHERE d.id = o.dry_mixed_id
          AND d.pallet_weight IS NOT NULL`,
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `UPDATE "OrderDryMixedProducts" SET total = quantity_real_ud`,
    );
  },
};
