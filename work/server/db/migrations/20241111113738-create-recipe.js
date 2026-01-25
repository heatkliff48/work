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

      certificate: {
        type: Sequelize.STRING,
      },
      cake_height: {
        type: Sequelize.FLOAT,
      },
      lime: {
        type: Sequelize.FLOAT,
      },
      cement: {
        type: Sequelize.FLOAT,
      },
      sand_dry: {
        type: Sequelize.FLOAT,
      },
      sand_slurry_dry: {
        type: Sequelize.FLOAT,
      },
      gypsum_dry: {
        type: Sequelize.FLOAT,
      },
      return_dry: {
        type: Sequelize.FLOAT,
      },
      aluminum_paste: {
        type: Sequelize.FLOAT,
      },
      aluminum_paste_2: {
        type: Sequelize.FLOAT,
      },
      water_solids: {
        type: Sequelize.FLOAT,
      },
      solids: {
        type: Sequelize.FLOAT,
      },
      volume: {
        type: Sequelize.FLOAT,
      },
      density: {
        type: Sequelize.FLOAT,
      },
      density_recipe: {
        type: Sequelize.FLOAT,
      },
      produced_return_dry: {
        type: Sequelize.FLOAT,
      },
      water_total: {
        type: Sequelize.FLOAT,
      },
      description: {
        type: Sequelize.TEXT,
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
