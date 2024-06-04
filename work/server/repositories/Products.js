const { Products } = require('../db/models');

class ProductsRepository {
  static async getAllProductsData() {
    const products = await Products.findAll();

    return products;
  }
  static async addNewProductData(newProduct) {
    const product = await Products.create(newProduct);
    return product;
  }
}

module.exports = ProductsRepository;
