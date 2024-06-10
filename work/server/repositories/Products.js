const { where } = require('sequelize');
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
  static async updateProductData(updProduct) {
    // const updateProduct = await Products.update(updProduct, {
    //   where: { id: updProduct.id },
    //   returning: true,
    //   plain: true,
    // });
    const updateProduct = await Products.create(updProduct);

    return updateProduct;
  }
}

module.exports = ProductsRepository;
