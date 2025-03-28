'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('QualityManagements', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      batch_id: {
        type: Sequelize.STRING,
      },
      product_article: {
        type: Sequelize.STRING,
      },
      total_quantity_plan: {
        type: Sequelize.INTEGER,
      },
      reserved_quantity: {
        type: Sequelize.INTEGER,
      },
      reserved_quantity_allocated: {
        type: Sequelize.INTEGER,
      },
      reserved_quantity_remaining: {
        type: Sequelize.INTEGER,
      },
      free_quantity_fact: {
        type: Sequelize.INTEGER,
      },
      production_plan_id: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('QualityManagements');
  },
};
