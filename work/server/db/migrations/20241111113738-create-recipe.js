'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Recipes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      article: {
        type: Sequelize.STRING,
      },
      sand: {
        type: Sequelize.FLOAT,
      },
      lime_lhoist: {
        type: Sequelize.FLOAT,
      },
      lime_barcelona: {
        type: Sequelize.FLOAT,
      },
      cement: {
        type: Sequelize.FLOAT,
      },
      gypsum: {
        type: Sequelize.FLOAT,
      },
      alu_1: {
        type: Sequelize.FLOAT,
      },
      alu_2: {
        type: Sequelize.FLOAT,
      },
      return_slurry_solids: {
        type: Sequelize.FLOAT,
      },
      return_slurry_water: {
        type: Sequelize.FLOAT,
      },
      water: {
        type: Sequelize.FLOAT,
      },
      water_cold: {
        type: Sequelize.FLOAT,
      },
      water_hot: {
        type: Sequelize.FLOAT,
      },
      condensate: {
        type: Sequelize.FLOAT,
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
    await queryInterface.dropTable('Recipes');
  },
};
