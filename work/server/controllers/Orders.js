const { ErrorUtils } = require('../utils/Errors.js');
const { COOKIE_SETTINGS } = require('../constants.js');
const OrdersService = require('../services/Orders.js');
const myEmitter = require('../src/ee.js');
const { ADD_NEW_ORDER_SOCKET, ADD_DATASHIP_ORDER_SOCKET } = require('../src/constants/event.js');

class OrdersController {
  static async getOrdersList(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.session.user;
    try {
      const { accessToken, refreshToken, accessTokenExpiration, orders } =
        await OrdersService.getOrdersList({ id, username, email, fingerprint });

      return res.status(200).json({ orders });
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ orders, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async addNewOrder(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.session.user;
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

      myEmitter.emit(ADD_NEW_ORDER_SOCKET, newOrder);

      return res.status(200);
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ newOrder, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async addShippingDateOrder(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.session.user;
    const date = req.body;

    try {
      const { accessToken, refreshToken, accessTokenExpiration } =
        await OrdersService.addShippingDateOrder({
          id,
          username,
          email,
          fingerprint,
          date,
        });

        myEmitter.emit(ADD_DATASHIP_ORDER_SOCKET, date)
      return res.status(200);
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ accessToken, accessTokenExpiration })
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getProductsOfOrder(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.session.user;

    try {
      const { accessToken, refreshToken, accessTokenExpiration, product_list } =
        await OrdersService.getProductsOfOrder({
          id,
          username,
          email,
          fingerprint,
        });

      return res.status(200).json({ product_list });
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ product_list, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getCurrentProductsOfOrder(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.session.user;
    const { order_id } = req.body;

    try {
      const { accessToken, refreshToken, accessTokenExpiration, product_list } =
        await OrdersService.getCurrentProductsOfOrder({
          order_id,
          id,
          username,
          email,
          fingerprint,
        });

      return res.status(200).json({ product_list });
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ product_list, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getUpdateProductsOfOrder(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.session.user;
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

      return res.status(200);
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ accessToken, accessTokenExpiration })
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getUpdateProductInfoOfOrder(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.session.user;
    const productOfOrder = req.body;

    try {
      const { accessToken, refreshToken, accessTokenExpiration } =
        await OrdersService.getUpdateProductInfoOfOrder({
          productOfOrder,
          id,
          username,
          email,
          fingerprint,
        });

      return res.status(200);
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ accessToken, accessTokenExpiration })
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getUpdateContactInfoOfOrder(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.session.user;
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

      return res.status(200);
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ accessToken, accessTokenExpiration })
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getUpdateDeliveryAddressOrder(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.session.user;
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

      return res.status(200);
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ accessToken, accessTokenExpiration })
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getUpdateStatusOrder(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.session.user;
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

      return res.status(200);
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ accessToken, accessTokenExpiration })
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getDeleteProductOfOrder(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.session.user;
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

      return res.status(200);
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ accessToken, accessTokenExpiration })
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getDeleteOrder(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.session.user;
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

      return res.status(200);
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ accessToken, accessTokenExpiration })
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }
}

module.exports = OrdersController;
