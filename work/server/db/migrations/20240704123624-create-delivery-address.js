'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DeliveryAddresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      client_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Clients',
          key: 'id',
        },
      },
      street: {
        type: Sequelize.TEXT
      },
      additional_info: {
        type: Sequelize.TEXT
      },
      city: {
        type: Sequelize.TEXT
      },
      zip_code: {
        type: Sequelize.INTEGER
      },
      province: {
        type: Sequelize.TEXT
      },
      country: {
        type: Sequelize.TEXT
      },
      phone_number: {
        type: Sequelize.TEXT
      },
      email: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('DeliveryAddresses');
  }
};
