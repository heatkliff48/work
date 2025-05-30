'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RelatedMaterialsWarehouses', {
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
    await queryInterface.dropTable('RelatedMaterialsWarehouses');
  },
};
