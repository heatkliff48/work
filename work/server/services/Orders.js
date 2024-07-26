// const jwt = require('jsonwebtoken');
const TokenService = require('./Token.js');
const RefreshSessionsRepository = require('../repositories/RefreshSession.js');
const { ACCESS_TOKEN_EXPIRATION } = require('../constants.js');
const OrdersRepository = require('../repositories/Orders.js');

class OrdersService {
  static async getOrdersList({ id, username, email, fingerprint }) {
    const orders = await OrdersRepository.getOrdersListData();
    const payload = { id, username, email };

    const accessToken = await TokenService.generateAccessToken(payload);
    const refreshToken = await TokenService.generateRefreshToken(payload);

    await RefreshSessionsRepository.createRefreshSession({
      user_id: id,
      refresh_token: refreshToken,
      finger_print: fingerprint,
    });

    return {
      orders,
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    };
  }

  static async addNewOrder({
    id,
    username,
    email,
    fingerprint,
    article,
    // del_adr_id,
    owner,
    status,
    productList,
  }) {
    const newOrder = await OrdersRepository.addNewOrderData({
      article,
      // del_adr_id,
      owner,
      status,
      productList,
    });
    const payload = { id, username, email };

    const accessToken = await TokenService.generateAccessToken(payload);
    const refreshToken = await TokenService.generateRefreshToken(payload);

    await RefreshSessionsRepository.createRefreshSession({
      user_id: id,
      refresh_token: refreshToken,
      finger_print: fingerprint,
    });

    return {
      newOrder,
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    };
  }
}

module.exports = OrdersService;
