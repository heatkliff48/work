'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RawMatConsumptionsCurrentMolds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      batch_id: {
        type: Sequelize.INTEGER,
      },
      id_ordered_product_to_warehouse: {
        type: Sequelize.INTEGER,
      },
      recipe_article: {
        type: Sequelize.STRING,
      },
      batch_article: {
        type: Sequelize.STRING,
      },
      production_volume: {
        type: Sequelize.INTEGER,
      },
      cacke_id_start: {
        type: Sequelize.INTEGER,
      },
      consumed_volume: {
        type: Sequelize.INTEGER,
      },
      date: {
        type: Sequelize.STRING,
      },
      used: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable('RawMatConsumptionsCurrentMolds');
  },
};
