const ProductsRepository = require('../repositories/Products.js');

class ProductService {
  static async getAllProduct() {
    const products = await ProductsRepository.getAllProductsData();

    return products;
  }

  static async addNewProduct(product) {
    const products = await ProductsRepository.addNewProductData(product);

    return products;
  }

  static async updateProduct(product) {
    const products = await ProductsRepository.updateProductData(product);

    return products;
  }

  static async repairProductData( repProduct ) {
    const products = await ProductsRepository.repairProductData(repProduct);

    return repProduct;
  }
}

module.exports = ProductService;
