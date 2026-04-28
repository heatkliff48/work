'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Pages',
      [
        {
          page_name: 'Users_info' /* Admin */,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'Roles', // Admin
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'warehouse_manager',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'Products',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'Statistics',
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
          page_name: 'orders_change_person_in_charge',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'orders_description_edit',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'orders_save_delivery_price',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'orders_files',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'accounting',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'Clients',
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          page_name: 'Warehouse', // Head of sales department(write)
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'Warehouse_modal_upload_file',
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
          page_name: 'related_materials_backorder_list',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'production_plan',
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
          page_name: 'quality_management',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'raw_materials_warehouse_add',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'raw_materials_warehouse_add_sand_slurry',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'raw_materials_warehouse_files_actions',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          page_name: 'TaskBoard',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {},
};
