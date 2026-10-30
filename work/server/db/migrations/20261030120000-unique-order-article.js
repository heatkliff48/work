'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Номер заказа раньше считал браузер, поэтому в базе могли появиться
    // одинаковые номера. Перенумеровывать их автоматически нельзя: номер уже
    // напечатан в документах (PDF, albaran, factura) — решать должен человек
    const duplicates = await queryInterface.sequelize.query(
      `SELECT article, array_agg(id ORDER BY id) AS ids
         FROM "Orders"
        WHERE article IS NOT NULL
        GROUP BY article
       HAVING COUNT(*) > 1
        ORDER BY article`,
      { type: Sequelize.QueryTypes.SELECT },
    );
    if (duplicates.length > 0) {
      const list = duplicates
        .map(({ article, ids }) => `  ${article}: id ${ids.join(', ')}`)
        .join('\n');
      throw new Error(
        `Orders with duplicate article found, fix them and run the migration again:\n${list}`,
      );
    }

    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addIndex('Orders', ['article'], {
        name: 'orders_article_unique',
        unique: true,
        transaction,
      });

      // Ключ попытки создания заказа: повторная отправка после обрыва связи
      // возвращает уже созданный заказ. У старых заказов NULL — уникальности не мешает
      await queryInterface.addColumn(
        'Orders',
        'client_request_id',
        { type: Sequelize.STRING(64), allowNull: true },
        { transaction },
      );
      await queryInterface.addIndex('Orders', ['client_request_id'], {
        name: 'orders_client_request_id_unique',
        unique: true,
        transaction,
      });
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeIndex('Orders', 'orders_client_request_id_unique', {
        transaction,
      });
      await queryInterface.removeColumn('Orders', 'client_request_id', { transaction });
      await queryInterface.removeIndex('Orders', 'orders_article_unique', { transaction });
    });
  },
};
