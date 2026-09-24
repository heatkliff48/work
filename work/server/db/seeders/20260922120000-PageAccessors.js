'use strict';

// Аксессоры страниц для базы, поднятой с нуля (`npm run db`); на рабочей базе
// их добавляет миграция 20260922120000-add-page-accessors.
const { addPageAccessors, removePageAccessors } = require('../pageAccessors.js');

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction((transaction) =>
      addPageAccessors(queryInterface, transaction)
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction((transaction) =>
      removePageAccessors(queryInterface, transaction)
    );
  },
};
