'use strict';

const ClientProductPricesService = require('../services/ClientProductPrices.js');
const { ErrorUtils } = require('../utils/Errors.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_CLIENT_PRODUCT_PRICE_SOCKET,
  DELETE_CLIENT_PRODUCT_PRICE_SOCKET,
} = require('../src/constants/event.js');

class ClientProductPricesController {
  static async getAll(req, res) {
    try {
      const rows = await ClientProductPricesService.getAll();
      return res.status(200).json(rows);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async create(req, res) {
    try {
      const row = await ClientProductPricesService.create(req.body);
      myEmitter.emit(ADD_CLIENT_PRODUCT_PRICE_SOCKET, row);
      return res.status(200).json({ clientProductPrice: row });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async remove(req, res) {
    try {
      const id = await ClientProductPricesService.remove(req.params.id);
      myEmitter.emit(DELETE_CLIENT_PRODUCT_PRICE_SOCKET, id);
      return res.status(200).json({ id });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }
}

module.exports = ClientProductPricesController;
