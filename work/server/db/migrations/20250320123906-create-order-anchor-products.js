"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("OrderAnchorProducts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      order_id: {
        type: Sequelize.INTEGER,
      },
      anchor_id: {
        type: Sequelize.INTEGER,
      },
      quantity_ud: {
        type: Sequelize.FLOAT,
      },
      quantity_palet_anchor: {
        type: Sequelize.FLOAT,
      },
      quantity_real_ud: {
        type: Sequelize.FLOAT,
      },
      total: {
        type: Sequelize.FLOAT,
      },
      discount: {
        type: Sequelize.INTEGER,
      },
      pvp: {
        type: Sequelize.FLOAT,
      },
      final_price: {
        type: Sequelize.FLOAT,
      },
      warehouse_id: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("OrderAnchorProducts");
  },
};
