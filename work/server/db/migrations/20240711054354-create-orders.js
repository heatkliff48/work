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
      },
      secondary_contact: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.INTEGER,
      },
      shipping_date: {
        type: Sequelize.STRING,
      },
      person_in_charge: {
        type: Sequelize.INTEGER,
      },
      description: {
        type: Sequelize.STRING,
      },
      delivery: {
        type: Sequelize.FLOAT,
      },
      delivery_m2: {
        type: Sequelize.FLOAT,
      },
      deal_id: {
        type: Sequelize.INTEGER,
      },
      uf_number_offer: {
        type: Sequelize.INTEGER,
      },
      region: {
        type: Sequelize.STRING,
      },
      payment_method: {
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
