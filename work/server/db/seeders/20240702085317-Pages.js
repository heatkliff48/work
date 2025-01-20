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
          page_name: 'Orders_status' /* Head of sales department */,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'Del_orders', // Head of sales department (Optional)
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'Users_info' /* Admin */,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'Warehouse', // Head of sales department(write)
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'Warehouse_reservation',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'Warehouse_modal_upload_file',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'Roles', // Admin
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'production_batch_designer',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'List_of_ordered_production',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'list_of_ordered_production_oem',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'batch_outside',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'batch_outside_add_to_warehouse',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'recipe_products',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'raw_materials_plan',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'recipe_orders',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'orders_change_person_in_charge',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {},
};
