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

  static async repairProductData(repProduct) {
    const products = await ProductsRepository.repairProductData(repProduct);

    return repProduct;
  }

  static async getAllProductionQuality() {
    const products = await ProductsRepository.getAllProductionQuality();
    return products;
  }

  static async addNewProductionQuality(new_product_quality) {
    const product = await ProductsRepository.addNewProductionQuality(
      new_product_quality,
    );
    return product;
  }
}

module.exports = ProductService;
