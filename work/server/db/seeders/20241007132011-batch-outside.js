'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'BatchOutsides',
      [
        {
          id_warehouse_batch: 'w.0001',
          id_list_of_ordered_production: 10,
          quantity_pallets: 48,
          quantity_ordered: 23,
          quantity_free: 25,
          on_check: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id_warehouse_batch: 'w.0002',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('BatchOutsides', null, {});
  },
};
