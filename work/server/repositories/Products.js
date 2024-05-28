const { Products } = require('../db/models');

class ProductsRepository {
  static async getAllProductsData() {
    const products = await Products.findAll();

    return products;
  }
}

module.exports = ProductsRepository;
