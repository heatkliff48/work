'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ClientsInfos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      c_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Clients',
          key: 'id',
        },
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      formal_position: {
        type: Sequelize.STRING
      },
      role_in_the_org: {
        type: Sequelize.STRING
      },
      phone_number_office: {
        type: Sequelize.STRING
      },
      phone_number_mobile: {
        type: Sequelize.STRING
      },
      phone_number_messenger: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      linkedin: {
        type: Sequelize.STRING
      },
      social: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('ClientsInfos');
  }
};
