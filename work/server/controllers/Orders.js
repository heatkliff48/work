const { ErrorUtils } = require('../utils/Errors.js');
const OrdersService = require('../services/Orders.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_NEW_ORDER_SOCKET,
  ADD_DATASHIP_ORDER_SOCKET,
  UPDATE_PRODUCT_OF_ORDER_SOCKET,
  GET_DELETE_PRODUCT_OF_ORDER_SOCKET,
  UPDATE_STATUS_OF_ORDER_SOCKET,
  UPDATE_PERSON_IN_CHARGE_OF_ORDER_SOCKET,
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
    const { article, del_adr_id, contact_id, owner, status, person_in_charge } =
      req.body.order;

    try {
      const newOrder = await OrdersService.addNewOrder({
        article,
        del_adr_id,
        contact_id,
        owner,
        status,
        person_in_charge,
      });

      myEmitter.emit(ADD_NEW_ORDER_SOCKET, newOrder);

      return res.status(200).json(newOrder);
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
      const product_of_order = await OrdersService.getUpdateProductsOfOrder({
        newProductsOfOrder,
      });

      myEmitter.emit(UPDATE_PRODUCT_OF_ORDER_SOCKET, product_of_order);

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

      myEmitter.emit(UPDATE_STATUS_OF_ORDER_SOCKET, { status, order_id });

      return res.json({ status, order_id }).status(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getUpdateInChargeOrder(req, res) {
    console.log('-------------------------req.body', req.body);
    const { person_in_charge, order_id } = req.body;

    try {
      await OrdersService.getUpdateInChargeOrder({
        person_in_charge,
        order_id,
      });

      myEmitter.emit(UPDATE_PERSON_IN_CHARGE_OF_ORDER_SOCKET, {
        person_in_charge,
        order_id,
      });

      return res.json({ person_in_charge, order_id }).status(200);
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

      myEmitter.emit(GET_DELETE_PRODUCT_OF_ORDER_SOCKET, product_id);
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
