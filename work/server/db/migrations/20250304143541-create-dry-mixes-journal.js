'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DryMixesJournals', {
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
      units_of_measurement: {
        type: Sequelize.STRING,
      },
      number_of_bags: {
        type: Sequelize.INTEGER,
      },
      bag_weight: {
        type: Sequelize.FLOAT,
      },
      pallet_weight: {
        type: Sequelize.FLOAT,
      },
      type_of_mix: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      place_of_production: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.FLOAT,
      },
      price_per_kilogram: {
        type: Sequelize.FLOAT,
      },
      product_code: {
        type: Sequelize.STRING,
      },
      active_status: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable('DryMixesJournals');
  },
};
