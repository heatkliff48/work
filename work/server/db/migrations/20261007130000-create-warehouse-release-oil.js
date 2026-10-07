'use strict';

/**
 * Склад разделительного масла (Release oil): таблица поставок и строка
 * в RawMaterialsWarehouses.
 *
 * При `npm run db` с нуля RawMaterialsWarehouses на этом шаге ещё пустая:
 * сидеры идут после миграций, и строку добавит сидер
 * 20250926143441-raw-materials-init. Поэтому строку вставляем только в уже
 * заполненную базу.
 *
 * @type {import('sequelize-cli').Migration}
 */

const { QueryTypes } = require('sequelize');
const { syncIdSequence } = require('../pageAccessors.js');

const MATERIAL_TYPE = 'Release oil';

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'WarehouseReleaseOils',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          supplier: {
            type: Sequelize.STRING,
          },
          quantity: {
            type: Sequelize.FLOAT,
          },
          type: {
            type: Sequelize.STRING,
          },
          quality: {
            type: Sequelize.FLOAT,
          },
          date: {
            type: Sequelize.STRING,
          },
          file_name: {
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
        },
        { transaction },
      );

      const [{ total, existing }] = await queryInterface.sequelize.query(
        `SELECT COUNT(*)::int AS total,
                COUNT(*) FILTER (WHERE material_type = :materialType)::int AS existing
           FROM "RawMaterialsWarehouses"`,
        {
          type: QueryTypes.SELECT,
          replacements: { materialType: MATERIAL_TYPE },
          transaction,
        },
      );
      if (!total || existing) return;

      // Строки склада могли вставляться с явными id (сидер, дамп), и
      // последовательность id отстаёт от данных
      await syncIdSequence(queryInterface, 'RawMaterialsWarehouses', transaction);

      const now = new Date();
      await queryInterface.bulkInsert(
        'RawMaterialsWarehouses',
        [
          {
            material_type: MATERIAL_TYPE,
            remaining_quantity: 0,
            consumed_quantity: 0,
            last_updated: formatDate(now),
            createdAt: now,
            updatedAt: now,
          },
        ],
        { transaction },
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.bulkDelete(
        'RawMaterialsWarehouses',
        { material_type: MATERIAL_TYPE },
        { transaction },
      );
      await queryInterface.dropTable('WarehouseReleaseOils', { transaction });
    });
  },
};
