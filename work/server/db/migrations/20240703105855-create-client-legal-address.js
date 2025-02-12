'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ClientLegalAddresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      street: {
        type: Sequelize.TEXT,
      },
      additional_info: {
        type: Sequelize.TEXT,
      },
      city: {
        type: Sequelize.TEXT,
      },
      zip_code: {
        type: Sequelize.INTEGER,
      },
      province: {
        type: Sequelize.TEXT,
      },
      country: {
        type: Sequelize.TEXT,
      },
      phone_office: {
        type: Sequelize.TEXT,
      },
      fax: {
        type: Sequelize.TEXT,
      },
      phone_mobile: {
        type: Sequelize.TEXT,
      },
      web_link: {
        type: Sequelize.TEXT,
      },
      email: {
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
    await queryInterface.dropTable('ClientLegalAddresses');
  },
};
