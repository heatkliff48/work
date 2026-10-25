'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Порядковый номер версии PDF: растёт вместе с каждым обновлением pdf_updated_at.
    // Существующие заказы начинают с 1: прошлое количество изменений неизвестно.
    await queryInterface.addColumn('Orders', 'pdf_version', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Orders', 'pdf_version');
  },
};
