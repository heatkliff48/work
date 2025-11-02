"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("RawMaterialsWarehouses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      material_type: {
        type: Sequelize.STRING,
      },
      remaining_quantity: {
        type: Sequelize.FLOAT,
      },
      consumed_quantity: {
        type: Sequelize.FLOAT,
      },
      last_updated: {
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
    await queryInterface.dropTable("RawMaterialsWarehouses");
  },
};
