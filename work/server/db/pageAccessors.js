'use strict';

const { QueryTypes } = require('sequelize');

/**
 * Аксессоры (записи в Pages) для страниц, у которых раньше не было своего
 * права доступа: пункт меню открывался всем или по праву соседней страницы.
 *
 * inherit — аксессор, от которого новый получает права каждой роли при
 * создании, чтобы после выкатки ни у кого не пропал уже имевшийся доступ.
 * null — страница была открыта всем, поэтому всем ролям даётся read/write.
 *
 * Имена совпадают с путём страницы (см. client/src/utils/pageAccess.js).
 */
const PAGE_ACCESSORS = [
  { page_name: 'production_quality', inherit: null },
  { page_name: 'clients_price_info', inherit: 'Clients' },
  { page_name: 'orders_to_warehouse', inherit: 'Orders' },
  { page_name: 'autoclave_calendar', inherit: 'production_batch_designer' },
  { page_name: 'technology_calendar', inherit: 'recipe_products' },
  { page_name: 'cake_fillup', inherit: 'recipe_products' },
  { page_name: 'raw_material_consumption', inherit: 'recipe_products' },
  { page_name: 'lotes_list', inherit: 'recipe_products' },
  { page_name: 'factura_manager', inherit: 'accounting' },
  { page_name: 'green_line_monitoring', inherit: 'recipe_products' },
  { page_name: 'temperature_data_monitoring', inherit: 'recipe_products' },
];

const select = (queryInterface, sql, options = {}) =>
  queryInterface.sequelize.query(sql, { type: QueryTypes.SELECT, ...options });

// Если строки вставлялись с явными id (восстановление из дампа, ручной INSERT),
// последовательность отстаёт от MAX(id) и вставка падает на
// «Key (id)=(…) already exists». Ставим следующий id сразу после MAX(id).
const syncIdSequence = (queryInterface, table, transaction) =>
  queryInterface.sequelize.query(
    `SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM "${table}"`,
    { transaction }
  );

// Добавляет недостающие аксессоры и раздаёт по ним права ролям.
// Уже существующие аксессоры не трогает, поэтому повторный запуск безопасен.
async function addPageAccessors(queryInterface, transaction) {
  const now = new Date();

  let pages = await select(queryInterface, 'SELECT id, page_name FROM "Pages"', {
    transaction,
  });
  const existing = new Set(pages.map((p) => p.page_name));
  const missing = PAGE_ACCESSORS.filter((a) => !existing.has(a.page_name));
  if (!missing.length) return;

  await syncIdSequence(queryInterface, 'Pages', transaction);
  await queryInterface.bulkInsert(
    'Pages',
    missing.map(({ page_name }) => ({
      page_name,
      createdAt: now,
      updatedAt: now,
    })),
    { transaction }
  );

  pages = await select(
    queryInterface,
    'SELECT id, page_name FROM "Pages" ORDER BY id DESC',
    { transaction }
  );
  // при дублях имени берётся страница с меньшим id
  const pageIdByName = new Map(pages.map((p) => [p.page_name, p.id]));

  const roles = await select(queryInterface, 'SELECT id FROM "Roles"', {
    transaction,
  });
  const permissions = await select(
    queryInterface,
    'SELECT page_id, role_id, read, write FROM "PageAndRoles"',
    { transaction }
  );
  const findPermission = (page_id, role_id) =>
    permissions.find((p) => p.page_id === page_id && p.role_id === role_id);

  const rows = [];
  for (const { page_name, inherit } of missing) {
    for (const { id: role_id } of roles) {
      const source = inherit
        ? findPermission(pageIdByName.get(inherit), role_id)
        : { read: true, write: true };

      rows.push({
        page_id: pageIdByName.get(page_name),
        role_id,
        read: !!source?.read,
        write: !!source?.write,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  if (rows.length) {
    await syncIdSequence(queryInterface, 'PageAndRoles', transaction);
    await queryInterface.bulkInsert('PageAndRoles', rows, { transaction });
  }
}

async function removePageAccessors(queryInterface, transaction) {
  const pages = await select(
    queryInterface,
    'SELECT id FROM "Pages" WHERE page_name IN (:names)',
    {
      replacements: { names: PAGE_ACCESSORS.map((a) => a.page_name) },
      transaction,
    }
  );
  const ids = pages.map((p) => p.id);
  if (!ids.length) return;

  await queryInterface.bulkDelete('PageAndRoles', { page_id: ids }, { transaction });
  await queryInterface.bulkDelete('Pages', { id: ids }, { transaction });
}

module.exports = { PAGE_ACCESSORS, addPageAccessors, removePageAccessors };
