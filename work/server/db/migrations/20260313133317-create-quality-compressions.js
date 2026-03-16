'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('QualityCompressions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      batch_id: {
        type: Sequelize.STRING,
      },
      sub_lote_id: {
        type: Sequelize.STRING,
      },
      dimension_id: {
        type: Sequelize.STRING,
      },
      weight_after_autoclave: {
        type: Sequelize.STRING,
      },
      weight_after_50c: {
        type: Sequelize.STRING,
      },
      weight_after_105c: {
        type: Sequelize.STRING,
      },
      load_kn: {
        type: Sequelize.STRING,
      },
      length: {
        type: Sequelize.STRING,
      },
      width: {
        type: Sequelize.STRING,
      },
      height: {
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
    await queryInterface.dropTable('QualityCompressions');
  },
};
