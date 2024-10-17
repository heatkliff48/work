'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BatchOutsides', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_warehouse_batch: {
        type: Sequelize.STRING
      },
      id_list_of_ordered_production: {
        type: Sequelize.INTEGER
      },
      quantity_pallets: {
        type: Sequelize.INTEGER
      },
      quantity_ordered: {
        type: Sequelize.INTEGER
      },
      quantity_free: {
        type: Sequelize.INTEGER
      },
      on_check: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BatchOutsides');
  }
};