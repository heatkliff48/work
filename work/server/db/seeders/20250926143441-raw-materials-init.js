"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "RawMaterialsWarehouses",
      [
        {
          material_type: "Sand",
          remaining_quantity: 0,
          last_updated: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          material_type: "Lime",
          remaining_quantity: 0,
          last_updated: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          material_type: "Cement",
          remaining_quantity: 0,
          last_updated: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          material_type: "Gypsum",
          remaining_quantity: 0,
          last_updated: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          material_type: "Gypsum stone",
          remaining_quantity: 0,
          last_updated: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          material_type: "Aluminum 1",
          remaining_quantity: 0,
          last_updated: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          material_type: "Aluminum 2",
          remaining_quantity: 0,
          last_updated: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          material_type: "Grinding Balls",
          remaining_quantity: 0,
          last_updated: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          material_type: "AAC",
          remaining_quantity: 0,
          last_updated: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          material_type: "Sand slurry (dry)",
          remaining_quantity: 0,
          last_updated: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("RawMaterialsWarehouses", null, {});
  },
};
