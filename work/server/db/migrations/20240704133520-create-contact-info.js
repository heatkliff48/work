'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ContactInfos', {
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
      first_name: {
        type: Sequelize.TEXT
      },
      last_name: {
        type: Sequelize.TEXT
      },
      address: {
        type: Sequelize.TEXT
      },
      formal_position: {
        type: Sequelize.TEXT
      },
      role_in_the_org: {
        type: Sequelize.TEXT
      },
      phone_number_office: {
        type: Sequelize.TEXT
      },
      phone_number_mobile: {
        type: Sequelize.TEXT
      },
      phone_number_messenger: {
        type: Sequelize.TEXT
      },
      email: {
        type: Sequelize.TEXT
      },
      linkedin: {
        type: Sequelize.TEXT
      },
      social: {
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
    await queryInterface.dropTable('ContactInfos');
  }
};
