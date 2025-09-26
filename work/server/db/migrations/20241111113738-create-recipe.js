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
      density: {
        type: Sequelize.FLOAT,
      },
      certificate: {
        type: Sequelize.STRING,
      },
      form_volume_m3: {
        type: Sequelize.FLOAT,
      },
      dry_total: {
        type: Sequelize.FLOAT,
      },
      sand: {
        type: Sequelize.FLOAT,
      },
      sand_slurry: {
        type: Sequelize.FLOAT,
      },
      lime: {
        type: Sequelize.FLOAT,
      },
      cement: {
        type: Sequelize.FLOAT,
      },
      gypsum: {
        type: Sequelize.FLOAT,
      },
      gypsum_stone: {
        type: Sequelize.FLOAT,
      },
      alu: {
        type: Sequelize.FLOAT,
      },
      return_slurry_solids: {
        type: Sequelize.FLOAT,
      },
      water_solid: {
        type: Sequelize.FLOAT,
      },
      water_mixer: {
        type: Sequelize.FLOAT,
      },
      condensate: {
        type: Sequelize.FLOAT,
      },
      grinding_balls: {
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
    await queryInterface.dropTable('Recipes');
  },
};
