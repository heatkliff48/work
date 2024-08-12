const { ErrorUtils } = require('../utils/Errors.js');
const { COOKIE_SETTINGS } = require('../constants.js');
const OrdersService = require('../services/Orders.js');

class OrdersController {
  static async getOrdersList(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.user;
    try {
      const { accessToken, refreshToken, accessTokenExpiration, orders } =
        await OrdersService.getOrdersList({ id, username, email, fingerprint });

      return res
        .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
        .status(200)
        .json({ orders, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async addNewOrder(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.user;
    const { article, del_adr_id, contact_id, owner, status } = req.body.order;

    try {
      const { accessToken, refreshToken, accessTokenExpiration, newOrder } =
        await OrdersService.addNewOrder({
          id,
          username,
          email,
          fingerprint,
          article,
          del_adr_id,
          contact_id,
          owner,
          status,
        });

      return res
        .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
        .status(200)
        .json({ newOrder, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getProductsOfOrder(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.user;
    const { order_id } = req.body;

    try {
      const { accessToken, refreshToken, accessTokenExpiration, product_list } =
        await OrdersService.getProductsOfOrder({
          order_id,
          id,
          username,
          email,
          fingerprint,
        });

      return res
        .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
        .status(200)
        .json({ product_list, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getUpdateProductsOfOrder(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.user;
    const { newProductsOfOrder } = req.body;

    try {
      const { accessToken, refreshToken, accessTokenExpiration } =
        await OrdersService.getUpdateProductsOfOrder({
          newProductsOfOrder,
          id,
          username,
          email,
          fingerprint,
        });

      return res
        .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
        .status(200)
        .json({ accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getUpdateContactInfoOfOrder(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.user;
    const { contact_id, order_id } = req.body;

    try {
      const { accessToken, refreshToken, accessTokenExpiration } =
        await OrdersService.getUpdateContactInfoOfOrder({
          contact_id,
          order_id,
          id,
          username,
          email,
          fingerprint,
        });

      return res
        .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
        .status(200)
        .json({ accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getUpdateDeliveryAddressOrder(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.user;
    const { address_id, order_id } = req.body;

    try {
      const { accessToken, refreshToken, accessTokenExpiration } =
        await OrdersService.getUpdateDeliveryAddressOrder({
          address_id,
          order_id,
          id,
          username,
          email,
          fingerprint,
        });

      return res
        .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
        .status(200)
        .json({ accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getUpdateStatusOrder(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.user;
    const { status, order_id } = req.body;

    try {
      const { accessToken, refreshToken, accessTokenExpiration } =
        await OrdersService.getUpdateStatusOrder({
          status,
          order_id,
          id,
          username,
          email,
          fingerprint,
        });

      return res
        .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
        .status(200)
        .json({ accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getDeleteProductOfOrder(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.user;
    const { product_id } = req.body;

    try {
      const { accessToken, refreshToken, accessTokenExpiration } =
        await OrdersService.getDeleteProductOfOrder({
          product_id,
          id,
          username,
          email,
          fingerprint,
        });

      return res
        .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
        .status(200)
        .json({ accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getDeleteOrder(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.user;
    const { order_id } = req.body;

    try {
      const { accessToken, refreshToken, accessTokenExpiration } =
        await OrdersService.getDeleteOrder({
          order_id,
          id,
          username,
          email,
          fingerprint,
        });

      return res
        .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
        .status(200)
        .json({ accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }
}

module.exports = OrdersController;
