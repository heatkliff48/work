'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderAnchorProducts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.INTEGER
      },
      anchor_id: {
        type: Sequelize.INTEGER
      },
      quantity_anchor: {
        type: Sequelize.FLOAT
      },
      quantity_palet_anchor: {
        type: Sequelize.FLOAT
      },
      quantity_real_anchor: {
        type: Sequelize.FLOAT
      },
      total_anchor: {
        type: Sequelize.FLOAT
      },
      discount: {
        type: Sequelize.INTEGER
      },
      pvp_anchor: {
        type: Sequelize.FLOAT
      },
      final_price_anchor: {
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
    await queryInterface.dropTable('OrderAnchorProducts');
  }
};
