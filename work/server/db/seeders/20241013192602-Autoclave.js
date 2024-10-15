'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const autoclaveData = Array(210).fill({
      id_list_of_ordered_product: null,
      status_batch: 0,
      quality_check: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await queryInterface.bulkInsert('Autoclaves', autoclaveData, {});
  },

  async down(queryInterface, Sequelize) {},
};
