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
          page_name: 'Clients',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'Orders',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'Orders_status', /* Head of sales department */
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'Users_info', /* Admin */
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'Production_batch_log', // Production director
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'Warehouse', // Head of sales department(write) 
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'Roles', // Admin 
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'Del_orders', // Head of sales department (Optional)
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'Warehouse_reservation', 
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {},
};
