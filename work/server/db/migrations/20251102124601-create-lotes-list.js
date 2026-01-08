"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("LotesLists", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      cake_id: {
        type: Sequelize.INTEGER,
      },
      cake_id_finish: {
        type: Sequelize.INTEGER,
      },
      production_date: {
        type: Sequelize.STRING,
      },
      product: {
        type: Sequelize.STRING,
      },
      recipe: {
        type: Sequelize.STRING,
      },
      quantity_cakes: {
        type: Sequelize.INTEGER,
      },
      warehouse_id: {
        type: Sequelize.STRING,
      },
      custom_recipe: {
        type: Sequelize.BOOLEAN,
      },
      sand_dry: {
        type: Sequelize.STRING,
      },
      sand_slurry_dry: {
        type: Sequelize.STRING,
      },
      lime: {
        type: Sequelize.STRING,
      },
      cement: {
        type: Sequelize.STRING,
      },
      gypsum_dry: {
        type: Sequelize.STRING,
      },
      return_dry: {
        type: Sequelize.STRING,
      },
      gypsum_stone: {
        type: Sequelize.STRING,
      },
      aluminum_paste: {
        type: Sequelize.STRING,
      },
      aluminum_paste_2: {
        type: Sequelize.STRING,
      },
      grinding_balls: {
        type: Sequelize.STRING,
      },
      aac: {
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
    await queryInterface.dropTable("LotesLists");
  },
};
