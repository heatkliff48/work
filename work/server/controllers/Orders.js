const { ErrorUtils } = require('../utils/Errors.js');
const OrdersService = require('../services/Orders.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_NEW_ORDER_SOCKET,
  ADD_DATASHIP_ORDER_SOCKET,
} = require('../src/constants/event.js');

class OrdersController {
  static async getOrdersList(req, res) {
    try {
      const orders = await OrdersService.getOrdersList();

      return res.status(200).json({ orders });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async addNewOrder(req, res) {
    const { article, del_adr_id, contact_id, owner, status } = req.body.order;

    try {
      const newOrder = await OrdersService.addNewOrder({
        article,
        del_adr_id,
        contact_id,
        owner,
        status,
      });

      myEmitter.emit(ADD_NEW_ORDER_SOCKET, newOrder);

      return res.status(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async addShippingDateOrder(req, res) {
    const date = req.body;

    try {
      await OrdersService.addShippingDateOrder({
        date,
      });

      myEmitter.emit(ADD_DATASHIP_ORDER_SOCKET, date);
      return res.status(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getProductsOfOrder(req, res) {
    try {
      const product_list = await OrdersService.getProductsOfOrder({});

      return res.status(200).json({ product_list });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getCurrentProductsOfOrder(req, res) {
    const { order_id } = req.body;

    try {
      const product_list = await OrdersService.getCurrentProductsOfOrder({
        order_id,
      });

      return res.status(200).json({ product_list });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getUpdateProductsOfOrder(req, res) {
    const { newProductsOfOrder } = req.body;

    try {
      await OrdersService.getUpdateProductsOfOrder({
        newProductsOfOrder,
      });

      return res.status(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getUpdateProductInfoOfOrder(req, res) {
    const productOfOrder = req.body;

    try {
      await OrdersService.getUpdateProductInfoOfOrder({
        productOfOrder,
      });

      return res.status(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getUpdateContactInfoOfOrder(req, res) {
    const { contact_id, order_id } = req.body;

    try {
      await OrdersService.getUpdateContactInfoOfOrder({
        contact_id,
        order_id,
      });

      return res.status(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getUpdateDeliveryAddressOrder(req, res) {
    const { address_id, order_id } = req.body;

    try {
      await OrdersService.getUpdateDeliveryAddressOrder({
        address_id,
        order_id,
      });

      return res.status(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getUpdateStatusOrder(req, res) {
    const { status, order_id } = req.body;

    try {
      await OrdersService.getUpdateStatusOrder({
        status,
        order_id,
      });

      return res.status(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getDeleteProductOfOrder(req, res) {
    const { product_id } = req.body;

    try {
      await OrdersService.getDeleteProductOfOrder({
        product_id,
      });

      return res.status(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getDeleteOrder(req, res) {
    const { order_id } = req.body;

    try {
      await OrdersService.getDeleteOrder({
        order_id,
      });

      return res.status(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }
}

module.exports = OrdersController;
