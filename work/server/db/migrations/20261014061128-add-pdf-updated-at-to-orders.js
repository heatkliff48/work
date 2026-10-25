'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Добавляем только новую колонку в существующую таблицу.
    // Старые заказы остаются с NULL: точная история изменений товаров неизвестна.
    await queryInterface.addColumn('Orders', 'pdf_updated_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Orders', 'pdf_updated_at');
  },
};
