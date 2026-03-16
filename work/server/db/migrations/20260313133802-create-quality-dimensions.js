'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('QualityDimensions', {
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
      largo_1: {
        type: Sequelize.STRING,
      },
      largo_2: {
        type: Sequelize.STRING,
      },
      largo_3: {
        type: Sequelize.STRING,
      },
      largo_4: {
        type: Sequelize.STRING,
      },
      ancho_1: {
        type: Sequelize.STRING,
      },
      ancho_2: {
        type: Sequelize.STRING,
      },
      ancho_3: {
        type: Sequelize.STRING,
      },
      ancho_4: {
        type: Sequelize.STRING,
      },
      altura_1: {
        type: Sequelize.STRING,
      },
      altura_2: {
        type: Sequelize.STRING,
      },
      altura_3: {
        type: Sequelize.STRING,
      },
      altura_4: {
        type: Sequelize.STRING,
      },
      support_face_parallelism_1: {
        type: Sequelize.STRING,
      },
      support_face_parallelism_2: {
        type: Sequelize.STRING,
      },
      support_face_parallelism_3: {
        type: Sequelize.STRING,
      },
      support_face_parallelism_4: {
        type: Sequelize.STRING,
      },
      diagonal_1: {
        type: Sequelize.STRING,
      },
      diagonal_2: {
        type: Sequelize.STRING,
      },
      diagonal_3: {
        type: Sequelize.STRING,
      },
      diagonal_4: {
        type: Sequelize.STRING,
      },
      flatness_1: {
        type: Sequelize.STRING,
      },
      flatness_2: {
        type: Sequelize.STRING,
      },
      flatness_3: {
        type: Sequelize.STRING,
      },
      flatness_4: {
        type: Sequelize.STRING,
      },
      angle_90_1: {
        type: Sequelize.STRING,
      },
      angle_90_2: {
        type: Sequelize.STRING,
      },
      angle_90_3: {
        type: Sequelize.STRING,
      },
      angle_90_4: {
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
    await queryInterface.dropTable('QualityDimensions');
  },
};
