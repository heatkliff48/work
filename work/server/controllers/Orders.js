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
    const { order } = req.body;

    try {
      const { accessToken, refreshToken, accessTokenExpiration, newOrder } =
        await ProductService.addNewProduct({
          id,
          username,
          email,
          fingerprint,
          order,
        });
      return res
        .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
        .status(200)
        .json({ order: newOrder, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

}

module.exports = OrdersController;
