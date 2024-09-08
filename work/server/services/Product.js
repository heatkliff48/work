const TokenService = require('./Token.js');
const { ACCESS_TOKEN_EXPIRATION } = require('../constants.js');
const ProductsRepository = require('../repositories/Products.js');

class ProductService {
  static async getAllProduct({ id, username, email, fingerprint }) {
    const products = await ProductsRepository.getAllProductsData();
    const payload = { id, username, email };

    const { accessToken, refreshToken } = await TokenService.getTokens(
      payload,
      fingerprint
    );

    return {
      products,
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    };
  }

  static async addNewProduct({ id, username, email, fingerprint, product }) {
    const products = await ProductsRepository.addNewProductData(product);
    const payload = { id, username, email };

    const { accessToken, refreshToken } = await TokenService.getTokens(
      payload,
      fingerprint
    );

    return {
      products,
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    };
  }

  static async updateProduct({ id, username, email, fingerprint, product }) {
    const products = await ProductsRepository.updateProductData(product);
    const payload = { id, username, email };

    const { accessToken, refreshToken } = await TokenService.getTokens(
      payload,
      fingerprint
    );

    return {
      products,
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    };
  }
}

module.exports = ProductService;
