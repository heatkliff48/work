'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Warehouses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      article: {
        type: Sequelize.STRING,
      },
      product_article: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      free_quantity_remaining: {
        type: Sequelize.INTEGER,
      },
      total_quantity: {
        type: Sequelize.INTEGER,
      },
      ordered_quantity: {
        type: Sequelize.INTEGER,
      },
      warehouse_loc: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.STRING,
      },
      sorting: {
        type: Sequelize.INTEGER,
      },
      batch_id: {
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
    await queryInterface.dropTable('Warehouses');
  },
};
