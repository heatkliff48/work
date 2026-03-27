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

  static async updateProduct() {
    const products = await ProductsRepository.updateProductData();

    return products;
  }

  static async repairProductData(repProduct) {
    const products = await ProductsRepository.repairProductData(repProduct);

    return repProduct;
  }

  //PRODUCTION QUALITY
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

  //DIMENSION QUALITY
  static async getAllDimensionsQuality() {
    const products = await ProductsRepository.getAllDimensionsQuality();
    return products;
  }

  static async addNewDimensionsQuality(new_product_quality) {
    const product = await ProductsRepository.addNewDimensionsQuality(
      new_product_quality,
    );
    return product;
  }

  static async updateDimensionsQuality(new_product_quality) {
    const product = await ProductsRepository.updateDimensionsQuality(
      new_product_quality,
    );
    return product;
  }

  //COMPRESSIONS QUALITY
  static async getAllCompressionsQuality() {
    const products = await ProductsRepository.getAllCompressionsQuality();
    return products;
  }

  static async addNewCompressionsQuality(new_product_quality) {
    const product = await ProductsRepository.addNewCompressionsQuality(
      new_product_quality,
    );
    return product;
  }

  static async updateCompressionsQuality(product_quality) {
    const product = await ProductsRepository.updateCompressionsQuality(
      product_quality,
    );
    return product;
  }
}

module.exports = ProductService;
