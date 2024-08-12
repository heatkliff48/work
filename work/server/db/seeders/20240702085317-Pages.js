'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Pages',
      [
        {
          page_name: 'Products',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'Contacts',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'Orders',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'Orders_status',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {},
};
