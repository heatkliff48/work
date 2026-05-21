'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WarehouseSandSlurries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      sand: {
        type: Sequelize.FLOAT,
      },
      gypsum_stone: {
        type: Sequelize.FLOAT,
      },
      water: {
        type: Sequelize.FLOAT,
      },
      grinding_balls: {
        type: Sequelize.FLOAT,
      },
      aac_scrap: {
        type: Sequelize.FLOAT,
      },
      portion_size: {
        type: Sequelize.FLOAT,
      },
      date: {
        type: Sequelize.STRING,
      },
      file_name: {
        type: Sequelize.STRING,
      },
      isNeedCheck: {
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
    await queryInterface.dropTable('WarehouseSandSlurries');
  },
};
