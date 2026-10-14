'use strict';

// Номер партии (batch_id из LotesListsBatches), которая заливается по этой
// строке плана. Записывается при открытии партии на странице Casting, чтобы
// после перезагрузки восстановить именно её, а не угадывать по продукту.
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('BatchOutsides', 'batch_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('BatchOutsides', 'batch_id');
  },
};
