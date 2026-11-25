'use strict';

/**
 * Право на удаление заказа в карточке со статусами до "Order shipped" (< 9).
 * Ни у одной роли его нет, пока его не выдадут на странице Roles.
 *
 * Как и в 20260922120000-add-page-accessors, на пустой базе (`npm run db`)
 * ничего не делает: там аксессор добавит сидер 20260922120000-PageAccessors.
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
  (a) => a.page_name === 'orders_delete_before_shipped'
);

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const [{ count }] = await queryInterface.sequelize.query(
        'SELECT COUNT(*)::int AS count FROM "Pages"',
        { type: QueryTypes.SELECT, transaction }
      );
      if (!count) return;

      await addPageAccessors(queryInterface, transaction, ACCESSORS);
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction((transaction) =>
      removePageAccessors(queryInterface, transaction, ACCESSORS)
    );
  },
};
