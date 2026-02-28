const { Products, ProductionQualities } = require('../db/models');

class ProductsRepository {
  static async getAllProductsData() {
    const products = await Products.findAll();
    return products;
  }

  static async addNewProductData(newProduct) {
    const product = await Products.create(newProduct);
    return product;
  }

  static async updateProductData(updProduct) {
    // const updateProduct = await Products.update(updProduct, {
    //   where: { id: updProduct.id },
    //   returning: true,
    //   plain: true,
    // });
    const updateProduct = await Products.create(updProduct);

    return updateProduct;
  }

  static async repairProductData(repProduct) {
    await Products.update(repProduct, {
      where: { id: repProduct.id },
    });

    return repProduct;
  }

  static async getAllProductionQuality() {
    const products = await ProductionQualities.findAll();
    return products;
  }

  static async addNewProductionQuality(new_production_quantities) {
    const product = await ProductionQualities.create(new_production_quantities);
    return product;
  }
}

module.exports = ProductsRepository;
