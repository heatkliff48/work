'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AutoclaveCalendares', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      date: {
        type: Sequelize.STRING,
      },
      scheduled_autoclaves: {
        type: Sequelize.INTEGER,
      },
      total_arrays: {
        type: Sequelize.INTEGER,
      },
      residual_arrays: {
        type: Sequelize.INTEGER,
      },
      filled_autoclaves: {
        type: Sequelize.INTEGER,
      },
      produced_autoclave: {
        type: Sequelize.INTEGER,
      },
      total_arrays_cacke_fill_up: {
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
    await queryInterface.dropTable('AutoclaveCalendares');
  },
};
