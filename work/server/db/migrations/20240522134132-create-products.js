'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      article: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      version: {
        type: Sequelize.INTEGER,
      },
      density: {
        type: Sequelize.FLOAT,
      },
      form: {
        type: Sequelize.STRING,
      },
      certificate: {
        type: Sequelize.STRING,
      },
      /** new block */
      placeOfProduction: {
        type: Sequelize.STRING,
      },
      typeOfPackaging: {
        type: Sequelize.STRING,
      },
      /** new block */
      width: {
        type: Sequelize.FLOAT,
      },
      lengths: {
        type: Sequelize.FLOAT,
      },
      height: {
        type: Sequelize.FLOAT,
      },
      tradingMark: {
        type: Sequelize.STRING,
      },
      m3: {
        type: Sequelize.FLOAT,
      },
      m2: {
        type: Sequelize.FLOAT,
      },
      m: {
        type: Sequelize.FLOAT,
      },
      widthInArray: {
        type: Sequelize.FLOAT,
      },
      m3InArray: {
        type: Sequelize.FLOAT,
      },
      densityDryMax: {
        type: Sequelize.FLOAT,
      },
      densityDryDef: {
        type: Sequelize.FLOAT,
      },
      humidity: {
        type: Sequelize.FLOAT,
      },
      densityHuminityMax: {
        type: Sequelize.FLOAT,
      },
      densityHuminityDef: {
        type: Sequelize.FLOAT,
      },
      weightMax: {
        type: Sequelize.FLOAT,
      },
      weightDef: {
        type: Sequelize.FLOAT,
      },
      normOfBrack: {
        type: Sequelize.FLOAT,
      },
      coefficientOfFree: {
        type: Sequelize.FLOAT,
      },
      price: {
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
    await queryInterface.dropTable('Products');
  },
};
