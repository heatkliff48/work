'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      version: {
        type: Sequelize.INTEGER
      },
      density: {
        type: Sequelize.INTEGER
      },
      form: {
        type: Sequelize.STRING
      },
      certificate: {
        type: Sequelize.STRING
      },
      width: {
        type: Sequelize.INTEGER
      },
      lengths: {
        type: Sequelize.INTEGER
      },
      height: {
        type: Sequelize.INTEGER
      },
      tradingMark: {
        type: Sequelize.STRING
      },
      m3: {
        type: Sequelize.INTEGER
      },
      m2: {
        type: Sequelize.INTEGER
      },
      m: {
        type: Sequelize.INTEGER
      },
      widthInArray: {
        type: Sequelize.INTEGER
      },
      m3InArray: {
        type: Sequelize.INTEGER
      },
      densityInDryMax: {
        type: Sequelize.INTEGER
      },
      dinsityInDryDef: {
        type: Sequelize.INTEGER
      },
      humidity: {
        type: Sequelize.INTEGER
      },
      densityHumidityMax: {
        type: Sequelize.INTEGER
      },
      densityHuminityDef: {
        type: Sequelize.INTEGER
      },
      weightMax: {
        type: Sequelize.INTEGER
      },
      weightDef: {
        type: Sequelize.INTEGER
      },
      normOfBrack: {
        type: Sequelize.INTEGER
      },
      coefficientOfFree: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};
