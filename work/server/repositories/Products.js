const {
  Products,
  ProductionQualities,
  QualityDimensions,
  QualityCompressions,
} = require('../db/models');
const models = require('../db/models');
const { sequelize } = require('../db/models');
const { Op } = require('sequelize');
const { Conflict, BadRequest } = require('../utils/Errors.js');

// Колонки, в которых хранится артикул продукта (строкой, без связи по id)
const PRODUCT_ARTICLE_REFERENCES = [
  ['Warehouses', 'product_article'],
  ['StockBalances', 'product_article'],
  ['OrderToWarehouse', 'product_article'],
  ['ListOfOrderedProductions', 'product_article'],
  ['ListOfOrderedProductionOEMs', 'product_article'],
  ['BatchOutside', 'product_article'],
  ['QualityManagement', 'product_article'],
  ['ProductionQualities', 'product_article'],
  ['ProductionBatchLog', 'products_article'],
];

class ProductsRepository {
  static async getAllProductsData() {
    const products = await Products.findAll();
    return products;
  }

  static async addNewProductData(newProduct) {
    const product = await Products.create(newProduct);
    return product;
  }

  static async updateProductData() {
    const updateProducts = await Products.update(
      {
        widthInArray: sequelize.literal(`
        CASE 
          WHEN width = 50 THEN FLOOR(600 / width)
          WHEN width = 75 THEN FLOOR(975 / width)
          WHEN width = 85 THEN FLOOR(1190 / width)
          WHEN width = 200 THEN FLOOR(1400 / width)
          WHEN width = 350 THEN FLOOR(1400 / width)
          ELSE FLOOR(1500 / width)
        END
      `),
      },
      {
        where: {}, // обновляем все записи
        returning: true, // для PostgreSQL, чтобы получить обновленные записи
      },
    );
    // const updateProduct = await Products.update(updProduct, {
    //   where: { id: updProduct.id },
    //   returning: true,
    //   plain: true,
    // });
    // const updateProduct = await Products.create(updProduct);

    console.log(' _____________----------------------_______________________');

    return updateProducts;
  }

  static async repairProductData(repProduct) {
    await Products.update(repProduct, {
      where: { id: repProduct.id },
    });

    return repProduct;
  }

  // changes: [{ from, to }] — переименовывает артикул во всех версиях продукта
  // и во всех таблицах, где он упоминается
  static async fixProductArticles(changes) {
    const froms = changes.map(({ from }) => from);
    const tos = changes.map(({ to }) => to);

    if (
      !changes.length ||
      [...froms, ...tos].some((article) => !article) ||
      new Set(froms).size !== froms.length ||
      new Set(tos).size !== tos.length
    ) {
      throw new BadRequest('Invalid list of article changes');
    }

    // Все замены применяются одним CASE, поэтому цепочки (A→B, B→C) не мешают друг другу
    const articleCase = (column) =>
      sequelize.literal(
        `CASE "${column}" ${changes
          .map(
            ({ from, to }) =>
              `WHEN ${sequelize.escape(from)} THEN ${sequelize.escape(to)}`,
          )
          .join(' ')} ELSE "${column}" END`,
      );

    return sequelize.transaction(async (transaction) => {
      const taken = await Products.findOne({
        where: { article: { [Op.in]: tos, [Op.notIn]: froms } },
        transaction,
      });
      if (taken) {
        throw new Conflict(
          `Article ${taken.article} is already used by another product`,
        );
      }

      const updated = {};
      for (const [modelName, column] of [
        ['Products', 'article'],
        ...PRODUCT_ARTICLE_REFERENCES,
      ]) {
        const [count] = await models[modelName].update(
          { [column]: articleCase(column) },
          { where: { [column]: { [Op.in]: froms } }, transaction },
        );
        updated[modelName] = count;
      }

      return updated;
    });
  }

  // changes: [{ tradingMark, density, price }] — новая цена за м³ для всех продуктов
  // с такой маркой и плотностью. Каждый изменённый продукт получает новую версию
  static async changeProductPrices(changes) {
    const groupKey = (tradingMark, density) =>
      `${tradingMark ?? ''}|${Number(density)}`;
    const keys = changes.map(({ tradingMark, density }) =>
      groupKey(tradingMark, density),
    );

    if (
      !changes.length ||
      changes.some(
        ({ density, price }) =>
          !Number.isFinite(Number(density)) ||
          typeof price !== 'number' ||
          !Number.isFinite(price) ||
          price < 0,
      ) ||
      new Set(keys).size !== keys.length
    ) {
      throw new BadRequest('Invalid list of price changes');
    }

    const priceByKey = new Map(
      changes.map(({ tradingMark, density, price }) => [
        groupKey(tradingMark, density),
        price,
      ]),
    );

    return sequelize.transaction(async (transaction) => {
      const products = await Products.findAll({ raw: true, transaction });

      // Последняя версия каждого артикула — как latestProducts на клиенте
      const latest = new Map();
      for (const product of products) {
        const current = latest.get(product.article);
        if (!current || (product.version ?? 1) > (current.version ?? 1)) {
          latest.set(product.article, product);
        }
      }

      const created = [];
      for (const product of latest.values()) {
        const price = priceByKey.get(
          groupKey(product.tradingMark, product.density),
        );
        if (price === undefined || product.price === price) continue;

        const { id, createdAt, updatedAt, ...rest } = product;
        created.push(
          await Products.create(
            { ...rest, version: (product.version ?? 1) + 1, price },
            { transaction },
          ),
        );
      }

      return created;
    });
  }

  //PRODUCTION QUALITY
  static async getAllProductionQuality() {
    const products = await ProductionQualities.findAll();
    return products;
  }

  static async addNewProductionQuality(new_production_quantities) {
    const product = await ProductionQualities.create(new_production_quantities);
    return product;
  }

  //DIMENSION QUALITY
  static async getAllDimensionsQuality() {
    const products = await QualityDimensions.findAll();
    return products;
  }

  static async addNewDimensionsQuality(new_dimensions_quantities) {
    const result = [];

    for (const el of new_dimensions_quantities) {
      const product = await QualityDimensions.create(el);

      result.push(product);
    }

    return result;
  }

  static async updateDimensionsQuality(dimensions_quantities) {
    const result = [];

    for (const el of dimensions_quantities) {
      const [count, product] = await QualityDimensions.update(el, {
        where: {
          batch_id: el.batch_id,
          sub_lote_id: el.sub_lote_id,
        },
        returning: true,
        plain: true,
      });

      result.push(product);
    }

    return result;
  }

  //COMPRESSIONS QUALITY
  static async getAllCompressionsQuality() {
    const products = await QualityCompressions.findAll();
    return products;
  }

  static async addNewCompressionsQuality(new_compressions_quantities) {
    const result = [];
    try {
      for (const el of new_compressions_quantities) {
        const product = await QualityCompressions.create(el);

        result.push(product);
      }

      return result;
    } catch (error) {
      console.log('error Products.js line 83', error);
    }
  }

  static async updateCompressionsQuality(compressions_quantities) {
    const result = [];
    try {
      for (const el of compressions_quantities) {
        const [count, product] = await QualityCompressions.update(el, {
          where: {
            batch_id: el.batch_id,
            sub_lote_id: el.sub_lote_id,
            dimension_id: el.dimension_id,
          },
          returning: true,
          plain: true,
        });

        result.push(product);
      }

      return result;
    } catch (error) {
      console.log('error Products.js line 83', error);
    }
  }
}

module.exports = ProductsRepository;
