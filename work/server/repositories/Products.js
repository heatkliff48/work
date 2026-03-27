const {
  Products,
  ProductionQualities,
  QualityDimensions,
  QualityCompressions,
} = require('../db/models');
const { sequelize } = require('../db/models');

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
