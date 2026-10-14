'use strict';

/**
 * Добавляет аксессоры для страниц, у которых не было своего права доступа
 * (список и правила наследования прав — в db/pageAccessors.js).
 *
 * При `npm run db` с нуля Pages на этом шаге ещё пустая: сидеры идут после
 * миграций, и вставка сюда сдвинула бы id страниц, на которые завязан сидер
 * PageAndRoles. Поэтому на пустой базе миграция ничего не делает, а аксессоры
 * добавляет сидер 20260922120000-PageAccessors.
 *
 * @type {import('sequelize-cli').Migration}
 */

const { QueryTypes } = require('sequelize');
const { addPageAccessors, removePageAccessors } = require('../pageAccessors.js');

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const [{ count }] = await queryInterface.sequelize.query(
        'SELECT COUNT(*)::int AS count FROM "Pages"',
        { type: QueryTypes.SELECT, transaction }
      );
      if (!count) return;

      await addPageAccessors(queryInterface, transaction);
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction((transaction) =>
      removePageAccessors(queryInterface, transaction)
    );
  },
};
