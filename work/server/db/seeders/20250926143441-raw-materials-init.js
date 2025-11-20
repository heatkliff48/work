"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    };

    const currentDate = new Date();

    await queryInterface.bulkInsert(
      "RawMaterialsWarehouses",
      [
        {
          material_type: "Sand (dry)",
          remaining_quantity: 0,
          consumed_quantity: 0,
          last_updated: formatDate(currentDate),
          createdAt: currentDate,
          updatedAt: currentDate,
        },
        {
          material_type: "Lime",
          remaining_quantity: 0,
          consumed_quantity: 0,
          last_updated: formatDate(currentDate),
          createdAt: currentDate,
          updatedAt: currentDate,
        },
        {
          material_type: "Cement",
          remaining_quantity: 0,
          consumed_quantity: 0,
          last_updated: formatDate(currentDate),
          createdAt: currentDate,
          updatedAt: currentDate,
        },
        {
          material_type: "Gypsum (dry)",
          remaining_quantity: 0,
          consumed_quantity: 0,
          last_updated: formatDate(currentDate),
          createdAt: currentDate,
          updatedAt: currentDate,
        },
        {
          material_type: "Gypsum stone",
          remaining_quantity: 0,
          consumed_quantity: 0,
          last_updated: formatDate(currentDate),
          createdAt: currentDate,
          updatedAt: currentDate,
        },
        {
          material_type: "Aluminum 1",
          remaining_quantity: 0,
          consumed_quantity: 0,
          last_updated: formatDate(currentDate),
          createdAt: currentDate,
          updatedAt: currentDate,
        },
        {
          material_type: "Aluminum 2",
          remaining_quantity: 0,
          consumed_quantity: 0,
          last_updated: formatDate(currentDate),
          createdAt: currentDate,
          updatedAt: currentDate,
        },
        {
          material_type: "Grinding Balls",
          remaining_quantity: 0,
          consumed_quantity: 0,
          last_updated: formatDate(currentDate),
          createdAt: currentDate,
          updatedAt: currentDate,
        },
        {
          material_type: "AAC",
          remaining_quantity: 0,
          consumed_quantity: 0,
          last_updated: formatDate(currentDate),
          createdAt: currentDate,
          updatedAt: currentDate,
        },
        {
          material_type: "Sand slurry (dry)",
          remaining_quantity: 0,
          consumed_quantity: 0,
          last_updated: formatDate(currentDate),
          createdAt: currentDate,
          updatedAt: currentDate,
        },
        {
          material_type: "Return slurry (dry)",
          remaining_quantity: 0,
          consumed_quantity: 0,
          last_updated: formatDate(currentDate),
          createdAt: currentDate,
          updatedAt: currentDate,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("RawMaterialsWarehouses", null, {});
  },
};
