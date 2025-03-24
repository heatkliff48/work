'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderDryMixedProducts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.INTEGER
      },
      dry_mixed_id: {
        type: Sequelize.INTEGER
      },
      quantity_dry: {
        type: Sequelize.FLOAT
      },
      quantity_palet_dry: {
        type: Sequelize.FLOAT
      },
      quantity_real_dry: {
        type: Sequelize.FLOAT
      },
      total_dry: {
        type: Sequelize.FLOAT
      },
      discount: {
        type: Sequelize.INTEGER
      },
      pvp_dry: {
        type: Sequelize.FLOAT
      },
      final_price_dry: {
        type: Sequelize.FLOAT
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
    await queryInterface.dropTable('OrderDryMixedProducts');
  }
};
