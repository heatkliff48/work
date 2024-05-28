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

  // static async signUp({ username, email, password, fingerprint, role }) {
  //   const userData = await UserRepository.getUserData(email);
  //   if (userData) {
  //     throw new Conflict('Пользователь с такой почтой уже существует.');
  //   }

  //   const hashedPassword = bcrypt.hashSync(password, 8);

  //   const user = await UserRepository.createUser({
  //     username,
  //     email,
  //     hashedPassword,
  //     role,
  //   });

  //   const payload = { id: user.id, username, email };

  //   const accessToken = await TokenService.generateAccessToken(payload);
  //   const refreshToken = await TokenService.generateRefreshToken(payload);

  //   await RefreshSessionsRepository.createRefreshSession({
  //     user_id: user.id,
  //     refresh_token: refreshToken,
  //     finger_print: fingerprint,
  //   });
  //   return {
  //     user,
  //     accessToken,
  //     refreshToken,
  //     accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
  //   };
  // }

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
