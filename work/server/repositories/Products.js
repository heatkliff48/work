const { Products } = require('../db/models');

class ProductsRepository {
  static async getAllProductsData() {
    const products = await Products.findAll();
    console.log('GET ALL PRODUCTS>>>>>>>>>>>>>>>>>>', products);

    return products;
  }
}

module.exports = ProductsRepository;
