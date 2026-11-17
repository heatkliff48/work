'use strict';

/**
 * Страница Client product prices. Ни у одной роли права нет, пока его не
 * выдадут на странице Roles. System administrator (роль 3) заходит всегда.
 *
 * На пустой базе (`npm run db`) ничего не делает: там аксессор добавит сидер
 * 20260922120000-PageAccessors.
 *
 * @type {import('sequelize-cli').Migration}
 */

const { QueryTypes } = require('sequelize');
const {
  PAGE_ACCESSORS,
  addPageAccessors,
  removePageAccessors,
} = require('../pageAccessors.js');

const ACCESSORS = PAGE_ACCESSORS.filter(
  (a) => a.page_name === 'client_product_prices',
);

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const [{ count }] = await queryInterface.sequelize.query(
        'SELECT COUNT(*)::int AS count FROM "Pages"',
        { type: QueryTypes.SELECT, transaction },
      );
      if (!count) return;

      await addPageAccessors(queryInterface, transaction, ACCESSORS);
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction((transaction) =>
      removePageAccessors(queryInterface, transaction, ACCESSORS),
    );
  },
};
