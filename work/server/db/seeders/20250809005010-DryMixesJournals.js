'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'DryMixesJournals',
      [
        {
          id: 1,
          name: 'BAUBLOCK® MORTERO COLA  ',
          article: 'X.M10001',
          lengths: 42,
          width: 39.8,
          height: 11,
          units_of_measurement: 'pallets',
          altura_x_palet: 7,
          unit_x_base: 7,
          units_per_pallet: 49,
          bag_weight: 25,
          pallet_weight: 1245,
          type_of_mix: 0,
          place_of_production: 'ES',
          price_per_unit: 100,
          price_per_kilogram: 0.082,
          product_code: 8436626340701,
          product_code_box: 28436626340705,
          product_code_pall: 18436626340708,
          qty_per_truck: 19,
          qty_per_contendor: 20,
          active_status: true,
          version: 1,
          createdAt: new Date('2025-07-30 23:37:49.706+03'),
          updatedAt: new Date('2025-07-30 23:37:49.706+03'),
        },
        {
          id: 2,
          name: 'BAUBLOCK® MORTERO REVOCO  ',
          article: 'X.M10002',
          lengths: 42,
          width: 39.8,
          height: 11,
          units_of_measurement: 'pallets',
          altura_x_palet: 7,
          unit_x_base: 7,
          units_per_pallet: 49,
          bag_weight: 25,
          pallet_weight: 1245,
          type_of_mix: 0,
          place_of_production: 'ES',
          price_per_unit: 100,
          price_per_kilogram: 0.082,
          product_code: 8436626340824,
          product_code_box: 28436626340828,
          product_code_pall: 18436626340821,
          qty_per_truck: 19,
          qty_per_contendor: 20,
          active_status: true,
          version: 1,
          createdAt: new Date('2025-07-30 23:37:49.706+04'),
          updatedAt: new Date('2025-07-30 23:37:49.706+04'),
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('DryMixesJournals', null, {});
  },
};
