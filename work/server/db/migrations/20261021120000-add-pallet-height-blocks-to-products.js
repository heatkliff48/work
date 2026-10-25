'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Высота паллеты в блоках (рядах). Прежние карточки остаются с кодом
    // высоты в palletHeight (Std / Marine / High / Std+1) и пустым
    // palletHeightBlocks — их ряды считаются из высоты паллеты в мм.
    await queryInterface.addColumn('Products', 'palletHeightBlocks', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Products', 'palletHeightBlocks');
  },
};
