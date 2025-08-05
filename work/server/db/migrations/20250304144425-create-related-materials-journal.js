'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RelatedMaterialsJournals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      article: {
        type: Sequelize.STRING,
      },
      manufacturer_name: {
        type: Sequelize.STRING,
      },
      units_of_measurement: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      place_of_production: {
        type: Sequelize.STRING,
      },
      price_per_unit: {
        type: Sequelize.FLOAT,
      },
      product_code: {
        type: Sequelize.STRING,
      },
      product_code_box: {
        type: Sequelize.STRING,
      },
      product_code_pall: {
        type: Sequelize.STRING,
      },
      active_status: {
        type: Sequelize.BOOLEAN,
      },
      version: {
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
    await queryInterface.dropTable('RelatedMaterialsJournals');
  },
};
