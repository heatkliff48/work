'use strict';

// Check articles → Fix переименовал продукты в каталоге и в таблицах из
// PRODUCT_ARTICLE_REFERENCES, но в отгрузках (OrderDispatches.article) и в расходе
// сырья (RawMatConsumptions / RawMatConsumptionsCurrentMolds.batch_article)
// остались прежние артикулы.
// Чиним только висячие артикулы блоков — T.…, которых нет среди Products.article:
// 1. по связи с записью, где артикул уже новый: отгрузка — через строку заказа
//    (OrdersProducts.product_id), расход сырья — через заказ в производство
//    (OrderToWarehouses), Fix его переименовал;
// 2. остальные — по прежней схеме артикула, собранной из карточки продукта:
//    Fix менял только артикул, код высоты паллеты в карточке остался.
// Что сопоставить не удалось, выводится в лог.

// Колонки с артикулом продукта (как PRODUCT_ARTICLE_REFERENCES, но с именами таблиц)
const ARTICLE_COLUMNS = [
  ['Warehouses', 'product_article'],
  ['StockBalances', 'product_article'],
  ['OrderToWarehouses', 'product_article'],
  ['ListOfOrderedProductions', 'product_article'],
  ['ListOfOrderedProductionOEMs', 'product_article'],
  ['BatchOutsides', 'product_article'],
  ['QualityManagements', 'product_article'],
  ['ProductionQualities', 'product_article'],
  ['ProductionBatchLogs', 'products_article'],
  ['OrderDispatches', 'article'],
  ['RawMatConsumptions', 'batch_article'],
  ['RawMatConsumptionsCurrentMolds', 'batch_article'],
];

// column — с алиасом таблицы: без него "article" в подзапросе означал бы cur.article
const isStale = (column) =>
  `${column} LIKE 'T.%' AND NOT EXISTS (
     SELECT 1 FROM "Products" AS cur WHERE cur.article = ${column})`;

// Прежняя буква артикула: место × 16 + упаковка × 8 + размер паллеты × 4 + высота
const LEGACY_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const OPTION_CODES = {
  spain: 0,
  türkiye: 1,
  reusable: 0,
  disposable: 1,
  '1200x1000': 0,
  '1200x800': 1,
  std: 0,
  marine: 1,
  high: 2,
  'std+1': 3,
};

const optionCode = (value) => {
  const key = String(value ?? '').trim().toLowerCase();
  return /^\d+$/.test(key) ? Number(key) : OPTION_CODES[key];
};

// Артикул карточки по схеме до H<ряды>, например T.NAD35W20C
const legacyArticle = (product) => {
  const { form, certificate, density, width } = product;
  const place = optionCode(product.placeOfProduction);
  const packaging = optionCode(product.typeOfPackaging);
  const size = optionCode(product.palletSize);
  const height = optionCode(product.palletHeight);

  if (
    !(place <= 1 && packaging <= 1 && size <= 1 && height <= 3) ||
    !form ||
    !certificate ||
    density == null ||
    width == null
  ) {
    return null;
  }

  const letter = LEGACY_LETTERS[place * 16 + packaging * 8 + size * 4 + height];
  return `T.${form.toUpperCase().slice(0, 1)}${letter}D${String(density).slice(
    0,
    2,
  )}W${String(width).slice(0, 2)}${certificate.slice(0, 1)}`;
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const { sequelize } = queryInterface;

    await sequelize.transaction(async (transaction) => {
      const query = (sql) => sequelize.query(sql, { transaction });

      // 1. По связи с уже переименованной записью
      await query(
        `UPDATE "OrderDispatches" AS od
            SET article = p.article
           FROM "OrdersProducts" AS op
           JOIN "Products" AS p ON p.id = op.product_id
          WHERE op.id = od."orderProductId"
            AND COALESCE(od.product_table, '') IN ('product', '')
            AND ${isStale('od.article')}`,
      );

      for (const table of ['RawMatConsumptions', 'RawMatConsumptionsCurrentMolds']) {
        await query(
          `UPDATE "${table}" AS r
              SET batch_article = otw.product_article
             FROM "OrderToWarehouses" AS otw
            WHERE otw.id = r.id_ordered_product_to_warehouse
              AND ${isStale('r.batch_article')}
              AND EXISTS (
                SELECT 1 FROM "Products" AS p WHERE p.article = otw.product_article)`,
        );
      }

      // 2. По прежней схеме артикула; если на неё приходится несколько карточек — не трогаем
      const [products] = await query(
        `SELECT article, form, certificate, density, width,
                "placeOfProduction", "typeOfPackaging", "palletSize", "palletHeight"
           FROM "Products"
          WHERE "palletHeight" IS NOT NULL AND "palletHeight" <> ''`,
      );

      const targets = new Map();
      products.forEach((product) => {
        const legacy = legacyArticle(product);
        if (!legacy || legacy === product.article) return;
        if (!targets.has(legacy)) targets.set(legacy, new Set());
        targets.get(legacy).add(product.article);
      });

      for (const [table, column] of ARTICLE_COLUMNS) {
        const [staleRows] = await query(
          `SELECT DISTINCT t."${column}" AS article FROM "${table}" AS t
            WHERE ${isStale(`t."${column}"`)}`,
        );
        const changes = staleRows
          .map(({ article }) => [article, targets.get(article)])
          .filter(([, to]) => to?.size === 1)
          .map(([from, to]) => [from, [...to][0]]);

        if (!changes.length) continue;

        await query(
          `UPDATE "${table}"
              SET "${column}" = CASE "${column}" ${changes
                .map(
                  ([from, to]) =>
                    `WHEN ${sequelize.escape(from)} THEN ${sequelize.escape(to)}`,
                )
                .join(' ')} ELSE "${column}" END
            WHERE "${column}" IN (${changes
              .map(([from]) => sequelize.escape(from))
              .join(', ')})`,
        );
      }

      // Что осталось без пары в каталоге
      for (const [table, column] of ARTICLE_COLUMNS) {
        const [leftRows] = await query(
          `SELECT t."${column}" AS article, COUNT(*)::int AS row_count
             FROM "${table}" AS t
            WHERE ${isStale(`t."${column}"`)}
            GROUP BY t."${column}" ORDER BY t."${column}"`,
        );
        leftRows.forEach(({ article, row_count }) => {
          const candidates = [...(targets.get(article) ?? [])];
          console.warn(
            `Stale article ${table}.${column}: ${article} (${row_count} rows)` +
              (candidates.length ? `, candidates: ${candidates.join(', ')}` : ''),
          );
        });
      }
    });
  },

  // Прежних артикулов в каталоге больше нет — возвращать их нельзя
  async down() {},
};
