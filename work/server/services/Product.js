// const jwt = require('jsonwebtoken');
const TokenService = require('./Token.js');
const RefreshSessionsRepository = require('../repositories/RefreshSession.js');
const { ACCESS_TOKEN_EXPIRATION } = require('../constants.js');
const ProductsRepository = require('../repositories/Products.js');

class ProductService {
  static async getAllProduct({ id, username, email, fingerprint }) {
    const products = await ProductsRepository.getAllProductsData();
    const payload = { id, username, email };

    const accessToken = await TokenService.generateAccessToken(payload);
    const refreshToken = await TokenService.generateRefreshToken(payload);

    await RefreshSessionsRepository.createRefreshSession({
      user_id: id,
      refresh_token: refreshToken,
      finger_print: fingerprint,
    });

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

    const accessToken = await TokenService.generateAccessToken(payload);
    const refreshToken = await TokenService.generateRefreshToken(payload);

    await RefreshSessionsRepository.createRefreshSession({
      user_id: id,
      refresh_token: refreshToken,
      finger_print: fingerprint,
    });

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

    const accessToken = await TokenService.generateAccessToken(payload);
    const refreshToken = await TokenService.generateRefreshToken(payload);

    await RefreshSessionsRepository.createRefreshSession({
      user_id: id,
      refresh_token: refreshToken,
      finger_print: fingerprint,
    });

    return {
      products,
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    };
  }

  // static async logOut(refreshToken) {
  //   await RefreshSessionsRepository.deleteRefreshSession(refreshToken);
  // }

  // static async refresh({ fingerprint, currentRefreshToken }) {
  //   if (!currentRefreshToken) {
  //     throw new UnProductorized();
  //   }
  //   const refreshSession = await RefreshSessionsRepository.getRefreshSession(
  //     currentRefreshToken
  //   );

  //   if (!refreshSession) throw new Unauthorized();

  //   if (refreshSession.finger_print !== fingerprint.hash) throw new Forbidden();

  //   await RefreshSessionsRepository.deleteRefreshSession(currentRefreshToken);
  // }
}

module.exports = ProductService;
