'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ClientProductPrices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      product_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Products',
          key: 'id',
        },
      },
      client_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Clients',
          key: 'id',
        },
      },
      delivery_address_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'DeliveryAddresses',
          key: 'id',
        },
      },
      price: {
        allowNull: false,
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

    await queryInterface.addIndex('ClientProductPrices', [
      'product_id',
      'client_id',
    ]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('ClientProductPrices');
  },
};
