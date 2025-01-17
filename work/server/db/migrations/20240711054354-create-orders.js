'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      article: {
        type: Sequelize.STRING,
      },
      owner: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Clients',
          key: 'id',
        },
      },
      del_adr_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'DeliveryAddresses',
        //   key: 'id',
        // },
      },
      contact_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'DeliveryAddresses',
        //   key: 'id',
        // },
      },
      status: {
        type: Sequelize.INTEGER,
      },
      shipping_date: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Orders');
  },
};
