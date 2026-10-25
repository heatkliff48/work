'use strict';

/**
 * Догоняющий патч для БД, развёрнутой на сервере.
 *
 * На сервере накатаны миграции по 20260506091930-create-green-line-monitoring
 * включительно. После этого часть колонок добавляли правкой уже применённых
 * create-миграций «на месте», поэтому sequelize о них ничего не знает и на
 * сервере их нет. Эта миграция добавляет ровно эти колонки.
 *
 * Дата файла намеренно стоит между последней применённой на сервере миграцией
 * и 20260609120450: патч обязан отработать ДО остальных семи новых миграций,
 * иначе 20260903130000-rename-cacke-to-cake-columns упадёт — ему нужна колонка
 * AutoclaveCalendares.total_arrays_cacke_fill_up, которую добавляет патч.
 * Сами семь новых миграций здесь не дублируются, они накатятся обычным путём.
 *
 * Все шаги идемпотентны, поэтому на уже актуальной базе (и при `npm run db`
 * с нуля) миграция ничего не делает.
 *
 * @type {import('sequelize-cli').Migration}
 */

// колонки, добавленные правкой уже применённых create-миграций
const PATCH = [
  ['Orders', 'delivery_m2', 'FLOAT'],
  ['Orders', 'deal_id', 'INTEGER'],
  ['Orders', 'uf_number_offer', 'INTEGER'],
  ['Orders', 'region', 'STRING'],
  ['Orders', 'payment_method', 'STRING'],

  ['OrdersProducts', 'quantity_liberated', 'FLOAT'],
  ['OrderDryMixedProducts', 'quantity_liberated', 'FLOAT'],
  ['OrderAnchorProducts', 'quantity_liberated', 'FLOAT'],
  ['OrderToolProducts', 'quantity_liberated', 'FLOAT'],
  ['OrderRelMatProducts', 'quantity_liberated', 'FLOAT'],

  ['ReservedProducts', 'order_dispatch_id', 'INTEGER'],
  ['ReservedDryMixes', 'order_dispatch_id', 'INTEGER'],
  ['ReservedAnchors', 'order_dispatch_id', 'INTEGER'],
  ['ReservedTools', 'order_dispatch_id', 'INTEGER'],
  ['ReservedRelatedMaterials', 'order_dispatch_id', 'INTEGER'],

  ['Aldabarans', 'agencia', 'STRING'],
  ['Aldabarans', 'matricula', 'STRING'],
  ['Aldabarans', 'referencia', 'STRING'],
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      for (const [table, column, type] of PATCH) {
        const description = await queryInterface.describeTable(table, {
          transaction,
        });
        if (description[column]) continue;

        await queryInterface.addColumn(
          table,
          column,
          { type: Sequelize[type] },
          { transaction },
        );
      }

      // Добавляем со «старым» написанием cacke: следом идущая миграция
      // 20260903130000-rename-cacke-to-cake-columns переименует её в cake.
      // Если колонка уже есть в любом из двух написаний — не трогаем.
      const autoclave = await queryInterface.describeTable(
        'AutoclaveCalendares',
        { transaction },
      );
      if (
        !autoclave.total_arrays_cacke_fill_up &&
        !autoclave.total_arrays_cake_fill_up
      ) {
        await queryInterface.addColumn(
          'AutoclaveCalendares',
          'total_arrays_cacke_fill_up',
          { type: Sequelize.INTEGER },
          { transaction },
        );
      }
    });
  },

  async down(queryInterface, Sequelize) {
    // Откат рассчитан на ситуацию сразу после применения патча на сервере.
    // На полностью актуальной базе эти колонки принадлежат create-миграциям,
    // так что откатывать патч там не нужно.
    await queryInterface.sequelize.transaction(async (transaction) => {
      const autoclave = await queryInterface.describeTable(
        'AutoclaveCalendares',
        { transaction },
      );
      if (autoclave.total_arrays_cacke_fill_up) {
        await queryInterface.removeColumn(
          'AutoclaveCalendares',
          'total_arrays_cacke_fill_up',
          { transaction },
        );
      }

      for (const [table, column] of [...PATCH].reverse()) {
        const description = await queryInterface.describeTable(table, {
          transaction,
        });
        if (!description[column]) continue;

        await queryInterface.removeColumn(table, column, { transaction });
      }
    });
  },
};
